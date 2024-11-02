import { context } from "../..";
import { Route } from "../..";

const route: Route = (_, res) => {
    res.send({
        train: context.trains.map(t => t.serialize()),
        rails: context.railSection.map(r => r.serialize()),
        depots: context.depots.map(d => d.serialize()),
        stations: context.stations.map(s => s.serialize()),
    });
};

export default route;
