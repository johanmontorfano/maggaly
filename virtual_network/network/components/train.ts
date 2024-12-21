import { NetworkContext, Vec2 } from "../context";
import { GenericVehicle } from "./generic";

export class MPL85 extends GenericVehicle<any> {
    private prevElectricState: boolean;
    private prevAccelerationPower: number;

    constructor(initialPosition: Vec2 = [0, 0]) {
        super(null, true);

        this.maxAccelerationPower = 512000;
        this.maxBrakesPower = 12800;
        this.weight = 69100;
        this.maxSpeed = 20.8;
        this.position = initialPosition;

        this.prevElectricState = true;
        this.prevAccelerationPower = 0;
    }

    /** Since the MPL85 is an electric vehicle, we check if it's on an 
    * electricly fed track. If it's not the case there's no acceleration. */
    updateCurrentSpeed(context: NetworkContext): void {
        const currentTrack = super.getCurrentTrack(context);

        if (currentTrack === null)
            super.hasCrashed();
        if (!currentTrack[0].state.electriclyFed && this.prevElectricState) {
            this.prevAccelerationPower = this.currentAccelerationPower;
            this.prevElectricState = false;
            super.updateAccelerationData(0, 0);
        }
        if (currentTrack[0].state.electriclyFed && !this.prevElectricState) {
            this.prevElectricState = true;
            super.updateAccelerationData(
                this.prevAccelerationPower / this.maxAccelerationPower, 0
            );
        }
        super.updateCurrentSpeed(context);
    }
}
