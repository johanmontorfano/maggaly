import { Request, Response } from "express";
import { context } from "../../../../router";

type RequestParams = Request<{id: string}>;

export function GET(req: RequestParams, res: Response) {
    const switches = context.switches.filter(s => s.id === req.params.id);

    if (switches.length === 0)
        return res.send("not_found").status(404);
    res.json(switches[0].serialize()).status(200); 
}
