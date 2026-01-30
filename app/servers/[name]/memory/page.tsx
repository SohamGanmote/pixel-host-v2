"use client"

import { slugify } from "@/utils/helper";
import { Lightbulb } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import servers from "@/servers.json";

export default function Properties() {
  const params = useParams();
  const worldName = params?.name as string;
  const slug = slugify(worldName);

  const [ram, setRam] = useState(1);
  const [serverStatus, setServerStatus] = useState<"running" | "stopped">("stopped");

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/ram", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, ram_limit: ram }),
      });

      if (!res.ok) throw new Error();

      setFeedback({ type: "success", message: "RAM allocated successfully!" });
    } catch {
      setFeedback({ type: "error", message: "Failed to allocated RAM." });
    }

    setTimeout(() => setFeedback(null), 3000);
  };

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

  useEffect(() => {
    if (!slug) return;

    const server = servers.find((s) => s.name === slug);

    if (server) {
      setRam(server.ram_limit);
    }
  }, [slug]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold">Server Memory</h1>
            {serverStatus === "running" ?
              <p className="text-red-600 font-medium">
                Cannot configure server RAM allocation while the server is online
              </p>
              :
              <p className="text-slate-400">Configure your server RAM allocation</p>
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

      <div className="space-y-6 mt-4 md:w-1/2">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div>
            <label className="block font-medium text-gray-700 mb-1">
              Maximum memory allocation (e.g., 2G, 4G, 8G)
            </label>
            <input
              required
              value={ram}
              type="number"
              onChange={(e) => setRam(Number(e.target.value))}
              placeholder="1024M"
              className="w-full border border-gray-300 rounded-md px-2 py-1 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900 mt-4">
            <div className="mt-0.5 text-blue-600"><Lightbulb /></div>
            <p className="leading-relaxed">
              Tip: Set <strong>Xmx</strong> to <strong>25–50%</strong> of your total RAM.
              <br />
              Example: For a <strong>16 GB</strong> system, use around <strong>8 GB</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
