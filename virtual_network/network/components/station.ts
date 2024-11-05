import { GenericNetworkComponent } from "./generic";

export class Station extends GenericNetworkComponent<{name: string}> {
    constructor(name: string, pos: [number, number]) {
        super({name}, true);
        this.position = pos;
    }
}
