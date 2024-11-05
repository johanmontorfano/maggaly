import { v4 } from "uuid";
import { NetworkContext, Vec2 } from "../context";
import { Rails } from "./rails";
import { match } from "node:assert";

/** Generic class a component should always extend. */
export class GenericNetworkComponent<T> {
    state: T;
    position: [number, number];
    available: boolean;
    currentController: "maggaly" | "manual";

    id: string;
    type: string;
    private unavailableFor: number;

    constructor(initialState: T, available: boolean) {
        this.state = initialState;
        this.available = available;

        this.position = [0, 0];
        this.currentController = "manual";
        this.unavailableFor = 0;
        this.id = v4();
        this.type = this.constructor.name;
    }

    /** The controller can either be `maggaly` or the manual mode */
    receiveControllerUpdate() {}
    tick(context: NetworkContext) {}    

    setID(id: string) {
        this.id = id;
        return this;
    }

    serialize(): {[field: string]: any} {
        return {
            id: this.id,
            type: this.type,
            position: this.position,
            state: this.state,
            available: this.available ? 1 : 0,
            controller: this.currentController
        }
    }

    randomUnavailbilityManager() {
        if (this.unavailableFor === 0 && Math.random() > 0.7) {
            this.unavailableFor = Math.floor(Math.random() * 1000);
            this.available = true;
        } else if (this.unavailableFor === 0 && !this.available) {
            this.available = true;
        } else {
            this.unavailableFor -= 1;
        }
    }
}

/** Extend network components identified as vehicles */
export class GenericVehicle<T> extends GenericNetworkComponent<T> {
    maxAccelerationPower: number;               // W
    currentAccelerationPower: number;           // W
    maxBrakesPower: number;                     // W
    currentBrakesPower: number;                 // W
    weight: number;                             // kg
    maxSpeed: number;                           // km/h

    currentTrack: Rails | null;
    private currentSpeed: number;               // m/s
    private lastAccelerationPower: number;      // W
    private lastSpeed: number;                  // m/s
    private accelerationStartedAt: number;      // ms
    private speedBeforeDecelerating: number;    // m/s
    // If the vehicle isn't accelerating it's slowly slowing down or it's being
    // inert.
    isAccelerating: boolean;
    // If this is set to `true`, it means that no braking force has been added
    // but the acceleration rate has been reverse (i.e. 1 to -1). Thus the
    // vehicle will be using the acceleration speed to decelerate first.
    // It's important to note that due to mathematical and mechanical knowledge 
    // limitations, acceleration braking is not available if a braking force is 
    // manually set.
    isAccelerationBraking: boolean;
    // If this is set to `true`, it means that a constant braking force is
    // applied to the vehicle speed, eventually making it go slower if the
    // force is higher than the acceleration power.
    isBraking: boolean;

    constructor(state: T, available: boolean) {
        super(state, available);

        this.maxAccelerationPower = 0;
        this.currentAccelerationPower = 0;
        this.currentBrakesPower = 0;
        this.maxBrakesPower = 0;
        this.maxSpeed = 0;
        this.weight = 0;
        this.currentSpeed = 0;
        this.speedBeforeDecelerating = 0;
        this.lastAccelerationPower = 0;
        this.lastSpeed = 0;
        this.isAccelerating = false;
        this.accelerationStartedAt = 0;
        this.currentTrack = null;
        this.isAccelerationBraking = false;
        this.isBraking = false;
    }

    serialize() {
        return {
            ...super.serialize(),
            maxAccelerationPower: this.maxAccelerationPower,
            currentAccelerationPower: this.currentAccelerationPower,
            weight: this.weight,
            maxSpeed: this.maxSpeed,
            currentSpeed: this.currentSpeed,
            maxBrakesPower: this.maxBrakesPower,
            currentBrakesPower: this.currentBrakesPower
        }
    }

    /** To go backwards, the acceleration rate should be a negative number. */
    updateAccelerationData(accRate: number, brakeRate: number) {
        this.lastSpeed = this.currentSpeed;
        this.lastAccelerationPower = this.currentAccelerationPower;
        this.currentBrakesPower = this.maxBrakesPower * brakeRate;
        this.currentAccelerationPower = this.maxAccelerationPower * accRate;
        this.accelerationStartedAt = Date.now();
        this.isBraking = brakeRate !== 0;
        this.isAccelerating = this.currentAccelerationPower !== 0;
        this.isAccelerationBraking = (this.currentAccelerationPower < 0 && 
                          this.lastAccelerationPower > 0) || 
                         (this.currentAccelerationPower > 0 &&
                          this.lastAccelerationPower < 0) && brakeRate === 0;

        if (!this.isAccelerating || this.isAccelerationBraking)
            this.speedBeforeDecelerating = this.currentSpeed;
    }

    private isGoingBackwards() {
        return (this.currentAccelerationPower !== 0 && 
                this.currentAccelerationPower < 0) || 
               (this.currentAccelerationPower === 0 &&
                this.lastAccelerationPower < 0);
    }

    hasCrashed() {
        this.available = false;
        this.currentAccelerationPower = 0;
        this.currentSpeed = 0;
        console.error(`[${this.type}(${this.id})] Crashed !`);
    }

    private getLineLength(a: Vec2, b: Vec2) {
        const dx = b[0] - a[0];
        const dy = b[1] - a[1];
        return Math.sqrt(dx * dx + dy * dy);
    }

    /** We determine if the train is on any track. To do this, we check first
    * collinearity and then bounds (within line segments) */
    getCurrentTrack(context: NetworkContext): [Rails, Vec2, Vec2] {
        if (this.currentTrack !== null)
            return [
                this.currentTrack, 
                this.currentTrack.state.points[0],
                this.currentTrack.state.points[1]
            ];
        
        const matches = context.railSection.map(rail => {
            const {points} = rail.state;
            const [x, y] = this.position;

            if (!rail.available)
                return [];
            for (let i = 1; i < points.length; i++) {
                const [x1, y1] = points[i - 1];
                const [x2, y2] = points[i];
                const cross = (y - y1) * (x2 - x1) - (x - x1) * (y2 - y1);

                if (Math.abs(cross) === 0 && x >= Math.min(x1, x2) &&
                   x <= Math.max(x1, x2) && y >= Math.min(y1, y2) &&
                   y <= Math.max(y1, y2)) 
                    return [rail, points[i - 1], points[i]];
            }
            return [];
        }).filter(f => f.length === 3);
        
        if (matches.length > 0) return matches[0] as any;
        return null as any;
    }

    /** We update the train current speed here. It uses the deceleration speed
    * if the vehicle isn't applying any acceleration power. */
    updateCurrentSpeed(context: NetworkContext) {
        const t = (Date.now() / 1000) - (this.accelerationStartedAt / 1000);

        if (this.isAccelerating) {
            let accPower = this.currentAccelerationPower -
                this.currentBrakesPower * 0.75;

            if (this.isGoingBackwards())
                accPower *= -1;

            const prev = this.currentSpeed;
            const speed = Math.sqrt((2 * accPower * t) / this.weight);

            if (this.isAccelerationBraking) {
                this.currentSpeed -= speed;
                if ((prev > 0 && speed < 0) || (prev < 0 && speed > 0)) {
                    this.accelerationStartedAt = Date.now();
                    this.currentSpeed = 0;
                    this.isAccelerationBraking = false;
                }
            } else this.currentSpeed = speed;
        } else if (this.currentSpeed > 0) {
            const a = context.railFriction * 9.81;
            this.currentSpeed = this.speedBeforeDecelerating - (a * t);
            if (this.currentSpeed < 0) this.currentSpeed = 0;
        }
    }


    /** We update the train position. */
    private updatePosition(tk: [Rails, Vec2, Vec2], context: NetworkContext) {
        const goingBack = this.isGoingBackwards();
        let pixelProgression = this.currentSpeed * context.meterEquivalentPx;

        if (goingBack)
            pixelProgression *= -1;

        const secProg = [tk[2][0] - tk[1][0], tk[2][1] - tk[1][1]];
        const secLength = this.getLineLength(tk[1], tk[2]);
        const progRate = this.getLineLength(tk[1], this.position) / secLength
            + (pixelProgression / secLength);

        // We got the new progression on the current line here.
        const newPos: Vec2 = [
            tk[1][0] + secProg[0] * progRate,
            tk[1][1] + secProg[1] * progRate
        ];

        // Now we look if it overflows from the address. If it's the case, we
        // go on the next train segment. This segment has to start where the
        // current segment ends.
        // We do the same if it underflows, except we look for the track
        // starting segment.
        if ((newPos[0] >= tk[2][0] && newPos[1] >= tk[2][1] && !goingBack) ||
           (newPos[0] <= tk[1][0] && newPos[1] <= tk[1][1] && goingBack)) {
            const matchPoint = goingBack ? 1 : 0;
            const track = tk[2 - matchPoint] as Vec2;
            const matches = context.railSection.filter(r =>
                r.state.points[matchPoint][0] === track[0] &&
                r.state.points[matchPoint][1] === track[1] &&
                r.available
            );

            // Here we determine how much we overflow/underflow the current
            // track, we set the new position and we apply this value to the
            // position on the new track.

            if (matches.length > 0) {
                const oflow = matches[0].state.points[matchPoint][0] - 
                    newPos[0] +
                    matches[0].state.points[matchPoint][1] - 
                    newPos[1];
                const tempSpeed = this.currentSpeed;

                this.currentTrack = matches[0];
                this.currentSpeed = oflow / context.meterEquivalentPx;
                this.updatePosition(this.getCurrentTrack(context), context);
                this.currentSpeed = tempSpeed;

            }
            else this.hasCrashed();
        }
    
        this.position = newPos;
    }

    /** Returns the current speed in km/h */
    getCurrentSpeed() {
        return parseFloat((this.currentSpeed * 3.6).toFixed(2));
    }

    /** At every tick, a vehicle try to determine which track it's on. If it's
    * off-track it stops moving. When the track is found, it continues ton move
    * along it or go on the next track.
    * TODO: Implement behavior when encountering a junction. */
    tick(context: NetworkContext): void {
        const currentTrack = this.getCurrentTrack(context);
    
        if (currentTrack === null)
            this.hasCrashed();
        this.updateCurrentSpeed(context);
        this.updatePosition(currentTrack, context);
    }
}
