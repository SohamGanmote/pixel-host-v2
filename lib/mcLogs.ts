export const mcLogs = new Map<string, string[]>();

export function pushLog(slug: string, log: string) {
	if (!mcLogs.has(slug)) mcLogs.set(slug, []);
	mcLogs.get(slug)!.push(log);

	// Optional: cap logs
	if (mcLogs.get(slug)!.length > 1000) {
		mcLogs.get(slug)!.shift();
	}
}
