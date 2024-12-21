import { OptionPopup } from "console-gui-tools";
import { GenericVehicle } from "../../network/components/generic";
import { context } from "../../router";
import { InfoPopup } from "../components";

export async function trainSelector(): Promise<GenericVehicle<any> | null> {
    const trainsOptions = context.trains.map(t => `${t.id} ${t.type}`);

    return new Promise(resolve => new OptionPopup({
        id: "train_selector",
        title: "Train Selector",
        options: [
            ...trainsOptions,
            "Exit"
        ],
        selected: trainsOptions[0]
    }).show().on("confirm", (choice: string) => {
        if (choice !== "Exit") {
            const trainID = choice.split(" ")[0];

            console.log(`[TrainSelector] Selected '${choice}'`);
            resolve(context.trains.filter(t => t.id === trainID)[0]);
        } else {
            InfoPopup("No Train Selected");
            resolve(null);
        }
    }));
}
