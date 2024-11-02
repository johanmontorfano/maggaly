import { NetworkContext } from "../context";

/** Generic class a component should always extend. */
export class GenericNetworkComponent<T> {
    state: T;
    position: [number, number];
    available: boolean;
    currentController: "maggaly" | "manual";

    private unavailableFor: number;

    constructor(initialState: T, available: boolean) {
        this.state = initialState;
        this.available = available;

        this.position = [0, 0];
        this.currentController = "manual";
        this.unavailableFor = 0;
    }

    /** The controller can either be `maggaly` or the manual mode */
    receiveControllerUpdate() {}
    tick(context: NetworkContext) {}    

    serialize() {
        return {
            type: this.getComponentName(),
            position: this.position,
            state: this.state,
            available: this.available ? 1 : 0,
            controller: this.currentController
        }
    }

    getComponentName(): string {
        return this.constructor.name;
    }

    randomUnavailbilityManager() {
        if (this.unavailableFor === 0 && Math.random() > 0.7) {
            this.unavailableFor = Math.floor(Math.random() * 1000);
            this.available = true;
        } else if (this.unavailableFor === 0 && !this.available) {
            this.available = true;
        } else {
            this.unavailableFor -= 1;
        }
    }
}

/** Extend network components identified as vehicles */
export class GenericVehicle<T> extends GenericNetworkComponent<T> {
    accelerationPower: number;      // W
    brakesPower: number;            // W
    weight: number;                 // kgs

    constructor(state: T, available: boolean) {
        super(state, available);

        this.accelerationPower = 0;
        this.brakesPower = 0;
        this.weight = 0;
    }
}
