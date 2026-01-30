"use client";

import { getLogColor } from "@/utils/helper";
import { ServerLog } from "@/utils/types";
import { Zap } from "lucide-react";
import { FC, useRef, useState, FormEvent, useEffect } from "react";

// const testLogs: LogEntry[] = [
//   { timestamp: "14:23:15", level: "INFO", message: "[Server thread/INFO]: Steve joined the game" },
//   { timestamp: "14:23:32", level: "WARN", message: "[Server thread/WARN]: Can't keep up! Is the server overloaded?" },
//   { timestamp: "14:23:55", level: "ERROR", message: "[Server thread/WARN]: Server crashed!" },
//   { timestamp: "14:23:55", level: "DEBUG", message: "[Server thread/WARN]: Server debug mode!" },
// ];

type LogsProps = {
  serverStatus: "running" | "stopped";
  logs: ServerLog[];
  onCommand: (command: string) => void;
};

const Logs: FC<LogsProps> = ({ serverStatus, logs, onCommand }) => {
  const logsEndRef = useRef<HTMLDivElement | null>(null);
  const [command, setCommand] = useState("");

  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [logs]);

  const handleCommand = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!command.trim()) return;

    onCommand(command);
    setCommand("");
  };

  return (
    <div className="bg-white border border-gray-200 p-4 rounded">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2 text-lg font-medium text-gray-900">
          <Zap className="w-5 h-5 text-yellow-500" />
          Server Logs
        </div>
      </div>

      {/* Logs */}
      <div className="space-y-1 font-mono text-sm h-[400px] overflow-y-auto bg-gray-50 p-2 rounded">
        {logs.map((log, index) => (
          <div
            key={index}
            className="flex gap-3 hover:bg-gray-100 px-3 rounded transition-colors"
          >
            <span className="text-gray-500 shrink-0 font-medium hidden md:block">[{log.timestamp}]</span>
            <span className={`shrink-0 font-bold ${getLogColor(log.level)} min-w-[50px] hidden md:block`}>
              {log.level}
            </span>
            <span className="text-gray-900 leading-relaxed">{log.message}</span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      {/* Command Input */}
      <form onSubmit={handleCommand} className="flex gap-2 border-t border-gray-200 pt-4 mt-4">
        <input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          placeholder="Enter server command..."
          disabled={serverStatus === "stopped"}
          className="bg-gray-100 border border-gray-300 text-gray-900 placeholder:text-gray-400 font-mono flex-1 px-3 py-2 rounded"
        />
        <button
          type="submit"
          disabled={serverStatus === "stopped" || !command.trim()}
          className="bg-gray-200 text-gray-900 hover:bg-gray-300 px-3 py-2 rounded"
        >
          Send
        </button>
      </form>

      <p className="text-xs text-gray-500 mt-1">
        Type commands like: /say Hello, /time set day, /gamemode creative
      </p>
    </div>
  );
};

export default Logs;
