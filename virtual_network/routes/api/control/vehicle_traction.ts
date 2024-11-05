import { Request, Response } from "express";
import { context } from "../../../router";

interface Params {
    trainID: string;
    accelerationRate: number;
    brakingRate: number;
}

/** This is meant to be called by MAGGALY to get a train to move (or not). If
* the specified train isn't available, nothing is done. */
export default function(req: Request<any, any, any, Params>, res: Response) {
    const trains = context.trains.filter(d => d.id === req.query.trainID);

    if (trains.length > 0) {
        trains[0].updateAccelerationData(
            req.query.accelerationRate, 
            req.query.brakingRate
        );
        return res.status(200).send("OK");
    }
    return res.status(404).send("Train not found");
}
