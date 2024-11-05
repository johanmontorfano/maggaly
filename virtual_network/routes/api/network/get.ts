import { context } from "../../../router";
import { Response } from "express";

export default function(_: any, res: Response) {
    res.json({
        depots: context.depots.map(d => d.serialize()),
        trains: context.trains.map(t => t.serialize()),
        lights: context.lights.map(l => l.serialize()),
        switches: context.switches.map(s => s.serialize()),
        stations: context.stations.map(s => s.serialize()),
        railSection: context.railSection.map(r => r.serialize())
    });
}
