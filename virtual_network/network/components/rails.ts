import { Vec2 } from "../context";
import { GenericNetworkComponent } from "./generic";

/** It's important to note that rails points should be defined from top to
* bottom and left to right. As vehicles have two directions (forward, backward)
* they will go from point[n]...point[n + 1] or point[n]...point[n - 1].*/
export class Rails extends GenericNetworkComponent<{
    points: Vec2[],
    electriclyFed: boolean
}> {
    constructor(...points: Vec2[]) {
        super({points, electriclyFed: true}, true);
        this.position = points[0];
    }

    tick() {
        this.randomUnavailbilityManager();
    }
}
