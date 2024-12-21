import express from "express";
import { NetworkContext } from "./network/context";
import { MPL85 } from "./network/components/train";
import { Rails, RailSegmentType } from "./network/components/rails";
import { Switches } from "./network/components/switches";
import fs from "node:fs";

const app = express();
export const context = new NetworkContext({
    sections: [
        new Rails(RailSegmentType.Depot, [10, 10], [20, 10]),
        new Rails(RailSegmentType.Depot, [10, 15], [20, 15]),
        new Rails(RailSegmentType.None, [30, 20], [30, 30], [35, 35]),
        new Rails(RailSegmentType.Station, [35, 35], [45, 35])
    ],
    switches: [
        new Switches(
            new Rails(RailSegmentType.Switch, [20, 10], [25, 15], [30, 20]),
            new Rails(RailSegmentType.Switch, [20, 15], [25, 15], [30, 20])
        )
    ],
    trains: [
        new MPL85([11, 10]).setID("1"),
        new MPL85([11, 15]).setID("2")
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
    require("./cli/index").cli();
}
