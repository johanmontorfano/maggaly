import { InputPopup, PageBuilder } from "console-gui-tools";
import { Page } from "../builder";
import { switchSelector } from "./selector";
import { eventsRegistry } from "../event_list";
import { Shortcut, TAB } from "../components";
import { Switches } from "../../network/components/switches";

export class SwitchPage extends Page<{switch: Switches | null}> {
    constructor() {
        super({ switch: null as any });
    }

    async onPageMount() {
        const switches = await switchSelector();

        if (switches !== null) this.state.switch = switches;
        else return false;
        return await super.onPageMount();
    }

    registerEvents(): typeof eventsRegistry {
        return {
            ...super.registerEvents(),
            t: () => {
                this.state.switch?.toggleState();
            }
        }
    }

    render() {
        const page = new PageBuilder();

        page.addRow({ text: "Selected switch:" });
        page.addRow({ text: `${TAB} ID: ${this.state.switch?.id}` });
        page.addRow({ 
            text: `${TAB} Opened: ${this.state.switch?.state.opened}` 
        });
        page.addSpacer(1);
        page.addRow(Shortcut("Toggle        (t)"));
        page.addRow(Shortcut("Exit          (esc)"));
        return page;
    }
}
