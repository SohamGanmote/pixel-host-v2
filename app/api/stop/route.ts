import { mcServers } from "@/lib/mcProcesses";
import { updateServerStatus } from "@/utils/helper.server";

export const runtime = "nodejs";

export async function POST(req: Request) {
	const { slug } = await req.json();

	if (!slug) {
		return new Response("slug is required", { status: 400 });
	}

	const mc = mcServers.get(slug);

	if (!mc) {
		return new Response("Server not running", { status: 404 });
	}

	mc.stdin.write("stop\n");
	mcServers.delete(slug);
	updateServerStatus(slug, false);

	return new Response(JSON.stringify({ success: true }), {
		headers: { "Content-Type": "application/json" },
	});
}
