import { Request, Response } from "express";
import { context } from "../../../../router";

type RequestParams = Request<
    {id: string}, 
    any, 
    any, 
    {brate: string, arate: string}
>;

/** Checks if a value is set and is a number. 
* Used to check request integrity. */
function chkval(val: any) {
    return val !== undefined && typeof parseInt(val) === "number";
}

export function POST(req: RequestParams, res: Response) {
    const trains = context.trains.filter(t => t.id === req.params.id);

    if (trains.length === 0)
        return res.send("not_found").status(404);
    if (!chkval(req.query.arate) || !chkval(req.query.brate))
        return res.send("malformed").status(400);

    const {arate, brate} = req.query;

    trains[0].updateAccelerationData(parseInt(arate), parseInt(brate));
    return res.send("OK").status(200);
}
