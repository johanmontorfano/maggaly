import { OptionPopup } from "console-gui-tools";
import { context } from "../../router";
import { InfoPopup } from "../components";
import { Switches } from "../../network/components/switches";

export async function switchSelector(): Promise<Switches | null> {
    const options = context.switches.map(t => `${t.id} ${t.type}`);

    return new Promise(resolve => new OptionPopup({
        id: "train_selector",
        title: "Train Selector",
        options: [
            ...options,
            "Exit"
        ],
        selected: options[0]
    }).show().on("confirm", (choice: string) => {
        if (choice !== "Exit") {
            const id = choice.split(" ")[0];

            console.log(`[SwitchSelector] Selected '${choice}'`);
            resolve(context.switches.filter(t => t.id === id)[0]);
        } else {
            InfoPopup("No Train Selected");
            resolve(null);
        }
    }));
}
