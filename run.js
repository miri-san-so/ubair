// This will execute all the Services needed for running Ubair
// More Info on README

const exec = require("child_process").exec;

function runService(runthis) {
	const myShellScript = exec(runthis);

	myShellScript.stdout.on("data", (data) => {
		console.log(data);
	});
	myShellScript.stderr.on("data", (data) => {
		console.error(data);
	});
}

// Running Authentication Service
// PORT : 4000
runService("cd auth/ && npm run dev");

// Running Location Service
// PORT : 4001
runService("cd location/ && npm run dev");

// Running Profile Service
// PORT : 4002
runService("cd profile/ && npm run dev");

// Running Dispatcher Service
// PORT : 4003
runService("cd dispatcher/ && npm run dev");

// Running Socket
// PORT : 4005
runService("cd socket/ && npm run dev");
