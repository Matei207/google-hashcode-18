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

let filepath = "./datasets/a_example.in";
let filepathOut = "./output.txt";

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
		jobs: []
	});
}

for (var i = 1; i <= input.rides; i++) {
	let line = lines[i].split(" ");
	let ride = {
		n: i - 1,

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
input.ridesData.sort((a,b) => a.timeStart - b.timeStart).sort((a,b) => a.timeFinish - b.timeFinish);

/* START ACTUAL CALCULATIONS */

//

/* END ACTUAL CALCULATIONS */

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
