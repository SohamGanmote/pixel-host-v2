"use client"

import ServersHeader from "@/components/console/header";
import Logs from "@/components/console/logs";
import Resources from "@/components/console/resources";
import Controls from "@/components/console/controls";
import { slugify } from "@/utils/helper";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ServerLog } from "@/utils/types";
import Modal from "@/components/ui/Model";

export default function Console() {
  const params = useParams();
  const worldName = params?.name as string;
  const slug = slugify(worldName);

  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState<ServerLog[]>([
    {
      timestamp: "00:00:00",
      level: "INFO",
      message: "[System]: Server is offline",
    },
    {
      timestamp: "00:00:00",
      level: "INFO",
      message: "[System]: Click start server to begin",
    },
    {
      timestamp: "00:00:00",
      level: "INFO",
      message: "[System]: Logs will appear here once the server starts!",
    },
  ]);

  const [serverStatus, setServerStatus] = useState<"running" | "stopped">("stopped");

  const startServer = async () => {
    setLogs([]);
    setServerStatus("running");

    try {
      const res = await fetch("/api/start", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("Start server failed:", data.message || data);
        if (data.status === "eula-error") {
          setOpen(true);
          setLogs([{
            timestamp: "00:00:00",
            level: "INFO",
            message: "[System]: Please accept the Minecraft EULA to start the server.",
          },
          {
            timestamp: "00:00:00",
            level: "INFO",
            message: "[System]: If already accepted, you can start the server.",
          }]);
        }
        setServerStatus("stopped");
        return;
      }

      console.log("Server started:", data);
    } catch (error) {
      setServerStatus("stopped");
      console.error("Network / fetch error:", error);
    }
  };

  const sendCommand = async (command: string) => {
    await fetch("/api/command", {
      method: "POST",
      body: JSON.stringify({ slug, command }),
    });

    setLogs((prev) => [
      ...prev,
      {
        timestamp: new Date().toLocaleTimeString("en-GB"),
        level: "INFO",
        message: `> ${command}`,
      },
    ]);
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
    let es: EventSource | null = null;

    if (serverStatus === "running") {
      es = new EventSource(`/api/logs?slug=${slug}`);

      es.onmessage = (event) => {
        try {
          const log = JSON.parse(event.data);
          setLogs((prev) => [...prev, log]);
        } catch { }
      };

      es.onerror = () => {
        es?.close();
      };
    }

    return () => {
      es?.close();
    };
  }, [slug, serverStatus]);

  return <>
    <div className="space-y-6">
      <ServersHeader serverStatus={serverStatus} />
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Resources slug={slug} serverStatus={serverStatus} />
          <Logs
            serverStatus={serverStatus}
            logs={logs}
            onCommand={sendCommand}
          />
        </div>
        <Controls
          serverStatus={serverStatus}
          handleStart={startServer}
          slug={slug}
        />
      </div>
    </div>

    <EulaModal open={open} setOpen={setOpen} slug={slug} />
  </>
}

type EulaModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  slug: string;
};

function EulaModal({ open, setOpen, slug }: EulaModalProps) {
  const [loading, setLoading] = useState(false);

  const acceptEula = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/eula", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug }),
      });

      if (!res.ok) {
        const data = await res.json();
        console.error("EULA accept failed:", data.message);
        return;
      }

      setOpen(false);
    } catch (err) {
      console.error("EULA request error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      title="Minecraft EULA Required"
      description="You must accept the Minecraft End User License Agreement before starting the server."
    >
      <div className="space-y-4">
        <div className="rounded-lg bg-gray-100 p-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            By clicking <span className="font-medium text-foreground">Accept</span>,
            you confirm that you have read and agree to the{" "}
            <a
              href="https://www.minecraft.net/eula"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-blue-500 underline underline-offset-4 hover:opacity-80"
            >
              Minecraft End User License Agreement
            </a>
            .
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          <button
            onClick={() => setOpen(false)}
            className="bg-red-200 rounded-md px-2 py-1 text-red-800"
          >
            Cancel
          </button>

          <button
            onClick={acceptEula}
            disabled={loading}
            className="bg-green-200 rounded-md px-2 py-1 text-green-800"
          >
            {loading ? "Accepting…" : "Accept & Continue"}
          </button>
        </div>
      </div>
    </Modal>
  );
}