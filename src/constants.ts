import { HotNotesSettings } from "./types";

export const DEFAULT_SETTINGS: HotNotesSettings = {
    states: {
        frozen: {
            threshold: 1,
            color: {
                a: 1,
                rgb: parseInt('0x01A99C', 16),
            }
        },
        cold: {
            threshold: 10,
            color: {
                a: 1,
                rgb: parseInt('0x0264C5', 16),
            }
        },
        cool: {
            threshold: 25,
            color: {
                a: 1,
                rgb: parseInt('0xF38D04', 16),
            }
        },
        warm: {
            threshold: 50,
            color: {
                a: 1,
                rgb: parseInt('0xF46523', 16),
            }
        },
        hot: {
            threshold: 80,
            color: {
                a: 1,
                rgb: parseInt('0xDF2E36', 16),
            }
        },
    },
    files: {},
}