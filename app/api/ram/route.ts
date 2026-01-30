import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { Server } from "@/utils/types";

export async function POST(req: Request) {
	try {
		const { slug, ram_limit } = await req.json();

		if (!slug || typeof ram_limit !== "number") {
			return NextResponse.json(
				{ success: false, message: "Invalid payload" },
				{ status: 400 }
			);
		}

		const rootDir = process.cwd();
		const serversJsonPath = path.join(rootDir, "servers.json");

		if (!fs.existsSync(serversJsonPath)) {
			return NextResponse.json(
				{ success: false, message: "servers.json not found" },
				{ status: 404 }
			);
		}

		const servers: Server[] = JSON.parse(
			fs.readFileSync(serversJsonPath, "utf-8")
		);

		let found = false;

		const updatedServers = servers.map((server) => {
			if (server.name === slug) {
				found = true;
				return {
					...server,
					ram_limit,
				};
			}
			return server;
		});

		if (!found) {
			return NextResponse.json(
				{ success: false, message: "Server not found" },
				{ status: 404 }
			);
		}

		fs.writeFileSync(
			serversJsonPath,
			JSON.stringify(updatedServers, null, 2),
			"utf-8"
		);

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Update server error:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 }
		);
	}
}
