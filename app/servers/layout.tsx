"use client";

import { useParams, useRouter } from "next/navigation";
import { slugify } from "@/utils/helper";
import servers from "@/servers.json";
import { Server } from "@/utils/types";
import { useEffect } from "react";

export default function WorldLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const router = useRouter();
  const worldName = params?.name as string || "";
  const slug = slugify(worldName);

  const serversList = servers as Server[];

  useEffect(() => {
    if (!slug) return;

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
  }, [slug, router, serversList]);

  return <div>{children}</div>;
}
