"use client";

import { useEffect, useState } from "react";
import { FaTwitter, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { getSingleQuest } from "@/lib/quest";

interface ShareButtonsProps {
  questId: string;
  buttonVariant?: "default" | "outline" | "secondary" | "ghost" | "link";
  buttonSize?: "default" | "sm" | "lg" | "icon";
}

const platformConfigs = [
  {
    name: "X",
    icon: <FaTwitter className="w-5 h-5" />,
    getShareUrl: (quest: any) =>
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `Check out this quest: ${quest.title} by ${quest.brandName}! ${quest.shareUrl}`
      )}`,
  },
  {
    name: "Instagram",
    icon: <FaInstagram className="w-5 h-5" />,
    getShareUrl: (quest: any) =>
      `https://www.instagram.com/?url=${encodeURIComponent(quest.shareUrl)}`,
  },
  {
    name: "TikTok",
    icon: <FaTiktok className="w-5 h-5" />,
    getShareUrl: (quest: any) =>
      `https://www.tiktok.com/share?url=${encodeURIComponent(quest.shareUrl)}&text=${encodeURIComponent(
        `Check out this quest: ${quest.title} by ${quest.brandName}!`
      )}`,
  },
  {
    name: "WhatsApp",
    icon: <FaWhatsapp className="w-5 h-5" />,
    getShareUrl: (quest: any) =>
      `https://wa.me/?text=${encodeURIComponent(
        `Check out this quest: ${quest.title} by ${quest.brandName}! ${quest.shareUrl}`
      )}`,
  },
];

export default function ShareButtons({
  questId,
  buttonVariant = "ghost",
  buttonSize = "icon",
}: ShareButtonsProps) {
  const [quest, setQuest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!questId) return;

    const fetchQuest = async () => {
      setLoading(true);
      try {
        const fetchedQuest = await getSingleQuest(questId);
        const baseUrl = process.env.NEXT_PUBLIC_URL || "https://questpanda.xyz";
        setQuest({
          ...fetchedQuest,
          shareUrl: `${baseUrl}/quests/${questId}`,
        });
      } catch (error) {
        console.error("Failed to fetch quest:", error);
        setQuest(null);
      } finally {
        setLoading(false);
      }
    };

    fetchQuest();
  }, [questId]);

  if (loading || !quest) return null;

  return (
    <div className="flex gap-2">
      {platformConfigs.map((platform) => (
        <Button
          key={platform.name}
          variant={buttonVariant}
          size={buttonSize}
          className="hover:scale-105 transition-transform"
          aria-label={`Share on ${platform.name}`}
          onClick={() => {
            window.open(platform.getShareUrl(quest), "_blank", "noopener,noreferrer");
          }}
        >
          {platform.icon}
        </Button>
      ))}
    </div>
  );
}
