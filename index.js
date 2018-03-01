let input = {
    grid: {
        rows: 0,
        cols: 0,
    },
    vehicles:0,
    rides: 0,
    bonus: 0,
    steps: 0,
    individualRides:[],
};

let filepath = "./datasets/a_example.in";

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

console.log(input);
