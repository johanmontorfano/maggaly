import { GenericNetworkComponent } from "./generic";

type Vec2 = [number, number];

export class Rails extends GenericNetworkComponent<{points: Vec2[]}> {
    constructor(points: Vec2[]) {
        super({points}, true);

        this.position = points[0];
    }

    tick() {
        this.randomUnavailbilityManager();
    }
}
