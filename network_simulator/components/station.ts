import { GenericNetworkComponent } from "./generic";

export class Station extends GenericNetworkComponent<{name: string}> {
    constructor(name: string) {
        super({name}, true);
    }
}
