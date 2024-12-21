import { Vec2 } from "../context";
import { GenericNetworkComponent, GenericVehicle } from "./generic";

/** A static token allows a device that goes past it to read it's content and
* it allows the token to know data about the last device that got past it. */
export class StaticToken extends GenericNetworkComponent<{
    staticContent: string,
    lastDeviceReaderData?: GenericVehicle<any>
}> {
    constructor(position: Vec2, staticContent: string) {
        super({staticContent}, true);
        this.position = position;
    }

    readContent(reader: GenericVehicle<any>) {
        this.state.lastDeviceReaderData = reader;
        return this.state.staticContent;
    }
}
