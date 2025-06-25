"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Quest } from "@/lib/types";
import CurrencyDisplay from "@/components/CurrencyDisplay";
import { Gift, Trophy, Award } from "lucide-react";
import ShareButtons from "@/components/ShareButtons";

interface QuestCardProps {
  quest: Quest;
}

export default function QuestCardV2({ quest }: QuestCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter();

  const daysLeft = Math.ceil(
    (new Date(quest.endsOn).getTime() - new Date().getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      "Create video": "bg-brand-purple text-white hover:text-brand-purple",
      Photo: "bg-brand-pink text-white",
      Review: "bg-brand-teal text-white",
      Unboxing: "bg-brand-blue text-white",
    };
    return (
      colors[category as keyof typeof colors] ||
      "bg-brand-yellow text-brand-dark"
    );
  };

  return (
    <Link href={`/quests/${quest._id}`}>
      {/* Desktop/Large Screen Card */}
      <div className="hidden md:block">
        <Card
          className="overflow-hidden bg-white border-gray-200 hover:border-brand-purple/50 hover:shadow-lg transition-all duration-300"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative h-48 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-in-out"
              style={{
                backgroundImage: `url(${quest.brandImageUrl})`,
                transform: isHovered ? "scale(1.05)" : "scale(1)",
              }}
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-3 left-3 flex gapirla gap-2">
              <Badge className={`${getCategoryColor(quest.category)}`}>
                {quest.category}
              </Badge>
            </div>
            <div className="absolute bottom-3 right-3">
              <Badge
                variant="outline"
                className={`border-white text-white bg-black/30 backdrop-blur-sm ${
                  daysLeft < 0 ? "bg-red-600 text-white" : ""
                }`}
              >
                {daysLeft >= 0 ? `${daysLeft} days left` : "Quest ended"}
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center text-brand-purple font-bold">
                <Gift className="w-4 h-4 mr-2" /> {quest.pricePerVideo}{" "}
                <CurrencyDisplay />
              </div>
            </div>
            <p className="text-sm text-gray-600">by {quest.brandName}</p>
          </CardHeader>
          <CardContent className="pb-3">
            <p className="text-sm text-gray-700 line-clamp-2 mb-4">
              {quest.description}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-brand-purple text-white hover:bg-brand-purple/90"
                disabled={daysLeft < 0}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Share Quest
              </Button>
              <ShareButtons
                questId={quest._id}
                buttonVariant="outline"
                buttonSize="sm"
              />
              {/* <Button
                variant="outline"
                size="sm"
                className="flex-1 border-brand-purple text-brand-purple hover:bg-brand-purple hover:text-white"
              >
                <Award className="w-4 h-4 mr-2" />
                View Details
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Mobile Card */}
      <div className="md:hidden">
        <Card className="overflow-hidden bg-white border-gray-200">
          <div className="relative h-32 overflow-hidden">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${quest.brandImageUrl})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute top-2 left-2 flex gap-1">
              <Badge className={`text-xs ${getCategoryColor(quest.category)}`}>
                {quest.category}
              </Badge>
            </div>
          </div>
          <CardHeader className="p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-sm font-bold text-brand-purple">
                <Gift className="w-4 h-4" />
                <span>
                  {quest.pricePerVideo}
                  <CurrencyDisplay />
                </span>
              </div>
              <Badge
                variant="outline"
                className={`text-xs bg-white/90 ${
                  daysLeft >= 0
                    ? "border-brand-purple/30 text-brand-dark"
                    : "bg-red-100 text-red-800 border-red-300"
                }`}
              >
                {daysLeft >= 0 ? `${daysLeft}d left` : "Quest ended"}
              </Badge>
            </div>
            <p className="text-xs text-gray-600">by {quest.brandName}</p>
          </CardHeader>
          <CardContent className="p-3 pt-0">
            <p className="text-xs text-gray-700 line-clamp-2 mb-3">
              {quest.description}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1 bg-brand-purple text-white hover:bg-brand-purple/90"
                disabled={daysLeft < 0}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Share Quest
              </Button>
              <ShareButtons
                questId={quest._id}
                buttonVariant="outline"
                buttonSize="sm"
              />
              {/* <Button
                variant="outline"
                size="sm"
                className="flex-1 border-brand-pu text-brand-pu hover:bg-brand-pu hover:text-white text-xs"
              >
                <Award className="w-4 h-4 mr-2" />
                Details
              </Button> */}
            </div>
          </CardContent>
        </Card>
      </div>
    </Link>
  );
}
