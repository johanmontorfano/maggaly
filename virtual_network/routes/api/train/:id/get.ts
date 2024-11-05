import { Request, Response } from "express";
import { context } from "../../../../router";

type RequestParams = Request<{id: string}>;

export function GET(req: RequestParams, res: Response) {
    const trains = context.trains.filter(t => t.id === req.params.id);

    if (trains.length === 0)
        return res.send("not_found").status(404);
    res.json(trains[0].serialize()).status(200); 
}
