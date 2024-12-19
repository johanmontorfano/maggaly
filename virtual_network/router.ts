import express from "express";
import { NetworkContext } from "./network/context";
import { TrainDepot } from "./network/components/train_depot";
import { MPL85 } from "./network/components/train";
import { Rails } from "./network/components/rails";
import { Station } from "./network/components/station";
import { Switches } from "./network/components/switches";
import fs from "node:fs";

const app = express();
export const context = new NetworkContext({
    depots: [
        new TrainDepot(
            [20, 20], 
            new MPL85().setID("301-302"), 
            new MPL85().setID("303-304")
        ).setID("UTMD")
    ],
    stations: [
        new Station("Parilly", [110, 110]),
        new Station("Prout", [180, 20])
    ],
    switches: [
        new Switches(
            new Rails([80, 20], [110, 20]),
            new Rails([80, 20], [110, 30])
        ).setID("UTMD-OUT")
    ],
    railSection: [
        new Rails([20, 20], [80, 20]),
        new Rails([110, 30], [110, 110]),
        new Rails([110, 20], [180, 20])
    ]
});

// The network will update 1 time per second. Nothing is made to support sub-sec
// updates.
setInterval(() => context.tick(), 1000);
// Every route in `routes/api` is imported, the path from `api` is the path
// the route can be accessed from. Hence `routes/api/index.ts` is accessible
// at `/api/`, or `routes/api/network/get.ts` becomes `/api/network/get`.
console.log("[VirtualNetwork] Setting up routes...");
fs.readdirSync("./routes/api", {recursive: true}).forEach((fp: any) => {
    if (!fs.statSync("./routes/api/" + fp).isFile()) return;

    const api_route = "/api/" + fp.replace(".ts", "").replace("index", "");
    const module = require("./routes/api/" + fp);

    if (module.GET !== undefined) app.get(api_route, module.GET);
    if (module.POST !== undefined) app.post(api_route, module.POST);
});
app.use(express.static("static"));
app.get("/network/ui", require("./routes/app/viewer").default);
app.listen(3000);
console.log("[VirtualNetwork] Routes setup !");
if (process.argv[2] === "--cli") {
    console.log("[CLI] CLI requested");
    require("./network/cli").initCli();
}
