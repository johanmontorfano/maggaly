import { NetworkContext } from "../context";
import { GenericNetworkComponent } from "./generic";
import { Rails } from "./rails";

/** Allows changing roads programatically, this is not a "real" network
* component but rather an interface that manages rails in the context. 
* A switch CAN'T have more than two rails, both mush start at the same place.*/
export class Switches extends GenericNetworkComponent<{opened: number}> {
    private rails: (Rails & {count: number})[];
    private contextHasRails: boolean;

    constructor(
        ...rails: Rails[]
    ) {
        super({opened: 0}, true);
        
        this.rails = rails as typeof this.rails;
        this.contextHasRails = false;
        this.toggleState();
    }

    tick(context: NetworkContext) {
        if (!this.contextHasRails) {
            this.contextHasRails = true;
            this.rails.forEach((rail, i) => {
                rail.count = i;
                rail.setID("seg" + this.id + "-" + i);
                context.railSection.push(rail);
            });
        }
    }

    toggleState() {
        this.state.opened = this.state.opened !== 0 ? 0 : 1;
        this.rails.forEach((rail, i) => {
            rail.available = i === this.state.opened;
        });
    }
}
