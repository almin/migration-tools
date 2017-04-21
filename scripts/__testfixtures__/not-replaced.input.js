// MIT © 2017 azu
"use strict";
import { Store } from "almin";
export default class ColorStore extends Store {
    constructor() {
        super();
        this.state = this.getState();
    }

    getState() {
        return this.state;
    }
}