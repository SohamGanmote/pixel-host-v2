import fs from "fs/promises";
import path from "path";

export async function GET() {
	const rootDir = process.cwd();
	const serversJsonPath = path.join(rootDir, "servers.json");

	const file = await fs.readFile(serversJsonPath, "utf-8");
	const data = JSON.parse(file);

	return Response.json(data);
}
