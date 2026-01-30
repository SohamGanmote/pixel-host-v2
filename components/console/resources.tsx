"use client";

import { Cpu, MemoryStick, Users } from "lucide-react";
import { FC, useEffect, useState } from "react";

type CardProps = {
  title: string;
  value: string;
  icon: FC<React.SVGProps<SVGSVGElement>>;
  color: string;
};

const Card: FC<CardProps> = ({ title, value, icon: Icon, color }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-md">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <Icon className={`w-8 h-8 ${color}`} />
        </div>
      </div>
    </div>
  );
};

type Metrics = {
  memory: { percent: number };
  cpu: { percent: number };
  maxPlayers: number;
};

type ResourcesProps = {
  slug: string
  serverStatus: "running" | "stopped";
};

const Resources: FC<ResourcesProps> = ({ slug, serverStatus }) => {
  const [metrics, setMetrics] = useState<Metrics>({
    memory: { percent: 0 },
    cpu: { percent: 0 },
    maxPlayers: 0,
  });

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        if (serverStatus !== "running") return;

        const res = await fetch("/api/resources", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ slug }),
        });

        const data = await res.json();

        setMetrics((prev) => ({
          ...prev,
          cpu: data.cpu || 0,
          memory: data.memory || 0,
          maxPlayers: data.maxPlayers || 5,
        }));
      } catch (err) {
        console.error("Failed to fetch resources:", err);
      }
    };

    fetchData();

    const interval = window.setInterval(fetchData, 5000);
    return () => window.clearInterval(interval);
  }, [slug, serverStatus]);


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      <Card
        title="CPU Usage"
        value={serverStatus !== "running" ? "0%" : `${metrics.cpu}%`}
        icon={Cpu}
        color="text-purple-500"
      />
      <Card
        title="Memory Usage"
        value={serverStatus !== "running" ? "0%" : `${metrics.memory}%`}
        icon={MemoryStick}
        color="text-blue-500"
      />
      <Card
        title="Player Limit"
        value={`${metrics.maxPlayers}`}
        icon={Users}
        color="text-orange-500"
      />
    </div>
  );
};

export default Resources;
