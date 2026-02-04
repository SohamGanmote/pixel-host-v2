"use client";

import { getLogColor, slugify } from "@/utils/helper";
import { Difficulty, Server, ServerLog } from "@/utils/types";
import servers from "@/servers.json";
import { TriangleAlert } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, FormEvent, useRef, useEffect } from "react";

export default function CreateServer() {
  const router = useRouter();

  const [worldName, setWorldName] = useState("");
  const [seed, setSeed] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [hardcore, setHardcore] = useState(false);

  const [logs, setLogs] = useState<ServerLog[]>([]);
  const [showLogs, setShowLogs] = useState(false);

  const [isNewWorldCreated, setIsNewWorldCreated] = useState(false);

  const [serversList, setServersList] = useState<Server[]>([]);

  const logsEndRef = useRef<HTMLDivElement | null>(null);

  const anyServerRunning = serversList.some(s => s.isActive);

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await fetch("/api/servers", {
          cache: "no-store",
        });
        const data = await res.json();
        setServersList(data);
      } catch (err) {
        console.error("Failed to load servers", err);
      }
    };

    fetchServers();
  }, []);

  useEffect(() => {
    if (!isNewWorldCreated) return;

    const slug = slugify(worldName);

    const timer = setTimeout(() => {
      router.push(`/servers/${slug}/console`);
    }, 5000);

    return () => clearTimeout(timer);
  }, [isNewWorldCreated, router, worldName]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLogs([]);
    setShowLogs(true);

    const payload = {
      worldName,
      seed: seed || undefined,
      difficulty,
      hardcore,
    };

    const res = await fetch("/api/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.body) {
      setLogs([
        {
          timestamp: new Date().toISOString(),
          level: "ERROR",
          message: "No response body",
        },
      ]);
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();

    let buffer = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split("\n");
      buffer = lines.pop() || "";

      for (const line of lines) {
        try {
          const parsed: ServerLog = JSON.parse(line);
          setLogs((prev) => [...prev, parsed]);
        } catch {
          // ignore invalid chunks
        }
      }
    }

    setIsNewWorldCreated(true);
  };

  return <>
    <div className="mb-8">
      <h1 className="text-4xl font-bold mb-2">World Creator</h1>
      <p className="text-muted-foreground">
        Generate and customize your own virtual world with our advanced creation engine
      </p>
    </div>

    {anyServerRunning && (
      <div className="flex flex-col items-center justify-center p-6 border border-red-300 bg-red-50 rounded-lg space-y-2 text-center md:w-1/2">
        <h2 className="text-xl font-bold text-red-600">Minecraft Server Running</h2>
        <p className="text-sm text-red-700">
          A Minecraft server process is currently active.
          Please turn off the online server before creating a new world.
        </p>
        <button
          className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          onClick={() => window.location.href = "/servers"} // optional redirect
        >
          Go to Server Management
        </button>
      </div>
    )}


    <div>
      {!showLogs && !anyServerRunning &&
        <div className="md:w-1/3">
          <div className="border p-4 rounded-2xl border-gray-200">
            <div className="mb-4">
              <p className="text-gray-800 font-bold text-lg">Create New World</p>
              <p className="text-sm font-bold text-gray-500">Configure your world parameters</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* World Name */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  World Name
                </label>
                <input
                  required
                  value={worldName}
                  onChange={(e) => setWorldName(e.target.value)}
                  placeholder="Daddy Harbhor SMP"
                  className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Seed */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Seed <span className="text-gray-400">(optional)</span>
                </label>
                <input
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                  placeholder="5103687417315433447"
                  className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Difficulty */}
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                >
                  <option value="peaceful">Peaceful</option>
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              {/* Hardcore */}
              <div className="flex items-center gap-2">
                <input
                  id="hardcore"
                  type="checkbox"
                  checked={hardcore}
                  onChange={(e) => setHardcore(e.target.checked)}
                  className="h-4 w-4"
                />
                <label htmlFor="hardcore" className="text-sm text-gray-700">
                  Hardcore World (permadeath)
                </label>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!worldName.trim()}
                className="bg-green-700 text-white py-2 px-4 rounded-lg disabled:bg-gray-300 w-full"
              >
                Create Now
              </button>
            </form>
          </div>
        </div>
      }

      {showLogs &&
        <div>
          <div className="border p-4 rounded-2xl border-gray-200">
            <div className="mb-4">
              <p className="text-gray-800 font-bold text-lg">Creation Logs</p>
              <div className="flex">
                <p className="text-sm font-bold text-gray-500">Creating a new world</p>
                <p className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                  <TriangleAlert className="h-4" /> don’t close this page or press back. Setup is in progress.
                </p>
              </div>
            </div>
            <div className="space-y-1 font-mono text-sm h-[400px] overflow-y-auto bg-gray-50 p-2 rounded">
              {logs.map((log, index) => (
                <div
                  key={index}
                  className="flex gap-3 hover:bg-gray-100 px-3 rounded transition-colors"
                >
                  <span className="text-gray-500 shrink-0 font-medium hidden md:block">
                    [{log.timestamp}]
                  </span>
                  <span
                    className={`shrink-0 font-bold ${getLogColor(log.level)} min-w-[50px] hidden md:block`}
                  >
                    {log.level}
                  </span>
                  <span className="text-gray-900 leading-relaxed">
                    {log.message}
                  </span>
                </div>
              ))}
              <div ref={logsEndRef} />
            </div>
          </div>
        </div>
      }
    </div>
  </>
}
