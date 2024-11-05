import { Request, Response } from "express";
import { context } from "../../../../router";

type RequestParams = Request<
    {id: string}, 
    any, 
    any, 
    {model?: string, name?: string}
>;

export function POST(req: RequestParams, res: Response) {
    if (req.query.name === undefined && req.query.model === undefined)
        return res.send("no_vehicle_querying_field_found");

    const depots = context.depots.filter(d => d.id === req.params.id);
    const label = (req.query.model || req.query.name) as string;

    if (depots.length === 0)
        return res.send("not_found").status(404);
    
    const trainID = depots[0].takeTrainOut(label, context);
    
    if (trainID === "null")
        return res.send("null").status(500);
    res.send(trainID).status(200);
}
