use std::sync::Mutex;
use std::time::{Duration, SystemTime, UNIX_EPOCH};

use serde::Deserialize;
use tauri::{AppHandle, Manager, State};
use tauri_plugin_notification::NotificationExt;

use crate::sound;

const TICK: Duration = Duration::from_secs(1);
const STALE_AFTER_MS: u64 = 60_000;

#[derive(Clone, Debug, PartialEq, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Alert {
    pub slug: String,
    pub name: String,
    pub at_ms: u64,
}

#[derive(Default)]
pub struct AlertQueue(Mutex<Vec<Alert>>);

impl AlertQueue {
    fn replace(&self, mut alerts: Vec<Alert>) {
        alerts.sort_by_key(|alert| alert.at_ms);
        *self.0.lock().unwrap() = alerts;
    }

    /// Removes every alert that is due. Alerts that are too old (for example,
    /// after the PC wakes from sleep) are removed but not returned.
    fn take_due(&self, now_ms: u64) -> Vec<Alert> {
        let mut alerts = self.0.lock().unwrap();
        let due_count = alerts.iter().take_while(|alert| alert.at_ms <= now_ms).count();
        alerts
            .drain(..due_count)
            .filter(|alert| now_ms - alert.at_ms < STALE_AFTER_MS)
            .collect()
    }
}

#[tauri::command]
pub fn schedule_alerts(queue: State<AlertQueue>, alerts: Vec<Alert>) {
    queue.replace(alerts);
}

#[tauri::command]
pub fn test_alert(app: AppHandle) {
    notify(&app, "Test alert", "This is how a spawn alert looks and sounds.");
    sound::play_alert();
}

pub fn start(app: AppHandle) {
    std::thread::spawn(move || loop {
        let due = app.state::<AlertQueue>().take_due(now_ms());
        if !due.is_empty() {
            for alert in &due {
                notify(&app, &alert.name, &format!("{} spawns in 1 minute", alert.name));
            }
            sound::play_alert();
        }
        std::thread::sleep(TICK);
    });
}

pub fn notify(app: &AppHandle, title: &str, body: &str) {
    if let Err(error) = app.notification().builder().title(title).body(body).show() {
        eprintln!("could not show the notification: {error}");
    }
}

fn now_ms() -> u64 {
    SystemTime::now()
        .duration_since(UNIX_EPOCH)
        .map(|elapsed| elapsed.as_millis() as u64)
        .unwrap_or(0)
}

#[cfg(test)]
mod tests {
    use super::*;

    fn alert(slug: &str, at_ms: u64) -> Alert {
        Alert { slug: slug.into(), name: slug.into(), at_ms }
    }

    #[test]
    fn returns_nothing_before_the_alert_time() {
        let queue = AlertQueue::default();
        queue.replace(vec![alert("paissa", 10_000)]);

        assert!(queue.take_due(9_999).is_empty());
    }

    #[test]
    fn returns_each_due_alert_once() {
        let queue = AlertQueue::default();
        queue.replace(vec![alert("island-stag", 10_000), alert("twinklefleece", 10_000), alert("paissa", 50_000)]);

        assert_eq!(queue.take_due(10_500).len(), 2);
        assert!(queue.take_due(10_600).is_empty());
    }

    #[test]
    fn sorts_alerts_by_time() {
        let queue = AlertQueue::default();
        queue.replace(vec![alert("late", 20_000), alert("early", 10_000)]);

        assert_eq!(queue.take_due(10_000), vec![alert("early", 10_000)]);
    }

    #[test]
    fn drops_stale_alerts_after_sleep() {
        let queue = AlertQueue::default();
        queue.replace(vec![alert("paissa", 10_000), alert("morbol", 200_000)]);

        assert!(queue.take_due(10_000 + STALE_AFTER_MS).is_empty());
        assert_eq!(queue.take_due(200_000).len(), 1);
    }

    #[test]
    fn replacing_the_queue_removes_old_alerts() {
        let queue = AlertQueue::default();
        queue.replace(vec![alert("paissa", 10_000)]);
        queue.replace(vec![]);

        assert!(queue.take_due(10_000).is_empty());
    }
}
