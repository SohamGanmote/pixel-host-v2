import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import { mcServers } from "@/lib/mcProcesses";
import { updateServerStatus } from "@/utils/helper.server";
import { pushLog } from "@/lib/mcLogs";

export const runtime = "nodejs";

export async function POST(req: Request) {
	const { slug } = await req.json();

	if (!slug) {
		return new Response("slug is required", { status: 400 });
	}

	// Already running → OK (idempotent)
	if (mcServers.has(slug)) {
		return Response.json({
			status: "already_running",
		});
	}

	const rootDir = process.cwd();
	const worldPath = path.join(rootDir, "mc-worlds", slug);
	const jarPath = path.join(worldPath, "server.jar");
	const eulaPath = path.join(worldPath, "eula.txt");

	if (!fs.existsSync(jarPath)) {
		return new Response("server.jar not found", { status: 404 });
	}

	if (!fs.existsSync(eulaPath)) {
		return Response.json(
			{
				status: "eula-error",
				message:
					"eula.txt not found. Please accept the Minecraft EULA to start the server.",
			},
			{ status: 400 },
		);
	}

	const eulaContent = fs.readFileSync(eulaPath, "utf-8");

	const match = eulaContent.match(/^eula\s*=\s*(true|false)$/m);

	if (!match) {
		return Response.json(
			{
				status: "eula-error",
				message: "Invalid eula.txt format.",
			},
			{ status: 400 },
		);
	}

	const isEulaAccepted = match[1] === "true";

	if (!isEulaAccepted) {
		return Response.json(
			{
				status: "error",
				message:
					"EULA not accepted. Set eula=true in eula.txt to start the server.",
			},
			{ status: 403 },
		);
	}

	pushLog(slug, "[INFO] Starting server...");

	const serverConfigPath = path.join(rootDir, "servers.json");

	if (!fs.existsSync(serverConfigPath)) {
		return new Response("servers.json not found", { status: 500 });
	}

	const serverConfigs = JSON.parse(
		fs.readFileSync(serverConfigPath, "utf-8"),
	) as {
		name: string;
		version: string;
		isActive: boolean;
		last_played: string;
		ram_limit: number;
	}[];

	const serverConfig = serverConfigs.find((server) => server.name === slug);

	if (!serverConfig) {
		return new Response("servers config not found for slug", {
			status: 404,
		});
	}

	const ramLimit = serverConfig.ram_limit || 1;

	pushLog(slug, `[INFO] Allocating ${ramLimit}GB RAM to Minecraft server`);

	const ram = `${ramLimit}G`;

	const mc = spawn(
		"java",
		[`-Xms${ram}`, `-Xmx${ram}`, "-jar", "server.jar", "nogui"],
		{ cwd: worldPath },
	);

	mcServers.set(slug, mc);
	updateServerStatus(slug, true);

	mc.stdout.on("data", (data) => {
		pushLog(slug, `[INFO] ${data.toString().trim()}`);
	});

	mc.stderr.on("data", (data) => {
		pushLog(slug, `[ERROR] ${data.toString().trim()}`);
	});

	mc.on("close", (code) => {
		pushLog(slug, `[WARN] Server stopped (exit code ${code})`);
		mcServers.delete(slug);
		updateServerStatus(slug, false);
	});

	mc.on("error", (err) => {
		pushLog(slug, `[ERROR] ${err.message}`);
		mcServers.delete(slug);
		updateServerStatus(slug, false);
	});

	return Response.json({
		status: "started",
	});
}
