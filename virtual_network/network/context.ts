import { GenericNetworkComponent, GenericVehicle } from "./components/generic";
import { SwitchesLight } from "./components/lights";
import { Rails } from "./components/rails";
import { Station } from "./components/station";
import { Switches } from "./components/switches";
import { TrainDepot } from "./components/train_depot";

export type Vec2 = [number, number];

/** The network context is the most important part of this simulator. This has
* been made a class because it would allow more flexibilty to run more 
* simulations concurrently. */
// TODO: Replace context values with actual values.
export class NetworkContext {
    depots: TrainDepot[];
    trains: GenericVehicle<any>[];
    lights: SwitchesLight[];
    switches: Switches[];
    stations: Station[];
    railSection: Rails[];

    maggalyPort: number;
    trainBotPort: number;
    maggalyConnection: EventSource | undefined;
    trainBotConnection: EventSource | undefined;

    railFriction: number;

    startedAt: Date;
    paused: boolean;
    /** Determines how many px are one meter. */
    meterEquivalentPx: number;

    private initialState: any;

    constructor(initial?: {
        depots?: TrainDepot[],
        trains?: GenericVehicle<any>[],
        lights?: GenericNetworkComponent<any>[],
        switches?: Switches[],
        stations?: GenericNetworkComponent<any>[],
        railSection?: Rails[],
        maggalyPort?: number,
        trainBotPort?: number
    }) {
        this.depots = [];
        this.trains = [];
        this.lights = [];
        this.switches = [];
        this.stations = [];
        this.railSection = [];
        this.maggalyPort = 0;
        this.trainBotPort = 0;
        this.startedAt = new Date();
        this.paused = false;
        this.meterEquivalentPx = 0.1;
        this.railFriction = 0.25;
        this.initialState = initial

        this.resetNetwork();
    }

    resetNetwork() {
        const initial = this.initialState;

        if (initial) {
            this.depots = initial.depots || this.depots;
            this.trains = initial.trains || this.trains;
            this.lights = initial.lights || this.lights;
            this.switches = initial.switches || this.switches;
            this.stations = initial.stations || this.stations;
            this.railSection = initial.railSection || this.railSection;
            this.maggalyPort = initial.maggalyPort || this.maggalyPort;
            this.trainBotPort = initial.trainBotPort || this.trainBotPort;
        }
    }

    tick() {
        this.switches.forEach(s => s.tick(this));
        // TODO: Implement `maggaly` decision making.
        this.trains.forEach(t => t.tick(this));
        // TODO: Implement UI updates.
    }
}
