import { Metadata } from "next";
import { getSingleQuest } from "@/lib/quest";
import { notFound } from "next/navigation";

export async function generateMetadata({ 
  params 
}: { 
  params: { id: string } 
}): Promise<Metadata> {
  const awaitedParams = await params; // Properly await params
  const quest = await getSingleQuest(awaitedParams.id);


  if (!quest) notFound();
  
  // console.log('file:generate metadata the found quest is ', quest)

  return {
    title: `${quest.title} - $${quest.prizePoolUsd} prize`,
    description: quest.description,
    openGraph: {
      title: `${quest.title} - $${quest.prizePoolUsd} prize`,
      description: quest.description,
      images: quest.brandImageUrl ? [quest.brandImageUrl] : [],
    },
    twitter: {
      title: `${quest.title} - $${quest.prizePoolUsd} prize`,
      description: quest.description,
      images: quest.brandImageUrl ? [quest.brandImageUrl] : [],
      card: "summary_large_image",
    },
  };
}
