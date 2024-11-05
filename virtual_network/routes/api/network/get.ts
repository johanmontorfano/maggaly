import { context } from "../../../router";
import { Request, Response } from "express";

type RequestParams = Request<any, any, any, {
    trains?: string,
    depots?: string,
    lights?: string,
    switches?: string
}>;

export function GET(req: RequestParams, res: Response) {
    const serializedData = {
        depots: context.depots.map(d => d.serialize()),
        trains: context.trains.map(t => t.serialize()),
        lights: context.lights.map(l => l.serialize()),
        switches: context.switches.map(s => s.serialize()),
        stations: context.stations.map(s => s.serialize()),
        railSection: context.railSection.map(r => r.serialize())
    };
    const responseData: any = {};

    if (Object.keys(req.query).length === 0)
        return res.json(serializedData);
    if (req.query.trains === "")
        responseData.trains = serializedData.trains;
    if (req.query.depots === "")
        responseData.depots = serializedData.depots;
    if (req.query.lights === "")
        responseData.lights = serializedData.lights;
    if (req.query.switches === "")
        responseData.switches = serializedData.switches;
    return res.json(responseData);
}
