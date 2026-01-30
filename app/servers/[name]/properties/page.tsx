"use client"
import { slugify } from "@/utils/helper";
import { Difficulty, GameMode } from "@/utils/types";
import { useParams } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function Properties() {
  const params = useParams();
  const worldName = params?.name as string;
  const slug = slugify(worldName);

  const [motd, setMotd] = useState("");
  const [mode, setMode] = useState<GameMode>("survival");
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");

  const [maxPlayers, setMaxPlayers] = useState(0);
  const [pvp, setPvp] = useState(false);
  const [cracked, setCracked] = useState(false);

  const [view, setView] = useState(0);
  const [simulation, setSimulation] = useState(0);

  const [serverStatus, setServerStatus] = useState<"running" | "stopped">("stopped");

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async () => {
    try {
      const body = {
        gamemode: mode,
        difficulty,
        motd,
        maxPlayers,
        pvp,
        onlineMode: !cracked,
        viewDistance: view,
        simulationDistance: simulation,
      };

      const res = await fetch(`/api/properties?slug=${slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to save");

      setFeedback({ type: "success", message: "Server properties saved successfully!" });
    } catch (err) {
      setFeedback({ type: "error", message: "Failed to save server properties." });
    }

    // Hide feedback after 3 seconds
    setTimeout(() => setFeedback(null), 3000);
  };

  useEffect(() => {
    const fetchProperties = async () => {
      const res = await fetch(`/api/properties?slug=${slug}`);
      if (!res.ok) return;

      const data = await res.json();

      setMode(data.gamemode);
      setDifficulty(data.difficulty);
      setMotd(data.motd);

      setMaxPlayers(data.maxPlayers);
      setPvp(data.pvp);
      setCracked(!data.onlineMode); // if cracked = !onlineMode

      setView(data.viewDistance);
      setSimulation(data.simulationDistance);
    };

    fetchProperties();
  }, []);

  useEffect(() => {
    const checkStatus = async () => {
      const res = await fetch("/api/status", {
        method: "POST",
        body: JSON.stringify({ slug }),
      });
      const data = await res.json();
      if (data.running) {
        setServerStatus("running");
      } else {
        setServerStatus("stopped");
      }
    };

    checkStatus();
  }, [slug]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold">Server Properties</h1>
            {serverStatus === "running" ?
              <p className="text-red-600 font-medium">
                Cannot edit server properties while the server is online
              </p>
              :
              <p className="text-slate-400">Configure your Minecraft server settings</p>
            }
          </div>
        </div>
        <div>
          {feedback && (
            <p className={`font-medium ${feedback.type === "success" ? "text-green-600" : "text-red-600"}`}>
              {feedback.message}
            </p>
          )}
        </div>
        <button
          onClick={handleSave}
          disabled={serverStatus === "running"}
          className={`py-1 px-2 rounded-md font-medium text-md transition
          ${serverStatus === "running"
              ? "bg-gray-400 text-gray-200 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
            }`}
        >
          Save Changes
        </button>
      </div>

      <div className="space-y-6 mt-4">
        <div className="grid md:grid-cols-2 gap-4">
          <CardWithTitleAndDesc title="Game Settings" desc="Core gameplay configuration">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Game Mode
                </label>
                <select
                  value={mode}
                  onChange={(e) => {
                    e.stopPropagation();
                    setMode(e.target.value as GameMode)
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                >
                  <option value="survival">Survival</option>
                  <option value="creative">Creative</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Difficulty
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => {
                    e.stopPropagation();
                    setDifficulty(e.target.value as Difficulty)
                  }}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white"
                >
                  <option value="peaceful">Peaceful</option>
                  <option value="easy">Easy</option>
                  <option value="normal">Normal</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Server MOTD
              </label>
              <input
                required
                value={motd}
                onChange={(e) => setMotd(e.target.value)}
                placeholder="Daddy Harbhor SMP"
                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </CardWithTitleAndDesc>
          <CardWithTitleAndDesc title="Player Settings" desc="Multiplayer configuration">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Max Players
              </label>
              <input
                required
                value={maxPlayers}
                type="number"
                onChange={(e) => setMaxPlayers(Number(e.target.value))}
                placeholder="Daddy Harbhor SMP"
                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center justify-between border border-gray-300 rounded-md px-2 py-1">
              <label className="block font-medium text-gray-700">
                PvP Enabled
              </label>
              <input
                type="checkbox"
                checked={pvp}
                onChange={(e) => setPvp(e.target.checked)}
              />
            </div>
            <div className="flex items-center justify-between border border-gray-300 rounded-md px-2 py-1">
              <label className="block font-medium text-gray-700">
                Online Mode (Cracked)
              </label>
              <input
                type="checkbox"
                checked={cracked}
                onChange={(e) => setCracked(e.target.checked)}
              />
            </div>
          </CardWithTitleAndDesc>
        </div>
        <CardWithTitleAndDesc title="Performance Settings" desc="Optimize server performance">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                View Distance (2-32)
              </label>
              <input
                required
                value={view}
                type="number"
                onChange={(e) => setView(Number(e.target.value))}
                placeholder="Daddy Harbhor SMP"
                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block font-medium text-gray-700 mb-1">
                Simulation Distance (3-32)
              </label>
              <input
                required
                value={simulation}
                type="number"
                onChange={(e) => setSimulation(Number(e.target.value))}
                placeholder="Daddy Harbhor SMP"
                className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </CardWithTitleAndDesc>
      </div>
    </div>
  );
}

interface Props {
  title: string;
  desc: string;
  children: ReactNode;
}

function CardWithTitleAndDesc({ title, desc, children }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-xl font-semibold">{title}</p>
      <p className="text-slate-400">{desc}</p>
      <div className="space-y-4 mt-3">
        {children}
      </div>
    </div>
  );
}