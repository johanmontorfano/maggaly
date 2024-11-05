import { Request, Response } from "express";
import { context } from "../../../router";

interface Params {
    depotID: string;
    train_model: string;
}

/** This is meant to be called by MAGGALY to get a train out of a specific
* depot. It returns the ID of the train taken out, or `null` if no train is 
* available or the depot doesn't exist. */
export default function(req: Request<any, any, any, Params>, res: Response) {
    const depot = context.depots.filter(d => d.id === req.query.depotID);

    if (depot.length > 0) {
        const trainID = depot[0].takeTrainOut(req.query.train_model, context);
        if (trainID !== "null")
            return res.status(200).json({ trainID });
        return res.status(404).send("Train unavailable");
    }
    return res.status(404).send("Depot unavailable");

}
