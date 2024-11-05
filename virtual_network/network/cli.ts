import { NetworkContext } from "./context";
import readline from "node:readline";
import events from "node:events";

function network(args: string[], context: NetworkContext) {
    if (args[0] === "status")
        console.log(context);
    else if (args[0] === "reset") {
        context.resetNetwork();
        console.info("Network resetted !");
    } else if (args[0] === "depots" && args[1] === "id") {
        context.depots.forEach(d => {
            console.log(`${d.id}: ${JSON.stringify(d.getAvailableTrains())}`);
        });
    } else if (args[0] === "depots" && args[2] === "content") {
        const depots = context.depots.filter(d => d.id === args[1]);
        if (depots.length === 0)
            return console.error("No depot with this ID found.");
        depots[0].state.forEach(train => {
            console.log(`${train.id}: ${train.type}`);
        });
    } else if (args[0] === "depots" && args[2] === "out") {
        const depots = context.depots.filter(d => d.id === args[1]);
        if (depots.length === 0)
            return console.log("No depot with this ID found.");
        console.log("train out:", depots[0].takeTrainOut(args[3], context));
    } else if (args[0] === "depots" && args[2] === "in") {
        const depots = context.depots.filter(d => d.id === args[1]);
        if (depots.length === 0)
            return console.log("No depot with this ID found.");
        depots[0].parkTrain(args[3], context);
    } else if (args[0] === "trains" && args[2] === "traction") {
        const trains = context.trains.filter(t => t.id === args[1]);
        if (trains.length === 0)
            return console.log("No train with this ID found.");

        const accpwr = parseFloat(args[3]);
        const brkpwr = parseFloat(args[4]);
        
        if (accpwr !== 0 && brkpwr !== 0)
            console.warn("Even though it's okay, setting both the acceleration power and the braking power doesn't mimic real life mechanics of vehicles in some situations.");

        trains[0].updateAccelerationData(accpwr, brkpwr);
    } else if (args[0] === "trains" && args[1] === "id") {
        context.trains.forEach(t => {
            console.log(`${t.id}: ${t.getCurrentSpeed()}km/h`);
        });
    } else if (args[0] === "trains" && args[1] === "pos") {
        context.trains.forEach(t => {
            console.log(`${t.id}: (${t.position[0]}, ${t.position[1]})`);
        });
    } else if (args[0] === "switches" && args[1] === "id") {
        context.switches.forEach(s => {
            console.log(`${s.id}: ${s.state.opened} opened`);
        });
    } else if (args[0] === "switches" && args[1] === "toggle") {
        const switches = context.switches.filter(s => s.id === args[2]);
        if (switches.length === 0)
            return console.error("No switches with this ID found.");
        switches[0].toggleState();
    } else console.log("Network command not found");
}

async function prompt(message: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
        prompt: message + " "
    });
    rl.prompt();
    const line = await Promise.race([
        events.once(rl, 'line').then(([line]) => line),
        events.once(rl, 'close').then(() => null)
    ]);
    if (line !== null){
        rl.close();
    }
    return line
}

async function cli(context: NetworkContext) {
    const [tool, ...args] = (await prompt("virtual_network>")).split(" ");

    if (tool === "exit") process.exit();
    else if (tool === "network") network(args, context);
    else if (tool === "help") {
        console.log("network depots id");
        console.log("   Show available depots and their stock");
        console.log("network depots [name] content");
        console.log("   Show named depot and their content");
        console.log("network depots [name] out [model | name]");
        console.log("   Take a train defined by model or name from a depot");
        console.log("network depots [name] in [model]");
        console.log("   Take a train on a named depot inside of it");
        console.log("network trains id");
        console.log("   Show available trains and their speed");
        console.log("network trains pos");
        console.log("   Show available trains and their position");
        console.log("network trains [name] traction [accrate] [brkrate]");
        console.log("   Set acceleration/braking rate of a train");
        console.log("network switches id")
        console.log("   Show available switches and their state");
        console.log("network switches [name] toggle");
        console.log("   Toggle the state of a named switch")
    }
    else console.log("Unknown command");
    cli(context);
}

/** Makes interacting with the network context easy */
export function initCli(context: NetworkContext) {
    console.log("[CLI] CLI interaction enabled, use \"help\" to get started.");
    setTimeout(() => cli(context), 2000);
}
