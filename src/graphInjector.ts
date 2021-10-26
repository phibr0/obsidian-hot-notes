import { App, WorkspaceLeaf } from "obsidian";
import { DEFAULT_SETTINGS } from "./constants";
import { ColorGroup, HotNotesSettings, States } from "./types";

export default class GraphInjector {
    app: App;
    settings: HotNotesSettings;

    constructor(app: App, settings: HotNotesSettings) {
        this.app = app;
        this.settings = settings;
    }

    async initialize(): Promise<void> {
        const colors: ColorGroup[] = [];
        const keys = Object.keys(this.settings.states) as (keyof States)[];
        keys.forEach(key => {
            const state = this.settings.states[key];
            colors.push({
                color: state.color,
                query: `tag:#${key}`,
            });
        });
        await this.injectColorGroups(colors);
    }

    async injectColorGroups(groups: ColorGroup[]): Promise<void> {
        const colorGroups = this.getCurrentColorGroups();
        if (!colorGroups.find((c) => c.color.rgb == DEFAULT_SETTINGS.states.frozen.color.rgb)) {
            await this.setColorGroups(colorGroups.concat(groups.reverse()));
        }
    }

    getCurrentColorGroups(): ColorGroup[] {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        return this.app.internalPlugins.plugins.graph.instance.options.colorGroups;
    }

    /**
     * **This is another hacky workaround.**
     * 
     * If there are any Graph Leaves,
     * while editing the options Object on the Graph View Plugin,
     * the settings will get overwritten by the View.
     * To work around that, all Graph Views State's are set to "empty",
     * the options are changed, and then set to "graph" again.
     * 
     * @param groups Array of type ColorGroup to enable.
     */
    private async setColorGroups(groups: ColorGroup[]): Promise<void> {
        const graphLeafs: WorkspaceLeaf[] = [];
        this.app.workspace.iterateAllLeaves((leaf) => {
            if (leaf.getViewState().type === "graph") {
                graphLeafs.push(leaf);
                leaf.setViewState({ type: "empty" });
            }
        })

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        this.app.internalPlugins.plugins.graph.instance.options.colorGroups = groups;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        //@ts-ignore
        await this.app.internalPlugins.plugins.graph.instance.saveOptions();

        setImmediate(() => graphLeafs.forEach((leaf) => {
            leaf.setViewState({ type: "graph" });
        }));
    }
}