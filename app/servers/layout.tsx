"use client";

import { useParams, useRouter } from "next/navigation";
import { slugify } from "@/utils/helper";
import { Server } from "@/utils/types";
import { useEffect, useState } from "react";

export default function WorldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const worldName = params?.name as string || "";
  const slug = slugify(worldName);

  const [serversList, setServersList] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (loading || !slug) return;

    const activeServers = serversList.filter((s) => s.isActive);

    if (activeServers.length > 0) {
      if (activeServers[0].name !== slug) {
        router.replace("/servers");
      }
    } else {
      const serverExists = serversList.some((s) => s.name === slug);
      if (!serverExists) {
        router.replace("/servers");
      }
    }
  }, [slug, router, serversList, loading]);

  return <div>{children}</div>;
}
