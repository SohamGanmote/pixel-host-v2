"use client"
import { slugify } from "@/utils/helper";
import { Archive, TriangleAlert } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Files() {
  const params = useParams();
  const worldName = params?.name as string;
  const slug = slugify(worldName);

  const [progress, setProgress] = useState(0);
  const [downloading, setDownloading] = useState(false);

  const [serverStatus, setServerStatus] = useState<"running" | "stopped">("stopped");

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

  const downloadWorld = () => {
    setDownloading(true);
    setProgress(0);

    const xhr = new XMLHttpRequest();
    xhr.open("GET", `/api/backup?slug=${slug}`, true);
    xhr.responseType = "blob";

    xhr.onprogress = (event) => {
      if (event.lengthComputable) {
        const percent = Math.round((event.loaded / event.total) * 100);
        setProgress(percent);
      }
    };

    xhr.onload = () => {
      const blob = xhr.response;
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${slug}.zip`;
      a.click();

      window.URL.revokeObjectURL(url);
      setDownloading(false);
    };

    xhr.onerror = () => {
      alert("Download failed");
      setDownloading(false);
    };

    xhr.send();
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-3xl font-bold">World Backup</h1>
            {serverStatus === "running" ?
              <p className="text-red-600 font-medium">
                Cannot Download world as a ZIP file while the server is online
              </p>
              :
              <p className="text-slate-400">Download your Minecraft world as a ZIP file</p>
            }
          </div>
        </div>
      </div>

      <div className="space-y-6 mt-4 md:w-1/2">
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="bg-gray-50 border border-gray-100 rounded-lg p-4">
            <div className="space-y-4 flex flex-wrap">
              <Archive className="w-16 h-16 text-gray-600 mr-4" />
              <div>
                <p className="text-xl font-semibold">Create Backup</p>
                <p className="text-slate-400">Download your entire Minecraft world directory as a compressed ZIP file. This includes all worlds, player data, and server configuration.</p>
              </div>
            </div>
          </div>
          {downloading ? (<>
            <div className="flex flex-wrap items-center gap-2 mt-4">
              <p className="text-sm font-bold text-gray-500">
                Creating backup
              </p>
              <p className="text-sm font-semibold text-yellow-600 flex items-center gap-1">
                <TriangleAlert className="h-4 w-4" />
                Don’t close this page or press back. Backup is in progress.
              </p>
            </div>

            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600 mt-1">{progress}%</p>
            </div>
          </>
          ) :
            <button
              disabled={serverStatus === "running"}
              className={`py-1 px-2 rounded-md font-medium text-md transition mt-4
          ${serverStatus === "running"
                  ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                  : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                }`}
              onClick={downloadWorld}
            >
              Download ZIP
            </button>
          }
        </div>
      </div>
    </div>
  );
}
