// MIT © 2017 azu
"use strict";
import { Store } from "almin";
import ColorState from "./ColorState";
export default class ColorStore extends Store {
    constructor({ colorMixerRepository }) {
        super();
        this.state = new ColorState({
            currentColor: new Color({ hexCode: "#fff" })
        });
    }

    getState() {
        return {
            ColorState: this.state
        };
    }
}