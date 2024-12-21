import { InputPopup, PageBuilder } from "console-gui-tools";
import { GenericVehicle } from "../../network/components/generic";
import { Page } from "../builder";
import { trainSelector } from "./selector";
import { eventsRegistry } from "../event_list";
import { Shortcut, TAB } from "../components";

export class TrainPage extends Page<{train: GenericVehicle<any>}> {
    constructor() {
        super({ train: null as any });
    }

    async onPageMount() {
        const train = await trainSelector();

        if (train !== null) this.state.train = train;
        else return false;
        return await super.onPageMount();
    }

    registerEvents(): typeof eventsRegistry {
        return {
            ...super.registerEvents(),
            a: () => new InputPopup({
                id: "trainctrl_popup",
                title: "Train Acceleration Power (W)",
                value: this.state.train.currentAccelerationPower,
                numeric: true,
                placeholder: "Enter a value in Watts"
            }).show().on("confirm", value => {
                this.state.train.updateAccelerationData(
                    value / this.state.train.maxAccelerationPower,
                    this.state.train.currentBrakesPower /
                        this.state.train.maxBrakesPower
                );
            }),
            b: () => new InputPopup({
                id: "trainctrl_popup",
                title: "Train Brakes Power (W)",
                value: this.state.train.currentBrakesPower,
                numeric: true,
                placeholder: "Enter a value in Watts"
            }).show().on("confirm", value => {
                this.state.train.updateAccelerationData(
                    this.state.train.currentAccelerationPower
                        / this.state.train.maxAccelerationPower,
                    value / this.state.train.maxBrakesPower
                );
            })
        }
    }

    render() {
        const page = new PageBuilder();
        const { 
            id,
            type,
            currentAccelerationPower: currAccelerationPow, 
            currentBrakesPower, 
            maxAccelerationPower,
            maxBrakesPower
        } = this.state.train;
        const accelerationRate = currAccelerationPow / maxAccelerationPower;
        const brakeRate = currentBrakesPower / maxBrakesPower;

        page.addRow({ text: "Selected train: " });
        page.addRow({ text: `${TAB} ID: ${id}` });
        page.addRow({ text: `${TAB} Model: ${type}` });
        page.addRow({ 
            text: `${TAB} Acceleration Power: ${currAccelerationPow}W ` +
                `(${(accelerationRate * 100).toFixed(2)}%)`
        }); 
        page.addRow({ 
            text: `${TAB} Brakes Power: ${currentBrakesPower}W ` +
                `(${(brakeRate * 100).toFixed(2)}%)`
        });
        page.addRow({ 
            text: `${TAB} Speed: ${this.state.train.getCurrentSpeed()}km/h` 
        });
        page.addSpacer(1);
        page.addRow(Shortcut("Change acceleration power  (a)"));
        page.addRow(Shortcut("Change brakes power        (b)"));
        page.addRow(Shortcut("Exit                       (esc)"));
        return page;
    }
}
