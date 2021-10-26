export interface HotNotesSettings {
    states: States;
    files: FileStates;
}

export interface States {
    frozen: TemperatureState;
    cold: TemperatureState;
    cool: TemperatureState;
    warm: TemperatureState;
    hot: TemperatureState;
}

export interface ColorGroup {
    //Obsidian Query String
    query: string;
    color: ObsidianColor;
}

export interface ObsidianColor {
    //Alpha Value, 0-1
    a: number;
    //RGB Value, 000000000-255255255
    rgb: number;
}

export interface TemperatureState {
    threshold: number;
    color: ObsidianColor;
}

export interface FileStates {
    [path: string]: {
        hitCount: number;
    }
}