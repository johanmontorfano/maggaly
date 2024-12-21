import { context } from "../../../router";
import { Request, Response } from "express";

type RequestParams = Request<any, any, any, {
    trains?: string,
    lights?: string,
    tokens?: string,
    switches?: string
}>;

export function GET(req: RequestParams, res: Response) {
    const serializedData = {
        trains: context.trains.map(t => t.serialize()),
        lights: context.lights.map(l => l.serialize()),
        switches: context.switches.map(s => s.serialize()),
        sections: context.sections.map(r => r.serialize()),
        tokens: context.tokens.map(t => t.serialize())
    };
    const responseData: any = {};

    if (Object.keys(req.query).length === 0)
        return res.json(serializedData);
    if (req.query.trains === "")
        responseData.trains = serializedData.trains;
    if (req.query.tokens === "")
        responseData.tokens = serializedData.tokens;
    if (req.query.lights === "")
        responseData.lights = serializedData.lights;
    if (req.query.switches === "")
        responseData.switches = serializedData.switches;
    return res.json(responseData);
}
