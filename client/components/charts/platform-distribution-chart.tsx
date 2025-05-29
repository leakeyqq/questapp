"use client"

import * as React from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PlatformData {
  name: string
  views: number
  submissions: number
  color: string
}

interface PlatformDistributionChartProps {
  data: PlatformData[]
  title?: string
  subtitle?: string
}

// Custom label component for pie chart
const renderCustomizedLabel = (props: any) => {
  const RADIAN = Math.PI / 180
  const { cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, payload } = props

  // Calculate the position for the label
  const radius = outerRadius * 1.4
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  // Calculate the position where arrow touches the outer edge of the pie
  const edgeX = cx + outerRadius * Math.cos(-midAngle * RADIAN)
  const edgeY = cy + outerRadius * Math.sin(-midAngle * RADIAN)

  // Calculate intermediate point for the arrow bend
  const mx = cx + (outerRadius + 20) * Math.cos(-midAngle * RADIAN)
  const my = cy + (outerRadius + 20) * Math.sin(-midAngle * RADIAN)

  // Determine text anchor based on position
  const textAnchor = x > cx ? "start" : "end"

  return (
    <g>
      {/* Arrow line - from edge of pie to label */}
      <path d={`M${edgeX},${edgeY}L${mx},${my}L${x},${y}`} stroke="#666" fill="none" strokeWidth={1} />

      {/* Platform name */}
      <text x={x} y={y} fill="#666" textAnchor={textAnchor} dominantBaseline="middle" className="text-xs font-medium">
        {/*payload.platform} ({(percent * 100).toFixed(0)}%)*/}
        {payload.platform}
      </text>
    </g>
  )
}

export function PlatformDistributionChart({
  data,
  title = "Platform Distribution",
  subtitle,
}: PlatformDistributionChartProps) {
  // Transform the data for the pie chart
  const chartData = data.map((platform) => ({
    platform: platform.name,
    views: platform.views,
    fill: platform.color
      .replace("bg-", "#")
      .replace("brand-purple", "8A4FFF")
      .replace("brand-pink", "FF4F8A")
      .replace("brand-teal", "06D6A0")
      .replace("brand-blue", "118AB2")
      .replace("brand-yellow", "FFD166"),
  }))

  // Create chart config
  const chartConfig: ChartConfig = {
    views: {
      label: "Views",
    },
  }

  // Add each platform to the config
  data.forEach((platform) => {
    const colorKey = platform.name.toLowerCase()
    chartConfig[colorKey] = {
      label: platform.name,
      color:
        platform.name === "TikTok"
          ? "hsl(var(--chart-1))"
          : platform.name === "Instagram"
            ? "hsl(var(--chart-2))"
            : platform.name === "Twitter"
              ? "hsl(var(--chart-3))"
              : platform.name === "YouTube"
                ? "hsl(var(--chart-4))"
                : "hsl(var(--chart-5))",
    }
  })

  const totalViews = React.useMemo(() => {
    return chartData.reduce((acc, curr) => acc + curr.views, 0)
  }, [chartData])

  // Format number function
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M"
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle>{title}</CardTitle>
        {subtitle && <CardDescription>{subtitle}</CardDescription>}
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer config={chartConfig} className="mx-auto aspect-square max-h-[300px]">
          <PieChart>
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Pie
              data={chartData}
              dataKey="views"
              nameKey="platform"
              innerRadius={60}
              outerRadius={80}
              strokeWidth={5}
              label={renderCustomizedLabel}
              labelLine={false}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                        <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                          {formatNumber(totalViews)}
                        </tspan>
                        <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                          Total Views
                        </tspan>
                      </text>
                    )
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          {/* TikTok leads with {Math.round((chartData[0].views / totalViews) * 100)}% of total views{" "} */}
          <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">Showing view distribution across platforms</div>
      </CardFooter>
    </Card>
  )
}
