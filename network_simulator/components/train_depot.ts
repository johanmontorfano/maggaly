import { NetworkContext } from "../context";
import { GenericNetworkComponent, GenericVehicle } from "./generic";

export class TrainDepot extends GenericNetworkComponent<GenericVehicle<any>[]> {
    constructor(trains: any & GenericVehicle<any>[]) {
        super(trains, true);
    }

    /** Removes a train from the depot, if available, and adds it to the network
    * context at the position of the depot. If no train is available, this 
    * function returns `false`. */
    takeTrainOut(model: string, context: NetworkContext): boolean {
        const tid = this.state.findIndex(t => t.getComponentName() == model);
        
        if (tid > -1) {
            const train = this.state.splice(tid, 1)[0];

            train.position = this.position;
            train.available = true;
            context.trains.push(train)
            return true;
        }
        return false;
    }

    getAvailableTrains(): {[name: string]: number} {
        const availability = {};

        this.state.forEach(train => {
            const name = train.getComponentName();
            availability[name] = (availability[name] || 0) + 1;
        });
        return availability;
    }
}
