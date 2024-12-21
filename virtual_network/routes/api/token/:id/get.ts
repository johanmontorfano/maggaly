import { Request, Response } from "express";
import { context } from "../../../../router";

type RequestParams = Request<{trainID: string, tokenID: string}>;

/** Returns the content of a token but requires a `reader` (vehicle ID) */
export function GET(req: RequestParams, res: Response) {
    const trains = context.trains.filter(t => t.id === req.params.trainID);
    const tokens = context.tokens.filter(t => t.id === req.params.tokenID);

    if (trains.length === 0 || tokens.length === 0)
        return res.send("not_found").status(404);
    res.send(tokens[0].readContent(trains[0])).status(200);
}
