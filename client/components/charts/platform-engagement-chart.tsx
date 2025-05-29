"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

interface PlatformData {
  name: string
  views: number
  likes: number
  color: string
}

interface PlatformEngagementChartProps {
  data: PlatformData[]
  title?: string
  subtitle?: string
}

export function PlatformEngagementChart({
  data,
  title = "Platform Engagement",
  subtitle,
}: PlatformEngagementChartProps) {
  // Transform the data for the bar chart
  const chartData = data.map((platform) => ({
    platform: platform.name,
    views: platform.views,
    likes: platform.likes,
  }))

  const chartConfig = {
    views: {
      label: "Views",
      color: "hsl(var(--chart-3))",
    },
    likes: {
      label: "Likes",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="platform" tickLine={false} tickMargin={10} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar dataKey="views" stackId="a" fill="var(--color-views)" radius={[0, 0, 4, 4]} />
            <Bar dataKey="likes" stackId="a" fill="var(--color-likes)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          TikTok has the highest engagement rate <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing stacked views and likes across platforms</div>
      </CardFooter>
    </Card>
  )
}
