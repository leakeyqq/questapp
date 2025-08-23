// commit-bot.js
import { execSync } from "child_process";
import fs from "fs";

let count = 1;
const interval = 10000; // every 10 seconds

function makeCommit() {
  try {
    // Optional: change a file to ensure something to commit
    fs.writeFileSync("auto-file.txt", `Commit number: ${count}\n`, { flag: "a" });

    // Stage changes
    execSync("git add .");

    // Commit
    // execSync(`git commit -m "auto commit #${count}"`);
    execSync(`git commit -m "committed"`);

    console.log(`✅ Commit #${count} done`);

    count++;
  } catch (err) {
    console.error("❌ Commit failed:", err.message);
  }
}

// run every X seconds
setInterval(makeCommit, interval);
