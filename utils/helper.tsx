/* ---------- Helpers ---------- */

// format name converts daddy-smp to Daddy Smp
export function formatName(name: string) {
  return name
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());
}

/**
 * Returns relative time string:
 * "Today", "1 day ago", "2 days ago", "1 month ago", "1 year ago"
 */
export function relativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();

  date.setHours(0, 0, 0, 0);
  now.setHours(0, 0, 0, 0);

  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "1 day ago";
  if (diffDays < 30) return `${diffDays} days ago`;

  const months = Math.floor(diffDays / 30);
  if (months < 12)
    return months === 1 ? "1 month ago" : `${months} months ago`;

  const years = Math.floor(diffDays / 365);
  return years === 1 ? "1 year ago" : `${years} years ago`;
}

// Functions to decide logs colors
export type LogLevel = "ERROR" | "WARN" | "INFO" | "DEBUG";

export const getLogColor = (level: LogLevel) => {
  switch (level) {
    case "ERROR":
      return "text-red-600";
    case "WARN":
      return "text-yellow-600";
    case "INFO":
      return "text-green-600";
    case "DEBUG":
      return "text-blue-600";
    default:
      return "text-gray-600";
  }
};

// Functions to create logs objects
export function createLog(level: string, message: string) {
  const now = new Date();
  const timestamp = now.toLocaleTimeString("en-GB", { hour12: false });

  return JSON.stringify({
    timestamp,
    level,
    message: `[Server thread/${level}]: ${message}`,
  });
}

// convert this to this Daddy SMP to daddy-smp
export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");
}

type BuildServerPropertiesArgs = {
  seed?: string;
  slug: string;
  difficulty: string | undefined;
  hardcore?: boolean;
};

// this function build server.properties
export function buildServerProperties({
  seed,
  slug,
  difficulty,
  hardcore,
}: BuildServerPropertiesArgs) {
  return `
enable-jmx-monitoring=false
rcon.port=25575
level-seed=${seed || ""}
gamemode=survival
enable-command-block=false
enable-query=false
generator-settings={}
level-name=world
motd=${slug}
query.port=25565
pvp=true
difficulty=${difficulty || "normal"}
network-compression-threshold=256
max-tick-time=60000
require-resource-pack=false
use-native-transport=true
max-players=5
online-mode=true
enable-status=true
allow-flight=false
broadcast-rcon-to-ops=true
view-distance=10
server-port=25565
enable-rcon=false
sync-chunk-writes=true
op-permission-level=4
prevent-proxy-connections=false
resource-pack=
entity-broadcast-range-percentage=100
simulation-distance=10
player-idle-timeout=0
force-gamemode=false
rate-limit=0
hardcore=${hardcore ? "true" : "false"}
white-list=false
spawn-protection=16
generate-structures=true
enforce-whitelist=falsecd 
`.trim();
}
