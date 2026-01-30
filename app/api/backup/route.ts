import fs from "fs";
import path from "path";
import archiver from "archiver";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { slug } = await req.json();

		if (!slug) {
			return NextResponse.json(
				{ success: false, message: "Slug is required" },
				{ status: 400 },
			);
		}

		const rootDir = process.cwd();
		const worldPath = path.join(rootDir, "mc-worlds", slug);

		if (!fs.existsSync(worldPath)) {
			return NextResponse.json(
				{ success: false, message: "World folder not found" },
				{ status: 404 },
			);
		}

		const zipPath = path.join(rootDir, `${slug}.zip`);
		const output = fs.createWriteStream(zipPath);
		const archive = archiver("zip", { zlib: { level: 9 } });

		archive.pipe(output);
		archive.directory(worldPath, false);

		// IMPORTANT: wait until stream is fully closed
		await new Promise<void>((resolve, reject) => {
			output.on("close", resolve);
			archive.on("error", reject);
			archive.finalize();
		});

		const zipBuffer = fs.readFileSync(zipPath);
		fs.unlinkSync(zipPath);

		return new NextResponse(zipBuffer, {
			headers: {
				"Content-Type": "application/zip",
				"Content-Disposition": `attachment; filename="${slug}.zip"`,
			},
		});
	} catch (error) {
		console.error("Download world error:", error);
		return NextResponse.json(
			{ success: false, message: "Internal server error" },
			{ status: 500 },
		);
	}
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const slug = searchParams.get("slug");

	if (!slug) {
		return new Response("Slug required", { status: 400 });
	}

	const worldPath = path.join(process.cwd(), "mc-worlds", slug);

	if (!fs.existsSync(worldPath)) {
		return new Response("World not found", { status: 404 });
	}

	const archive = archiver("zip", { zlib: { level: 9 } });

	const stream = new ReadableStream({
		start(controller) {
			archive.on("data", (chunk) => controller.enqueue(chunk));
			archive.on("end", () => controller.close());
			archive.on("error", (err) => controller.error(err));

			archive.directory(worldPath, false);
			archive.finalize();
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "application/zip",
			"Content-Disposition": `attachment; filename="${slug}.zip"`,
		},
	});
}
