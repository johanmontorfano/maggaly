import { GenericNetworkComponent } from "./generic";

/** Switches state traffic light. This component is only used to hold a state
* since the switches will put the lights and compute their state. */
export class SwitchesLight extends GenericNetworkComponent<{on: boolean}> {
    constructor() {
        super({on: false}, true);
    }
}
