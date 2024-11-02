import { GenericVehicle } from "./generic";

export class MPL85 extends GenericVehicle<any> {
    constructor() {
        super(null, true);

        this.accelerationPower = 512000;
        this.brakesPower = 12800;
        this.weight = 69100
    }
}
