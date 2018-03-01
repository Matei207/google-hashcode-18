let input = {
    grid: {
        rows: 0,
        cols: 0,
    },
    vehicles:0,
    rides: 0,
    ridesData: [],
    bonus: 0,
    steps: 0
};

let filepath = process.argv[2];
let filepathOut = process.argv[3];

console.log(filepath + " -> " + filepathOut);

const fs = require("fs");

let lines = fs.readFileSync(filepath, {
	encoding: "UTF-8"
});
lines = lines.split("\n");

let header = lines[0].split(" ");
input.grid.rows = parseInt(header[0]);
input.grid.cols = parseInt(header[1]);
input.vehicles = parseInt(header[2]);
input.rides = parseInt(header[3]);
input.bonus = parseInt(header[3]);
input.steps = parseInt(header[4]);

let output = [];
for (var i = 0; i < input.vehicles; i++) {
	output.push({
		n: i,
		free: 0,
        	currentX: 0,
        	currentY: 0,
		jobs: []
	});
}

for (var i = 1; i <= input.rides; i++) {
	let line = lines[i].split(" ");
	let ride = {
		n: i - 1,
		done: false,

		start: {
			row: parseInt(line[0]),
			col: parseInt(line[1])
		},

		end: {
			row: parseInt(line[2]),
			col: parseInt(line[3])
		},

		timeStart: parseInt(line[4]),
		timeFinish: parseInt(line[5])
	};

	ride.distance = Math.abs(ride.start.row - ride.end.row) + Math.abs(ride.start.col - ride.end.col);

	input.ridesData.push(ride);
}

delete lines;

// Sort the rides data.
input.ridesData.sort((a,b) => a.timeStart - b.timeStart).sort((a,b) => a.timeFinish - b.timeFinish).sort((a,b) => a.distance - b.distance);

/* START CALCULATIONS */

function getVehicle(vehicles, x, y) {
    closestVehicle = -1;
    minDistance = 99999999999;
        for(i = 0; i < input.vehicles; i++) {
            distance = Math.abs(vehicles[i].currentX - x) + Math.abs(vehicles[i].currentY - y);
            console.log("DISTANCE FOR STEP", i);
            console.log("DISTANCE IS", distance);
            if (minDistance > distance) {
                minDistance = distance;
                closestVehicle = i;
            }
        }
        console.log("MIN DISTANCE", minDistance);
        console.log("INDEX", closestVehicle);
        console.log("VEHICLES", vehicles);
        vehicle = vehicles[closestVehicle];
        vehicles.splice(closestVehicle, 1)
        console.log("VEHICLE", vehicle);
        return vehicle;
}

for (var t = 0; t < input.steps; t++) {
	console.log("Step " + t + "/" + input.steps);
	let jobsThatNeedDoingNow = input.ridesData.filter((e) => !e.done && e.timeStart <= t);
	let freeVehicles = output.filter((e) => e.free <= t);

	for (var i = 0; i < jobsThatNeedDoingNow.length; i++) {
		let job = jobsThatNeedDoingNow[i];

		// No free vehicles.
		if (freeVehicles.length == 0)
			break;

		// Get the free vehicle and remove it.
		let vehicle = getVehicle(freeVehicles, job.start.row, job.start.col);
<<<<<<< HEAD
		vehicle = freeVehicles;
=======
>>>>>>> 83b3d95c1b4820d03435a5e50a6222ae00f84729

		vehicle.jobs.push(job.n);
		vehicle.free = t + job.distance;
		vehicle.currentX = job.end.row;
		vehicle.currentY = job.end.col;
		job.done = true;
	}
}

let jobsThatStillNeedDoing = input.ridesData.filter((e) => !e.done);
for (var i = 0; i < jobsThatStillNeedDoing.length; i++) {
	let job = jobsThatStillNeedDoing[i];

	let vehicles = output.slice(0);
	vehicles.sort((a, b) => a.free - b.free);

	let vehicle = vehicles[0];
	vehicle.jobs.push(job.n);
	vehicle.free += job.distance;
}

/* END CALCULATIONS */

console.log(input);
console.log(output);

let outputLines = "";
for (var i = 0; i < output.length; i++) {
	let vehicle = output[i];
	outputLines += vehicle.jobs.length.toString();
	for (var j = 0; j < vehicle.jobs.length; j++) {
		outputLines += " ";
		outputLines += vehicle.jobs[j].toString();
	}

	outputLines += "\n";
}

fs.writeFileSync(filepathOut, outputLines);
