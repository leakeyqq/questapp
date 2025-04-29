// lib/quest.ts
import { cache } from 'react';

export const getSingleQuest = cache(async (id: string) => {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quest/getSingleQuest/${id}`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) throw new Error("Failed to fetch quest");
  const data = await res.json();
  return data.quest; // Assuming your API returns { quest: {...} }
});