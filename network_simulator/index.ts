import Express from "express";
import { Rails } from "./components/rails";
import { Station } from "./components/station";
import { MPL85 } from "./components/train";
import { TrainDepot } from "./components/train_depot";
import { NetworkContext } from "./context";
import { Request, Response } from "express";

export type Route = (req: Request, res: Response) => void;

const app = Express();
export const context = new NetworkContext();

const depot = new TrainDepot(new MPL85());
const station = new Station("test");
const rail = new Rails([[20, 20], [40, 40], [50, 50]]);

depot.position = [20, 20];
station.position = [50, 50];
context.stations = [station];
context.railSection = [rail];
context.depots = [depot];

app.get("/get/network", require("./api/get/network").default);
app.listen(2072, () => {
    console.log("[NetworkSimulator] Running on port 2072");
});
