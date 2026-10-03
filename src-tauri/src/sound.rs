use std::io::Cursor;

const ALERT_WAV: &[u8] = include_bytes!("../sounds/alert.wav");

pub fn play_alert() {
    std::thread::spawn(|| {
        if let Err(error) = play_blocking() {
            eprintln!("could not play the alert sound: {error}");
        }
    });
}

fn play_blocking() -> Result<(), Box<dyn std::error::Error>> {
    let device = rodio::DeviceSinkBuilder::open_default_sink()?;
    let player = rodio::play(device.mixer(), Cursor::new(ALERT_WAV))?;
    player.sleep_until_end();
    Ok(())
}
