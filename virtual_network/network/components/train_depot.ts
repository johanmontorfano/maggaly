import { NetworkContext } from "../context";
import { GenericNetworkComponent, GenericVehicle } from "./generic";

export class TrainDepot extends GenericNetworkComponent<GenericVehicle<any>[]> {
    constructor(pos: [number, number], ...trains: any & GenericVehicle<any>[]) {
        super(trains, true);

        this.position = pos;
    }

    /** Removes a train from the depot, if available, and adds it to the network
    * context at the position of the depot. If no train is available, this 
    * function returns `null`.
    * The model of the train may refer to it's id. */
    takeTrainOut(model: string, context: NetworkContext): string {
        const index = this.state
            .findIndex(t => t.type == model || t.id == model);
        
        if (index > -1) {
            const train = this.state.splice(index, 1)[0];

            train.position = this.position;
            train.available = true;
            context.trains.push(train)
            return train.id;
        }
        return "null";
    }

    /** Adds a train to the depot, if it's on it, and remvoes it from the 
    * network context. If the train isn't on the depot, this function returns 
    * `false`. */
    parkTrain(trainID: string, context: NetworkContext): boolean {
        const id = context.trains.findIndex(t => t.id === trainID);

        if (id > -1 && context.trains[id].position === this.position) {
            this.state.push(context.trains.splice(id, 1)[0]);
            return true;
        }
        return false;
    }

    getAvailableTrains() {
        const availability: {[name: string]: number} = {};

        this.state.forEach(train => {
            availability[train.type] = (availability[train.type] || 0) + 1;
        });
        return availability;
    }
}
