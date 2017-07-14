const csv = require("./index");

if (process.argv[2] === "scores") {
    csv.scores().pipe(process.stdout);
} else {
    csv.topics().pipe(process.stdout);
}
