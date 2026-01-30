import { mcServers } from "@/lib/mcProcesses";

export const runtime = "nodejs";

export async function POST(req: Request) {
	const { slug } = await req.json();

	if (!slug) {
		return new Response("slug is required", { status: 400 });
	}

	const mc = mcServers.get(slug);

	return new Response(
		JSON.stringify({
			running: !!mc,
		}),
		{
			headers: { "Content-Type": "application/json" },
		},
	);
}
