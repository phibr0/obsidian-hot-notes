import { Plugin, TFile } from 'obsidian';
import { DEFAULT_SETTINGS } from './constants';
import GraphInjector from './graphInjector';
import MetaDataInjector from './metaDataInjector';
import { HotNotesSettings } from './types';
import { HotNotesSettingsTab } from './ui/settings/settingsTab';

export default class HotNotesPlugin extends Plugin {
    settings: HotNotesSettings;
    graphInjector: GraphInjector;
    metaDataInjector: MetaDataInjector;

    openHandle = async (file: TFile): Promise<void> => {
        if (file) {
            const fileState = this.settings.files[file.path];
            if (fileState) {
                fileState.hitCount++;
                this.metaDataInjector.update(fileState.hitCount, file.path);
            } else {
                this.settings.files[file.path] = { hitCount: 1 };
                this.metaDataInjector.update(this.settings.files[file.path].hitCount, file.path);
            }
            await this.saveSettings();
        }
    }

    async onload(): Promise<void> {
        console.log('loading plugin: Hot Notes');

        await this.loadSettings();

        this.addSettingTab(new HotNotesSettingsTab(this.app, this));

        this.graphInjector = new GraphInjector(this.app, this.settings);
        this.metaDataInjector = new MetaDataInjector(this.app, this.settings);

        this.app.workspace.onLayoutReady(async () => {
            await this.graphInjector.initialize();
            this.metaDataInjector.initialize();

            this.app.workspace.on("file-open", this.openHandle);
        });
    }

    onunload(): void {
        console.log('unloading plugin: Hot Notes');
        this.app.workspace.off("file-open", this.openHandle);
    }

    async loadSettings(): Promise<void> {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings(): Promise<void> {
        await this.saveData(this.settings);
    }
}