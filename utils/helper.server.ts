import fs from "fs";
import path from "path";

type Server = {
	name: string;
	version: string;
	isActive: boolean;
	last_played: string;
};

export function updateServerStatus(slug: string, isActive: boolean) {
	const rootDir = process.cwd();
	const serversFile = path.join(rootDir, "servers.json");

	if (!fs.existsSync(serversFile)) {
		throw new Error("servers.json not found");
	}

	const serversData = JSON.parse(
		fs.readFileSync(serversFile, "utf-8"),
	) as Server[];

	const updatedServers = serversData.map((server) =>
		server.name === slug
			? {
					...server,
					isActive,
					last_played: new Date().toISOString(),
				}
			: server,
	);

	fs.writeFileSync(
		serversFile,
		JSON.stringify(updatedServers, null, 2),
		"utf-8",
	);
}