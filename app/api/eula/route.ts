import fs from "fs";
import path from "path";

export const runtime = "nodejs";

export async function POST(req: Request) {
	try {
		const { slug } = await req.json();

		if (!slug) {
			return Response.json(
				{ status: "error", message: "slug is required" },
				{ status: 400 },
			);
		}

		const rootDir = process.cwd();
		const worldPath = path.join(rootDir, "mc-worlds", slug);
		const eulaPath = path.join(worldPath, "eula.txt");

		if (!fs.existsSync(worldPath)) {
			return Response.json(
				{ status: "error", message: "Server world not found" },
				{ status: 404 },
			);
		}

		const now = new Date().toLocaleString("en-IN", {
			day: "2-digit",
			month: "short",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
			hour12: false,
			timeZoneName: "short",
		});

		const eulaContent = `#By changing the setting below to TRUE you are indicating your agreement to our EULA (https://aka.ms/MinecraftEULA).
#${now}
eula=true
`;

		fs.writeFileSync(eulaPath, eulaContent, "utf-8");

		return Response.json({
			status: "success",
			message: "EULA accepted successfully",
		});
	} catch (error) {
		console.error("EULA API error:", error);

		return Response.json(
			{ status: "error", message: "Failed to create eula.txt" },
			{ status: 500 },
		);
	}
}
