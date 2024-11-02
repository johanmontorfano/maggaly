import { GenericNetworkComponent, GenericVehicle } from "./components/generic";
import { Rails } from "./components/rails";
import { Station } from "./components/station";
import { TrainDepot } from "./components/train_depot";

/** The network context is the most important part of this simulator. This has
* been made a class because it would allow more flexibilty to run more 
* simulations concurrently. */
// TODO: Replace context values with actual values.
export class NetworkContext {
    depots: TrainDepot[];
    trains: GenericVehicle<any>[];
    lights: GenericNetworkComponent<any>[];
    switches: GenericNetworkComponent<any>[];
    stations: Station[];
    railSection: Rails[];

    maggalyPort: number;
    trainBotPort: number;
    maggalyConnection: EventSource | undefined;
    trainBotConnection: EventSource | undefined;

    startedAt: Date;
    paused: boolean;

    constructor() {
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
    }

    tick() {
        // TODO: Implement network component updates.
        // TODO: Implement `maggaly` decision making.
        // TODO: Implement trains updates.
        // TODO: Implement UI updates.
    }
}
