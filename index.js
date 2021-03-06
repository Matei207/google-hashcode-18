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
        	col: 0,
        	row: 0,
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

function getBestJobForVehicle(t, vehicle, jobs, rejected) {
	let best = null;
	let bestScore = -1;

	for (var i = 0; i < jobs.length; i++) {
		var job = jobs[i];

		if (rejected.indexOf(job.n) < 0)
			continue;

		var score = getValueOfJob(t, vehicle, job);

		if (score > bestScore)
			best = i;
	}

	if (best == null)
		return null;

        return jobs[best];
}

function getBestVehicleForJob(t, vehicles, job) {
	let best = null;
	let bestScore = -1;

	for (var i = 0; i < vehicles.length; i++) {
		var vehicle = vehicles[i];
		var time = vehicle.free > t ? vehicle.free : t;
		var untilFree = Math.max(vehicle.free - t, 0);
		var score = getValueOfJob(time, vehicle, job);
		score -= untilFree;

		if (score > bestScore)
			best = i;
	}

	return vehicles[best];
}

function bestScore(job, inTime) {
    return job.distance + (inTime ? input.bonus : 0);
}

function getTimeUntilStart(t, distance, job) {
	return distance + Math.max(0, job.timeStart - (t + distance));
}

function getValueOfJob(t, vehicle, job) {
	// Distance of the vehicle to the job start.
	let distance = distTo(vehicle, job.start);
	let timeUntilStart = getTimeUntilStart(t, distance, job);
	let startTime = t + timeUntilStart;
	let willWeMakeItInTime = distance <= (job.timeStart - t);
	let score = bestScore(job, willWeMakeItInTime);

	if ((t + distance) >= input.steps)
		return 0;

	let val = score - timeUntilStart;
	scoreCache[vehicle.n][job.n][t] = val;
	return val;
}

function distTo(x, y) {
	return Math.abs(x.col - y.col) + Math.abs(x.row - y.row);
}

for (var t = 0; t < input.steps; t++) {
	console.log("Step " + t + "/" + input.steps);
	let freeVehicles = output.filter((e) => e.free <= t);
	let jobsThatNeedDoing = input.ridesData.filter((e) => !e.done);

	for (var i = 0; i < freeVehicles.length; i++) {
		var job;
		var done = false;
		var rejected = [];
		do {
			var vehicle = freeVehicles[i];
			job = getBestJobForVehicle(t, vehicle, jobsThatNeedDoing, rejected);
			if (!job) {
				done = true;
				continue;
			}

			var bestVehicle = getBestVehicleForJob(t, output, job);

               		if (vehicle.n != bestVehicle.n) {
				rejected.push(job.n);
                        	continue;
			} else done = true;
		} while (!done);

		if (!job)
			continue;

		vehicle.jobs.push(job.n);
		vehicle.free = t + job.distance + distTo(vehicle, job.start);
		vehicle.col = job.end.col;
		vehicle.row = job.end.row;
		job.done = true;
		jobsThatNeedDoing.splice(jobsThatNeedDoing.indexOf(job), 1);
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
