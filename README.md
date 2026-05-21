# Window Chaos Manager

A GNOME Shell extension that adds three panel buttons for fast, fun window management.

![GNOME Shell](https://img.shields.io/badge/GNOME%20Shell-45--50-4A86CF?logo=gnome&logoColor=white)
![Version](https://img.shields.io/badge/version-1-green)
![License](https://img.shields.io/badge/license-GPL--2.0-blue)

---

## Features

- **CHAOS** — randomizes the position and size of every open window
- **TIDY** — arranges all windows into a clean grid
- **UNDO** — restores windows to where they were before the last action
- **Configurable** — show or hide all buttons, or toggle each one individually via the preferences panel

---

## Installation

### From GNOME Extensions Website

Visit [extensions.gnome.org](https://extensions.gnome.org) and search for **Window Chaos Manager**.

### Manual Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/window-chaos.git
   ```

2. Copy the extension to your GNOME extensions folder:
   ```bash
   cp -r window-chaos ~/.local/share/gnome-shell/extensions/window-chaos@willnotbyte
   ```

3. Compile the GSettings schema:
   ```bash
   glib-compile-schemas ~/.local/share/gnome-shell/extensions/window-chaos@willnotbyte/schemas/
   ```

4. Restart GNOME Shell:
   - **X11:** Press `Alt + F2`, type `r`, press Enter
   - **Wayland:** Log out and log back in

5. Enable the extension:
   ```bash
   gnome-extensions enable window-chaos@willnotbyte
   ```
   Or use the **Extensions** app / **GNOME Tweaks**.

---

## Preferences

Open the extension preferences via the Extensions app or GNOME Tweaks.

- **Show All Buttons** — master toggle that enables or disables all panel buttons at once
  - **Show Chaos Button** — individually toggle the CHAOS button
  - **Show Tidy Button** — individually toggle the TIDY button
  - **Show Undo Button** — individually toggle the UNDO button

---

## Compatibility

| GNOME Shell | Supported |
|-------------|-----------|
| 45          | ✅        |
| 46          | ✅        |
| 47          | ✅        |
| 48          | ✅        |
| 49          | ✅        |
| 50          | ✅        |

---

## Project Structure

```
window-chaos@willnotbyte/
├── extension.js       # Core extension logic
├── prefs.js           # Preferences UI
├── metadata.json      # Extension metadata
├── stylesheet.css     # Panel button styles
└── schemas/
    └── org.gnome.shell.extensions.window-chaos.gschema.xml
```

---

## License

This project is licensed under the [GPL-2.0 License](LICENSE).
