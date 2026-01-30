import { mcServers } from "@/lib/mcProcesses";

export const runtime = "nodejs";

export async function POST(req: Request) {
	const { slug, command } = await req.json();

	if (!slug || !command) {
		return new Response("slug and command are required", { status: 400 });
	}

	const mc = mcServers.get(slug);

	if (!mc) {
		return new Response("Server not running", { status: 404 });
	}

	mc.stdin.write(command + "\n");

	return new Response(JSON.stringify({ success: true }), {
		headers: { "Content-Type": "application/json" },
	});
}
