# Island Tracker

A small desktop app for **FINAL FANTASY XIV Island Sanctuary**. It shows when rare animals spawn, plays a sound 1 minute before the animals you select, and keeps a count of the animals in your pasture.

## Safe to use

The app **does not interact with the game**. It does not read game memory, network packets, or game files. It only uses your PC clock and the public Eorzea time and weather formulas.

## Install (Windows)

1. Download the latest `-setup.exe` file from the [Releases](../../releases) page.
2. Run the file. The app installs for your user only and does not need admin rights.
3. Windows SmartScreen can show "Windows protected your PC" because the installer is not code-signed. Select **More info → Run anyway**.
4. Open **Island Tracker** from the Start menu.

Clicking ✕ hides the app in the system tray, so alerts keep working. To close the app, right-click the tray icon and select **Quit**.

## How it works

- 1 Eorzea hour = 175 real seconds.
- The weather changes every 8 Eorzea hours. The game picks it from a deterministic hash of the time, so the app can calculate it for any moment.
- Each rare animal needs a time window, a weather, or both. The app checks these rules hour by hour.

## Development (Windows)

Requirements: [Node.js LTS](https://nodejs.org), [Rust](https://rustup.rs), and the [Tauri prerequisites](https://tauri.app/start/prerequisites/).

```bash
npm install
npm test            # domain tests
npm run tauri dev   # run the app
npm run tauri build # build the installer
```

## Credits

- Weather formula: [SaintCoinach](https://github.com/xivapi/SaintCoinach) `WeatherRate.cs`, and the JavaScript port by [Kikugumo](https://github.com/Kikugumo/FFXIV-Weather-Forecast).
- Rare animal conditions and reference values: [Thonky's Rare Animal Tracker](https://www.thonky.com/final-fantasy-xiv/island-sanctuary-rare-animal-tracker).

## Legal

FINAL FANTASY is a registered trademark of Square Enix Holdings Co., Ltd. This is a fan project. It is not affiliated with or endorsed by Square Enix.
