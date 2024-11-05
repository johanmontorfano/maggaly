import { Request, Response } from "express";
import { context } from "../../../../router";

type RequestParams = Request<{trainID: string}>;

/** This is meant to be called by MAGGALY to get a train in the depot it's
* currently in, it makes it inoperable. If the specified train isn't on the
* coordinates of a depot, nothing is done.*/
export function POST(req: RequestParams, res: Response) {
    const trains = context.trains.filter(t => t.id === req.params.trainID);

    if (trains.length === 0)
        return res.send("not_found").status(404);
    
    const success = context.depots
        .map(d => d.parkTrain(req.params.trainID, context))
        .reduce((prev, curr) => prev || curr);

    return res.send(JSON.stringify(success)).status(200);
}
