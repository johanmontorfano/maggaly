import { Vec2 } from "../context";
import { GenericNetworkComponent } from "./generic";

export enum RailSegmentType {
    Switch,
    Station,
    Depot,
    None
}

/** It's important to note that rails points should be defined from top to
* bottom and left to right. As vehicles have two directions (forward, backward)
* they will go from point[n]...point[n + 1] or point[n]...point[n - 1].*/
export class Rails extends GenericNetworkComponent<{
    points: Vec2[],
    electriclyFed: boolean;
    title?: string;
}> {
    segmentType: RailSegmentType;

    constructor(segmentType: RailSegmentType, ...points: Vec2[]) {
        super({points, electriclyFed: true}, true);
        this.position = points[0];
        this.segmentType = segmentType;
    }

    setSegmentTitle(title: string) {
        this.state.title = title;
    }

    tick() {
        this.randomUnavailbilityManager();
    }

    serialize(): { [field: string]: any; } {
        return {
            ...super.serialize(),
            type: this.segmentType
        }
    }
}
