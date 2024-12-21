import { OptionPopup, PageBuilder } from "console-gui-tools";
import { Page } from "../builder";
import { ErrorPopup, Shortcut } from "../components";
import { context } from "../../router";
import { pageRouter } from "..";
import { railsPopup } from "../rails/popup";

let quitting = false;

export class Main extends Page<{}> {
    constructor() {
        super({});
    }

    async onPageMount() {
        return super.onPageMount();
    }

    registerEvents() {
        return {
            n: () => new OptionPopup({
                id: "netctx_ctrl",
                title: "Network Context Options",
                options: [
                    "Reset To Default",
                    "Reset To Empty",
                    "Exit"
                ],
                selected: "Reset To Default"
            }).show().on("confirm", choice => {
                switch (choice) {
                    case "Reset To Default":
                        context.resetNetwork();
                        console.log("[NetworkContext] Context reset");
                        break;
                    case "Reset To Empty":
                        context.resetNetwork(true);
                        console.log("[NetworkContext] Context wiped");
                        break;
                }
            }),
            t: () => new OptionPopup({
                id: "train_ctrl",
                title: "Train Options",
                options: [
                    "Control Train",
                    "Add Train",
                    "Remove Train",
                    "Exit"
                ],
                selected: "Control Train"
            }).show().on("confirm", choice => {
                switch (choice) {
                    case "Control Train":
                        return pageRouter.mountPageOnRouter(1);
                    case "Exit" :
                        return;
                    default:
                        return ErrorPopup("Not Implemented");
                }
            }),
            s: () => pageRouter.mountPageOnRouter(2),
            r: () => railsPopup(),
            q: () => {
                let x = 10;

                if (quitting) return;
                quitting = true;
                setInterval(() => {
                    if (x > 0) console.warn("Quitting in " + x-- + "...");
                    else process.exit();
                }, 1000);
            }
        }
    }

    render(): PageBuilder {
        const page = new PageBuilder();

        page.addRow({ text: "Network Context Stats", color: "green" });
        page.addRow({ text: `Trains: ${context.trains.length}` });
        page.addRow({ text: `Rails: ${context.sections.length}`});
        page.addSpacer(1);
        page.addRow(Shortcut("Network context   (n)"));
        page.addRow(Shortcut("Trains            (t)"));
        page.addRow(Shortcut("Switches          (s)"));
        page.addRow(Shortcut("Rails             (r)"));
        page.addRow(Shortcut("Quit              (q)"));
        return page;
    }
}
