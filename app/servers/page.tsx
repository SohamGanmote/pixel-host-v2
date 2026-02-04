"use client";

import { useRouter } from "next/navigation";
import { formatName, relativeTime } from "@/utils/helper";
import { Pickaxe } from "lucide-react";
import { useEffect, useState } from "react";

type Server = {
  name: string;
  version: string;
  isActive: boolean;
  last_played: string;
};

export default function Servers() {
  const router = useRouter();

  const [serversList, setServersList] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

  const anyServerRunning = serversList.some(s => s.isActive);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const res = await fetch("/api/servers", {
          cache: "no-store",
        });
        const data = await res.json();
        setServersList(data);
      } catch (err) {
        console.error("Failed to fetch servers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  if (loading) {
    return <div className="text-sm text-gray-500">Loading servers</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Manage Servers</h1>

        <button
          className={` text-white font-medium py-1 px-2 rounded-md transition text-md cursor-pointer
          ${anyServerRunning ? "bg-gray-400 text-gray-200 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"}`}
          disabled={anyServerRunning}
          onClick={() => !anyServerRunning && router.push("/create-new-server")}
        >
          Create New World
        </button>
      </div>

      {/* Servers Grid */}
      {serversList.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[60vh] text-center px-4">
          <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gray-200 shadow-sm mb-6">
            <span className="text-3xl"><Pickaxe /></span>
          </div>

          <h2 className="text-2xl font-semibold text-gray-900">
            No Servers created yet
          </h2>

          <p className="mt-2 text-gray-500 max-w-md">
            Get started by creating your first world.
            Configure your world name, difficulty, and seed to begin your adventure!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {serversList.map((server) => (
            <div
              key={server.name}
              className="bg-white border border-gray-200 rounded-lg p-4 transition"
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2">
                <div className="text-lg font-semibold text-gray-900">
                  {formatName(server.name)}
                </div>

                <div
                  className={`flex items-center rounded-full font-bold px-3 py-1 text-xs
                    ${server.isActive
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    }`}
                >
                  {server.isActive && (
                    <div className="w-2 h-2 rounded-full bg-green-600 mr-2 animate-pulse" />
                  )}
                  {server.isActive ? "ONLINE" : "OFFLINE"}
                </div>
              </div>

              <div className="grid grid-cols-2">
                {/* Version */}
                <div className="mt-2">
                  <p className="text-gray-500 text-sm">Version</p>
                  <p className="font-semibold text-gray-900">{server.version}</p>
                </div>

                {/* Last Played */}
                <div className="mt-1">
                  <p className="text-gray-500 text-sm">Last Played</p>
                  <p className="font-semibold text-gray-900">
                    {relativeTime(server.last_played)}
                  </p>
                </div>
              </div>

              {/* Manage Button */}
              <button
                className={`mt-4 w-full py-2 px-4 rounded-md text-sm font-medium transition 
                ${server.isActive
                    ? "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                    : serversList.some(s => s.isActive && s.name !== server.name)
                      ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                      : "bg-gray-900 text-white hover:bg-gray-800 cursor-pointer"
                  }`}
                onClick={() => router.push(`/servers/${server.name}/console`)}
                disabled={!server.isActive && serversList.some(s => s.isActive && s.name !== server.name)}
              >
                Manage
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
