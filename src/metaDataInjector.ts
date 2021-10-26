import { HotNotesSettings, States } from './types';
import { App, normalizePath, TagCache, TFile } from "obsidian";

export default class MetaDataInjector {
    app: App;
    settings: HotNotesSettings;

    constructor(app: App, settings: HotNotesSettings) {
        this.app = app;
        this.settings = settings;
    }

    initialize(): void {
        this.app.metadataCache.on("resolved", this.initHandler)
    }

    removeTags(tags: TagCache[]): void {
        tags.remove(tags.find(p => p.tag === "#frozen"));
        tags.remove(tags.find(p => p.tag === "#cold"));
        tags.remove(tags.find(p => p.tag === "#cool"));
        tags.remove(tags.find(p => p.tag === "#warm"));
        tags.remove(tags.find(p => p.tag === "#hot"));
    }

    initHandler = (): void => {
        const { metadataCache: cache, vault } = this.app;
        vault.getMarkdownFiles().forEach((file) => {
            if(!file) {
                return;
            }
            const fileState = this.settings.files[normalizePath(file.path)];
            const tags = cache.getFileCache(file).tags;
            if (tags) {
                this.removeTags(tags);
                tags.push(fileState
                    ? this.getTemperature(fileState.hitCount)
                    : {
                        tag: "#frozen", position
                    });
            } else {
                cache.getFileCache(file).tags = [fileState
                    ? this.getTemperature(fileState.hitCount)
                    : {
                        tag: "#frozen", position
                    }];
            }
        });
        this.app.metadataCache.off("resolved", this.initHandler);
        this.app.metadataCache.trigger("resolved");
        this.app.metadataCache.on("resolved", this.initHandler);
    }

    update(hitCount: number, path: string): void {
        const { metadataCache: cache, vault } = this.app;
        const file = vault.getAbstractFileByPath(normalizePath(path)) as TFile;
        if(!file) {
            return;
        }
        const tags = cache.getFileCache(file).tags;
        if (tags) {
            const temp = this.getTemperature(hitCount);
            if(!tags.find(t => t.tag === temp.tag)) {
                tags.push(temp);
            }
        } else {
            cache.getFileCache(file).tags = [this.getTemperature(hitCount)];
        }
        this.app.metadataCache.trigger("resolve", file);
    }

    getTemperature(hitCount: number): TagCache {
        const keys = Object.keys(this.settings.states).reverse() as (keyof States)[];

        for (let i = 0; i < keys.length; i++) {
            if (hitCount >= this.settings.states[keys[i]].threshold) {
                return {
                    tag: "#" + keys[i],
                    position
                }
            }
        }
        return {
            tag: "#frozen",
            position
        }
    }
}

const position = {
    end: {
        col: 0,
        line: 0,
        offset: 0
    },
    start: {
        col: 0,
        line: 0,
        offset: 0
    }
}