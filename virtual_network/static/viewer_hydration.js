const canvas = document.createElement("canvas");
const context2d = canvas.getContext("2d");

let scale = 4;  

async function exec(prom) {
    try {
        const response = await prom;
        return {response, error: false};
    } catch {
        return {response: null, error: true};
    }
}

// Automatically determines the color to show depending on the light type
// and it's status.
function getColorFromLightType(light) {
    if (light.type === "SwitchesLight")
        return light.state.on ? "white" : "gray";
    return "black";
}

async function frame() {
    const {response, error} = await exec(fetch("/api/network/get"));
    if (error || !response.ok) {
        console.error("No data received from server, next try in 2.5s");
        return setTimeout(() => frame(), 2500);
    }

    const networkState = await response.json();

    // Resize canvas to the size of the screen.
    canvas.setAttribute("width", `${window.innerWidth}`);
    canvas.setAttribute("height", `${window.innerHeight}`);

    context2d.reset();
    context2d.font = context2d.font.replace(/(?<value>\d+\.?\d*)/, 3 * scale);
    context2d.fillStyle = "black";
    context2d.fillRect(0, 0, window.innerWidth, window.innerHeight);
    networkState.railSection.forEach(rail => {
        const points = rail.state.points;
        const isSwitchSeg = rail.id.startsWith("seg");

        context2d.beginPath();
        context2d.strokeStyle = isSwitchSeg ? " #FF5733" : "white";
        if (!rail.state.electriclyFed)
            context2d.strokeStyle = "red";
        if (!rail.available) 
            context2d.strokeStyle = isSwitchSeg ? "#FF9D88" : "gray";
        context2d.lineWidth = 2 * scale;
        context2d.moveTo(points[0][0] * scale, points[0][1] * scale);
        for (let i = 1; i < points.length; i++)
            context2d.lineTo(points[i][0] * scale, points[i][1] * scale);
        context2d.stroke();
    });
    networkState.lights.forEach(light => {
        let {id, position} = light;
        let [x, y] = position;

        id = id.replace("seg", "");
        x = x * scale;
        y = y * scale;
        context2d.fillStyle = getColorFromLightType(light);
        context2d.fillRect(
            x - 2.5 * scale, 
            y - 2.5 * scale, 
            5 * scale, 
            5 * scale
        );
        context2d.fillText(id, x - 2.5 * scale, y - 3.5 * scale);
    });
    networkState.depots.forEach(depot => {
        const {id, position} = depot;
        let [x, y] = position;

        x = x * scale;
        y = y * scale;
        context2d.fillStyle = "red";
        context2d.fillRect(
            x - 3.75 * scale, 
            y - 3.75 * scale, 
            7.5 * scale, 
            7.5 * scale
        );
        context2d.fillText(id, x - 3.75 * scale, y - 5 * scale);
    });
    networkState.stations.forEach(station => {
        const {name} = station.state;
        let [x, y] = station.position;

        x = x * scale;
        y = y * scale;
        context2d.fillStyle = "green";
        context2d.fillRect(
            x - 3.75 * scale, 
            y - 3.75 * scale, 
            7.5 * scale, 
            7.5 * scale
        );
        context2d.fillText(name, x - 3.75 * scale, y - 5 * scale);
    });
    networkState.trains.forEach(train => {
        let [x, y] = train.position;
        const label = `${train.id} (${train.type})`;

        x = x * scale;
        y = y * scale;
        context2d.fillStyle = "orange";
        context2d.fillRect(
            x - 3.75 * scale, 
            y - 1.875 * scale, 
            7.5 * scale, 
            3.75 * scale
        );
        context2d.fillText(label, x - 3.75 * scale, y - 3 * scale);        
    });
    requestAnimationFrame(frame);
}

window.addEventListener("keydown", ev => {
    if (ev.key === "-")
        scale -= 1;
    if (ev.key === "+")
        scale += 1;
});

document.body.style.setProperty("margin", "0");
document.body.style.setProperty("padding", "0");
document.body.style.setProperty("overflow", "hidden");
document.body.append(canvas);
requestAnimationFrame(frame);
