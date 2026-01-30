import fs from "fs";
import path from "path";
import { spawn } from "child_process";
import { SERVER_JAR, VERSION } from "../../../config/constants";
import { slugify, createLog, buildServerProperties } from "@/utils/helper";

export const runtime = "nodejs";

type CreateWorldBody = {
	worldName: string;
	seed?: string;
	difficulty?: string;
	hardcore?: boolean;
};

export async function POST(req: Request): Promise<Response> {
	const body = (await req.json()) as CreateWorldBody;
	const { worldName, seed, difficulty, hardcore } = body;

	if (!worldName) {
		return new Response("worldName is required", { status: 400 });
	}

	const slug = slugify(worldName);

	const rootDir = process.cwd();
	const serversDir = path.join(rootDir, "mc-worlds");
	const worldPath = path.join(serversDir, slug);
	const serversJsonPath = path.join(rootDir, "servers.json");
	const jarUrl = SERVER_JAR;

	if (!jarUrl) {
		return new Response("SERVER_JAR not found", { status: 500 });
	}

	fs.mkdirSync(worldPath, { recursive: true });

	const stream = new ReadableStream<string>({
		start(controller) {
			const sendLog = (level: string, message: string) => {
				controller.enqueue(createLog(level, message) + "\n");
			};

			sendLog("INFO", `Creating world: ${slug}`);
			sendLog("INFO", `World path: ${worldPath}`);
			sendLog("INFO", "Downloading server jar...");

			const jarPath = path.join(worldPath, "server.jar");
			const wget = spawn("wget", ["-O", jarPath, jarUrl]);

			let warned = false;

			wget.stdout.on("data", (data: Buffer) => {
				sendLog("INFO", data.toString().trim());
			});

			wget.stderr.on("data", (chunk: Buffer) => {
				if (!warned) {
					sendLog("WARN", "Downloading files…");
					warned = true;
				}
			});

			wget.on("close", (code: number | null) => {
				sendLog(
					code === 0 ? "INFO" : "ERROR",
					`Download finished (exit code ${code})`,
				);

				// ---- Update servers.json ----
				let servers = [];

				if (fs.existsSync(serversJsonPath)) {
					try {
						servers = JSON.parse(fs.readFileSync(serversJsonPath, "utf-8"));
					} catch {
						servers = [];
					}
				}

				servers.push({
					name: slug,
					version: VERSION ?? "unknown",
					isActive: false,
					last_played: new Date().toISOString(),
					ram_limit: 1,
				});

				fs.writeFileSync(serversJsonPath, JSON.stringify(servers, null, 2));

				sendLog("INFO", "servers.json updated");

				// ---- server.properties ----
				const serverProperties = buildServerProperties({
					seed,
					slug,
					difficulty,
					hardcore,
				});

				fs.writeFileSync(
					path.join(worldPath, "server.properties"),
					serverProperties,
				);

				sendLog("INFO", "server.properties generated");
				sendLog("INFO", "World created successfully");
				sendLog("INFO", "Redirecting in 5 seconds…");

				controller.close();
			});

			wget.on("error", (err: Error) => {
				sendLog("ERROR", err.message);
				controller.close();
			});
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-cache",
		},
	});
}
