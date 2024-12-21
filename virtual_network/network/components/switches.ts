import { NetworkContext } from "../context";
import { GenericNetworkComponent } from "./generic";
import { SwitchesLight } from "./lights";
import { Rails } from "./rails";

/** Allows changing roads programatically, this is not a "real" network
* component but rather an interface that manages rails in the context. 
*
* A switch CAN'T have more than two rails, both mush start at the same place.
* If it doesn't have a common starting point, the switch isn't created and the
* network will crash. */
export class Switches extends GenericNetworkComponent<{opened: number}> {
    private rails: (Rails & {count: number})[];
    private lights: (SwitchesLight & {
        onStartingPoint: boolean,
        count: number
    })[];
    private contextHasRails: boolean;

    constructor(
        ...rails: Rails[]
    ) {
        super({opened: 0}, true);
        
        if (rails.length !== 2)
            throw new Error("Switches should be composed of two rails");
        this.rails = rails as typeof this.rails;
        this.lights = [];
        this.contextHasRails = false;
        this.setRails();
        this.setSwitchesLights();
        this.toggleState();
    }

    // Only used to set rails count id before switches lights are set up since 
    // they need to extrapolate the appartenance of a light to a segment to
    // work properly.
    private setRails() {
        this.rails.forEach((rail, i) => {
            rail.count = i;
        });
    }

    private setSwitchesLights() {
        // Since rails can have multiple points, we only get the first and last
        // points to apply switches lights.
        const railsPoints = [
            this.rails[0].state.points[0],
            this.rails[1].state.points[0],
            this.rails[0].state.points[this.rails[0].state.points.length - 1],
            this.rails[1].state.points[this.rails[1].state.points.length - 1]
        ];
        let foundEntry = false;

        railsPoints.forEach((point, i) => {
            const light: typeof this.lights[0] = new SwitchesLight() as any;
            let pointOccurences = 0;

            railsPoints.forEach(p => {
                if (p[0] === point[0] && p[1] === point[1])
                    pointOccurences += 1;
            });
            if (pointOccurences === 2 && foundEntry)
                return;
            if (pointOccurences === 2 && !foundEntry)
                foundEntry = true;
            light.position = point;
            light.onStartingPoint = pointOccurences === 2;
            light.count = this.rails[i % 2].count;
            this.lights.push(light);
        });
    }

    /** i.e. When the switch is toggled to 0, the entry light is off. */
    private updateSwitchesLights() {
        this.lights.forEach(light => {
            if (light.onStartingPoint) 
                light.state.on = this.state.opened === 1;
            else 
                light.state.on = (this.state.opened ? 1 : 0) === light.count;
        });
    }

    tick(context: NetworkContext) {
        if (!this.contextHasRails) {
            this.contextHasRails = true;
            this.rails.forEach((rail, i) => {
                rail.setID("seg" + this.id + "(rail-" + i + ")");
                context.sections.push(rail);
            });
            this.lights.forEach((light, i) => {
                light.setID("seg" + this.id + "(light-" + i + ")");
                context.lights.push(light);
            });
        }
    }

    toggleState() {
        this.state.opened = this.state.opened !== 0 ? 0 : 1;
        this.rails.forEach((rail, i) => {
            rail.available = i === this.state.opened;
        });
        this.updateSwitchesLights();
    }
}
