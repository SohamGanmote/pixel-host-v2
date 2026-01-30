import type { ChildProcessWithoutNullStreams } from "child_process";

declare global {
	// eslint-disable-next-line no-var
	var mcServers: Map<string, ChildProcessWithoutNullStreams> | undefined;
}

export const mcServers = global.mcServers || (global.mcServers = new Map());
