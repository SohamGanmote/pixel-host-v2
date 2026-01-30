import { mcLogs } from "@/lib/mcLogs";
import { ServerLog } from "@/utils/types";

type RawLog = {
	timestamp: string;
	level: ServerLog["level"];
	message: string;
};

function formatLog(raw: RawLog): ServerLog {
	return {
		timestamp: raw.timestamp,
		level: raw.level,
		message: `[Server thread/${raw.level}]: ${raw.message}`,
	};
}

function parseRawLog(line: string): RawLog {
	const now = new Date();
	const timestamp = now.toLocaleTimeString("en-GB", { hour12: false });

	const match = line.match(/^\[(INFO|WARN|ERROR|DEBUG)\]\s*(.*)$/);

	return {
		timestamp,
		level: (match?.[1] ?? "INFO") as ServerLog["level"],
		message: match?.[2] ?? line,
	};
}

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const slug = searchParams.get("slug");

	if (!slug) {
		return new Response("slug is required", { status: 400 });
	}

	const stream = new ReadableStream({
		start(controller) {
			let closed = false;

			const send = (log: ServerLog) => {
				if (closed) return;
				try {
					controller.enqueue(`data: ${JSON.stringify(log)}\n\n`);
				} catch (err) {
					// Stream is already closed
					closed = true; // mark it to stop future sends
				}
			};

			// Initial logs (string[])
			const rawLines: string[] = mcLogs.get(slug) ?? [];
			let lastIndex = rawLines.length;

			for (const line of rawLines) {
				send(formatLog(parseRawLog(line)));
			}

			// Stream new logs
			const interval = setInterval(() => {
				if (closed) return;

				const currentLines: string[] = mcLogs.get(slug) ?? [];
				while (lastIndex < currentLines.length) {
					send(formatLog(parseRawLog(currentLines[lastIndex])));
					lastIndex++;
				}
			}, 300);

			return () => {
				closed = true;
				clearInterval(interval);
				try {
					controller.close();
				} catch {}
			};
		},

		cancel() {
			// Extra safety: called when client aborts connection
			console.log("SSE connection canceled by client");
		},
	});

	return new Response(stream, {
		headers: {
			"Content-Type": "text/event-stream",
			"Cache-Control": "no-cache",
			Connection: "keep-alive",
		},
	});
}
