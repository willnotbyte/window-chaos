import St from 'gi://St';
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';
import * as Meta from 'gi://Meta';
import Shell from 'gi://Shell';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';

export default class WindowChaosExtension extends Extension
{
    enable() 
    {
        log("Chaos enabled");

        this.settings = this.getSettings();

        this._theme = St.ThemeContext.get_for_stage(global.stage).get_theme();
        this._cssFile = Gio.File.new_for_path(
            this.path + '/stylesheet.css'
        );
        this._theme.load_stylesheet(this._cssFile);

        this._chaosButton = new St.Button({ label: "CHAOS", reactive: true, track_hover: true, style_class: "my-button" });
        let spacer1 = new St.Widget({ width: 6, reactive: false });
        this._tidyButton = new St.Button({ label: "TIDY", reactive: true, track_hover: true, style_class: "my-button" });
        let spacer2 = new St.Widget({ width: 6, reactive: false });
        this._undoButton = new St.Button({ label: "UNDO", reactive: true, track_hover: true, style_class: "my-button" });

        Main.panel._leftBox.insert_child_at_index(this._chaosButton, 1);
        Main.panel._leftBox.insert_child_at_index(spacer1, 2);
        Main.panel._leftBox.insert_child_at_index(this._tidyButton, 3);
        Main.panel._leftBox.insert_child_at_index(spacer2, 4);
        Main.panel._leftBox.insert_child_at_index(this._undoButton, 5);

        this._chaosPressId = this._chaosButton.connect('button-press-event', () => {
            this._chaos();
            return Clutter.EVENT_STOP;
        });
        this._tidyPressId = this._tidyButton.connect('button-press-event', () => {
            this._tidy();
            return Clutter.EVENT_STOP;
        });
        this._undoPressId = this._undoButton.connect('button-press-event', () => {
            this._undo();
            return Clutter.EVENT_STOP;
        });

        this._updateVisibility();

        // Watch all 4 keys so any change triggers a visibility refresh
        this._settingsChangedIds = [
            'show-buttons',
            'chaos-toggle',
            'tidy-toggle',
            'undo-toggle',
        ].map(key =>
            this.settings.connect(`changed::${key}`, () => this._updateVisibility())
        );
    }

    disable()
    {
        // Disconnect all settings listeners
        if (this._settingsChangedIds) {
            for (const id of this._settingsChangedIds)
                this.settings.disconnect(id);
            this._settingsChangedIds = null;
        }

        // Disconnect button signals
        if (this._chaosPressId) this._chaosButton?.disconnect(this._chaosPressId);
        if (this._tidyPressId)  this._tidyButton?.disconnect(this._tidyPressId);
        if (this._undoPressId)  this._undoButton?.disconnect(this._undoPressId);
        this._chaosPressId = null;
        this._tidyPressId = null;
        this._undoPressId = null;

        this.settings = null;
        this._theme.unload_stylesheet(this._cssFile);
        this._chaosButton?.destroy();
        this._tidyButton?.destroy();
        this._undoButton?.destroy();
        this._chaosButton = null;
        this._tidyButton = null;
        this._undoButton = null;

        Main.wm.removeKeybinding('chaos-key');
        Main.wm.removeKeybinding('tidy-key');
        Main.wm.removeKeybinding('undo-key');
    }

    _updateVisibility()
    {
        // Master switch gates everything; sub-switches control individual buttons
        const masterOn = this.settings.get_boolean('show-buttons');

        this._chaosButton.visible = masterOn && this.settings.get_boolean('chaos-toggle');
        this._tidyButton.visible  = masterOn && this.settings.get_boolean('tidy-toggle');
        this._undoButton.visible  = masterOn && this.settings.get_boolean('undo-toggle');
    }

    _getWindows()
    {
        return global.get_window_actors()
            .map(a => a.meta_window)
            .filter(w => w && w.get_window_type() === 0);
    }

    _chaos()
    {
        log("Chaos triggered");
        this._saveState();

        const windows = this._getWindows();
        const monitor = global.display.get_monitor_geometry(0);

        for (const win of windows)
        {
            const w = Math.floor(Math.random() * (monitor.width / 2)) + 300;
            const h = Math.floor(Math.random() * (monitor.height / 2)) + 200;

            const x = monitor.x + Math.floor(Math.random() * (monitor.width - w));
            const y = monitor.y + Math.floor(Math.random() * (monitor.height - h));

            win.move_resize_frame(false, x, y, w, h);
        }
    }

    _saveState()
    {
        this._state = this._getWindows().map(w => {
            return {
                win: w,
                rect: w.get_frame_rect()
            };
        });
    }

    _undo()
    {
        log("Undo triggered");

        if (!this._state) return;

        for (const entry of this._state) 
        {
            const { win, rect } = entry;

            if (win && rect)
            {
                win.move_resize_frame(
                    false,
                    rect.x,
                    rect.y,
                    rect.width,
                    rect.height
                );
            }
        }
    }

    _tidy()
    {
        log("Tidy triggered");
        this._saveState();

        const windows = this._getWindows();
        const monitor = global.display.get_monitor_geometry(0);

        const cols = Math.ceil(Math.sqrt(windows.length));
        const rows = Math.ceil(windows.length / cols);

        const cellW = Math.floor(monitor.width / cols);
        const cellH = Math.floor(monitor.height / rows);

        windows.forEach((win, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);

            win.move_resize_frame(
                false,
                monitor.x + col * cellW,
                monitor.y + row * cellH,
                cellW,
                cellH
            );
        });
    }
}