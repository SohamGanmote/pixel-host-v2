"use client";

import { Copy, Play, RefreshCcw, StopCircle } from "lucide-react";
import { FC } from "react";

type ControlsProps = {
  handleStart: () => void;
  serverStatus: "running" | "stopped";
  slug: string;
};

const Controls: FC<ControlsProps> = ({ handleStart, serverStatus, slug }) => {
  const handleStop = async () => {
    try {
      await fetch("/api/stop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });
      // window.location.reload();
    } catch (err) {
      console.error("Failed to stop server", err);
    }
  };

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log("Copied!");
    } catch (e) {
      console.error("Copy failed", e);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-gray-200 p-4 rounded">
        <h2 className="text-gray-900 text-lg font-medium mb-3 flex items-center gap-2">
          Server Controls
        </h2>

        {serverStatus === "stopped" ? (
          <button
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-sm py-2 rounded flex items-center justify-center"
            disabled={serverStatus !== "stopped"}
            onClick={handleStart}
          >
            <Play className="w-4 h-4 mr-2" />
            Start Server
          </button>
        ) : (
          <>
            <button
              className="w-full mt-2 text-white border bg-red-600 hover:bg-red-700 font-medium text-sm py-2 rounded flex items-center justify-center"
              onClick={handleStop}
            >
              <StopCircle className="w-4 h-4 mr-2" />
              Stop Server
            </button>
            <button
              className="w-full mt-2 bg-gray-100 border border-gray-300 text-gray-900 hover:bg-gray-200 font-medium text-sm py-2 rounded flex items-center justify-center"
            >
              <RefreshCcw className="w-4 h-4 mr-2" />
              Restart Server
            </button>
          </>
        )}
      </div>

      <div className="space-y-1 text-sm bg-white border border-gray-200 p-4 rounded">
        <p className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-muted-foreground">Server IP</span>

          <span className="flex items-center gap-2 font-mono text-blue-500">
            {process.env.NEXT_PUBLIC_STATIC_IP}:25575
            <button
              onClick={() => copy(`${process.env.NEXT_PUBLIC_STATIC_IP}:25575`)}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              title="Copy Server IP"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </span>
        </p>

        <p className="flex items-center justify-between gap-2 flex-wrap">
          <span className="text-muted-foreground">Network IP</span>

          <span className="flex items-center gap-2 font-mono text-blue-500">
            {process.env.NEXT_PUBLIC_LOCAL_IP}:25575
            <button
              onClick={() => copy(`${process.env.NEXT_PUBLIC_LOCAL_IP}:25575`)}
              className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              title="Copy Network IP"
            >
              <Copy className="h-3.5 w-3.5" />
            </button>
          </span>
        </p>
      </div>
    </div>
  );
};

export default Controls;
