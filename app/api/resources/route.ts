// app/api/players/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { promisify } from "util";
import os from "os";

const readFile = promisify(fs.readFile);

// Helper to calculate CPU usage in %
function getCPUUsage() {
	const cpus = os.cpus();

	let user = 0;
	let nice = 0;
	let sys = 0;
	let idle = 0;
	let irq = 0;

	cpus.forEach((cpu) => {
		user += cpu.times.user;
		nice += cpu.times.nice;
		sys += cpu.times.sys;
		idle += cpu.times.idle;
		irq += cpu.times.irq;
	});

	const total = user + nice + sys + idle + irq;
	const usage = ((total - idle) / total) * 100;

	return Number(usage.toFixed(2));
}

export async function POST(req: Request) {
	try {
		const { slug } = await req.json();

		if (!slug) {
			return NextResponse.json({ error: "Slug is required" }, { status: 400 });
		}

		const rootDir = process.cwd();
		const worldPath = path.join(rootDir, "mc-worlds", slug);

		// Check if worldPath exists
		if (!fs.existsSync(worldPath)) {
			return NextResponse.json({ error: "World not found" }, { status: 404 });
		}

		// Read server.properties to get max-players
		const propertiesPath = path.join(worldPath, "server.properties");
		let maxPlayers = 20; // default

		if (fs.existsSync(propertiesPath)) {
			const props = await readFile(propertiesPath, "utf-8");
			const match = props.match(/^max-players=(\d+)/m);
			if (match) {
				maxPlayers = parseInt(match[1], 10);
			}
		}

		// Get RAM usage
		const totalMem = os.totalmem();
		const freeMem = os.freemem();
		const usedMemPercent = Number(
			(((totalMem - freeMem) / totalMem) * 100).toFixed(2),
		);

		// Get CPU usage
		const cpuPercent = getCPUUsage();

		return NextResponse.json({
			maxPlayers: maxPlayers,
			cpu: cpuPercent,
			memory: usedMemPercent,
		});
	} catch (err) {
		console.error(err);
		return NextResponse.json(
			{ error: "Something went wrong" },
			{ status: 500 },
		);
	}
}
