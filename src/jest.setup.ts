// Create ability to run shell commands asynchronously
import { exec } from "child_process";

// Edit env and setup a fresh DB
process.env.DATABASE = "heimdallts_jest_testing_service_db";
// await execShellCommand("echo cat").then(console.log);
/*
function execShellCommand(cmd: string): Promise<string> {
  return new Promise(resolve => {
    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.warn(error);
      }
      resolve(stdout ? stdout : stderr);
    });
  });
}
*/

// "wipe_db": "echo \"DROP DATABASE heimdall_postgres_development; CREATE DATABASE heimdall_postgres_development;\" | psql postgres",
