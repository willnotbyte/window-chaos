import Adw from 'gi://Adw';
import Gtk from 'gi://Gtk';
import Gdk from 'gi://Gdk';
import Gio from 'gi://Gio';

import { ExtensionPreferences } from 'resource:///org/gnome/Shell/Extensions/js/extensions/prefs.js';

export default class WindowChaosPrefs extends ExtensionPreferences {
    fillPreferencesWindow(window) {
        const settings = this.getSettings();

        const page = new Adw.PreferencesPage();
        window.add(page);

        const uiGroup = new Adw.PreferencesGroup({
            title: 'UI'
        });

        // --- MASTER TOGGLE (ExpanderRow) ---
        // Acts as both the on/off switch and the expandable container for sub-toggles
        const masterExpander = new Adw.ExpanderRow({
            title: 'Show All Buttons',
            show_enable_switch: true,  // puts the toggle on the left
            expanded: false,
        });

        settings.bind(
            'show-buttons',
            masterExpander,
            'enable-expansion',
            Gio.SettingsBindFlags.DEFAULT
        );

        // Collapse the expander when the master is turned off
        settings.connect('changed::show-buttons', () => {
            if (!settings.get_boolean('show-buttons'))
                masterExpander.expanded = false;
        });

        // --- SUB-TOGGLES (nested inside the expander) ---
        const chaosToggle = new Adw.SwitchRow({
            title: 'Show Chaos Button',
        });
        settings.bind('chaos-toggle', chaosToggle, 'active', Gio.SettingsBindFlags.DEFAULT);

        const tidyToggle = new Adw.SwitchRow({
            title: 'Show Tidy Button',
        });
        settings.bind('tidy-toggle', tidyToggle, 'active', Gio.SettingsBindFlags.DEFAULT);

        const undoToggle = new Adw.SwitchRow({
            title: 'Show Undo Button',
        });
        settings.bind('undo-toggle', undoToggle, 'active', Gio.SettingsBindFlags.DEFAULT);

        masterExpander.add_row(chaosToggle);
        masterExpander.add_row(tidyToggle);
        masterExpander.add_row(undoToggle);

        uiGroup.add(masterExpander);
        page.add(uiGroup);
    }
}
