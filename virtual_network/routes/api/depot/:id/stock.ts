import { Request, Response } from "express";
import { context } from "../../../../router";

type RequestParams = Request<{id: string}, any, any, {named?: string}>;

export function GET(req: RequestParams, res: Response) {
    // If `named` is present on the request, everything is returned as
    // `{name: string, model: string}[]`. Otherwise, the regular stock
    // computed by the depot is returned.

    const depots = context.depots.filter(d => d.id === req.params.id);

    if (depots.length === 0)
        return res.send("not_found").status(404);
    if (req.query.named === "") {
        res.json(depots[0].state.map(vehicle => {
            return { name: vehicle.id, model: vehicle.type };
        })).status(200);
    }
    res.json(depots[0].getAvailableTrains()).status(200);
}
