import express from "express";
import { NetworkContext } from "./network/context";
import { TrainDepot } from "./network/components/train_depot";
import { MPL85 } from "./network/components/train";
import { Rails } from "./network/components/rails";
import { Station } from "./network/components/station";
import { req, reqapi } from "./easy_import";
import { initCli } from "./network/cli";
import { Switches } from "./network/components/switches";

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

app.use(express.static("static"));
app.get("/network/ui", req("./routes/app/viewer"));
app.get("/network/get", reqapi("network/get"));
app.post("/control/train/in", reqapi("control/depot_in"));
app.post("/control/train/out", reqapi("control/depot_out"));
app.post("/control/train/traction", reqapi("control/vehicle_traction"));
app.listen(3000, () => console.log("[VirtualNetwork] Running on port 3000"));

initCli(context);
