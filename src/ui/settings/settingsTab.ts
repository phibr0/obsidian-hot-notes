import { PluginSettingTab, App } from "obsidian";
import HotNotesPlugin from "src/main";

export class HotNotesSettingsTab extends PluginSettingTab {
    plugin: HotNotesPlugin;

    constructor(app: App, plugin: HotNotesPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;

        containerEl.empty();

        containerEl.createEl('h2', { text: 'Hot Notes - Settings' });
    }
}
