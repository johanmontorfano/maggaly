import { Request, Response } from "express";
import { context } from "../../../router";

interface Params {
    trainID: string;
}

/** This is meant to be called by MAGGALY to get a train in the depot it's
* currently in, it makes it inoperable. If the specified train isn't on the
* coordinates of a depot, nothing is done.*/
export default function(req: Request<any, any, any, Params>, res: Response) {
    const trains = context.trains.filter(d => d.id === req.query.trainID);

    if (trains.length > 0) {
        const success = context.depots
            .map(d => d.parkTrain(req.query.trainID, context))
            .reduce((prev, curr) => prev || curr);
        
        if (success)
            return res.status(200).send("OK");
    }
    return res.status(404).send("Train not found");

}
