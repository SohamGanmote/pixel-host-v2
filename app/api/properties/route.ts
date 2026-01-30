import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const ALLOWED_KEYS: Record<string, string> = {
  gamemode: "gamemode",
  difficulty: "difficulty",
  motd: "motd",
  maxPlayers: "max-players",
  pvp: "pvp",
  onlineMode: "online-mode",
  viewDistance: "view-distance",
  simulationDistance: "simulation-distance",
};

/* ---------------- GET ---------------- */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response("slug is required", { status: 400 });
  }

  const rootDir = process.cwd();
  const propertiesPath = path.join(rootDir, "mc-worlds", slug, "server.properties");

  if (!fs.existsSync(propertiesPath)) {
    return new Response("server.properties not found", { status: 404 });
  }

  const file = fs.readFileSync(propertiesPath, "utf-8");
  const map: Record<string, string> = {};

  file.split("\n").forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const [key, ...rest] = trimmed.split("=");
    map[key] = rest.join("=");
  });

  return Response.json({
    gamemode: map["gamemode"],
    difficulty: map["difficulty"],
    motd: map["motd"],
    maxPlayers: Number(map["max-players"]),
    pvp: map["pvp"] === "true",
    onlineMode: map["online-mode"] === "true",
    viewDistance: Number(map["view-distance"]),
    simulationDistance: Number(map["simulation-distance"]),
  });
}

/* ---------------- PUT ---------------- */
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return new Response("slug is required", { status: 400 });
  }

  const updates = await req.json();

  const rootDir = process.cwd();
  const propertiesPath = path.join(rootDir, "mc-worlds", slug, "server.properties");

  if (!fs.existsSync(propertiesPath)) {
    return new Response("server.properties not found", { status: 404 });
  }

  const file = fs.readFileSync(propertiesPath, "utf-8");
  const lines = file.split("\n");

  const updatedLines = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return line;

    const [key] = trimmed.split("=");

    for (const [bodyKey, fileKey] of Object.entries(ALLOWED_KEYS)) {
      if (key === fileKey && updates[bodyKey] !== undefined) {
        return `${fileKey}=${String(updates[bodyKey])}`;
      }
    }

    return line;
  });

  fs.writeFileSync(propertiesPath, updatedLines.join("\n"), "utf-8");

  return Response.json({ success: true });
}
