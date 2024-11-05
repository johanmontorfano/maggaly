import { GenericVehicle } from "./generic";

export class MPL85 extends GenericVehicle<any> {
    constructor() {
        super(null, true);

        this.maxAccelerationPower = 512000;
        this.maxBrakesPower = 12800;
        this.weight = 69100;
        this.maxSpeed = 20.8;
    }
}
