"use client"

import { formatName } from "@/utils/helper";
import { useParams } from "next/navigation";
import { FC } from "react";

type ServerStatus = "running" | "stopped" | "unknown";

const getStatusColor = (status: ServerStatus): string => {
  switch (status) {
    case "running":
      return "bg-green-500";
    case "stopped":
      return "bg-red-500";
    default:
      return "bg-gray-500";
  }
};

type ServersHeaderProps = {
  serverStatus: "running" | "stopped";
};

const ServersHeader: FC<ServersHeaderProps> = ({ serverStatus }) => {
  const params = useParams();
  const worldName = params?.name || "Unknown World";

  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div>
          <h1 className="text-3xl font-bold">{formatName(worldName as string)}</h1>
          <p className="text-slate-400">Server Management Console</p>
        </div>
      </div>
      <div
        className={`flex items-center text-white rounded-full font-bold px-4 py-1 capitalize ${getStatusColor(
          serverStatus
        )}`}
      >
        <div className="w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
        {serverStatus}
      </div>
    </div>
  );
};

export default ServersHeader;
