import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';

interface ChartDataItem {
  [key: string]: string | number | Date;
  fill?: string; // Optional: for pie chart slice colors
}

interface SpendingAnalysisChartWidgetProps {
  title: string;
  description?: string; // Optional description for the chart
  chartType: 'bar' | 'pie' | 'line';
  data: ChartDataItem[];
  dataKey: string;     // Key for category/name (X-axis for bar/line, name for pie slices)
  valueKey: string;    // Key for numerical value (Y-axis for bar/line, value for pie slices)
  className?: string;
  chartColor?: string; // Base color for bar/line charts (e.g., "hsl(var(--primary))"). For pie charts, use 'fill' in data items or defaults.
  height?: number; // Height of the chart container in pixels
}

const DEFAULT_PIE_COLORS = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))", // Added one more for variety
];

const SpendingAnalysisChartWidget: React.FC<SpendingAnalysisChartWidgetProps> = ({
  title,
  description,
  chartType,
  data,
  dataKey,
  valueKey,
  className,
  chartColor,
  height = 300, // Default chart height
}) => {
  console.log(`SpendingAnalysisChartWidget loaded: ${title}, type: ${chartType}`);

  const chartConfig = {
    [valueKey]: {
      label: valueKey.charAt(0).toUpperCase() + valueKey.slice(1),
      color: chartColor || "hsl(var(--chart-1))",
    },
  } satisfies ChartConfig;
  
  // For Pie charts, we also want to show legend items for each slice's name (dataKey)
  if (chartType === 'pie') {
    data.forEach((item, index) => {
      const name = String(item[dataKey]);
      if (name && !chartConfig[name]) { // Avoid overwriting if name clashes with valueKey
        chartConfig[name] = {
          label: name,
          color: item.fill || DEFAULT_PIE_COLORS[index % DEFAULT_PIE_COLORS.length],
        };
      }
    });
  }


  const renderChart = () => {
    if (!data || data.length === 0) {
      return <div className="flex items-center justify-center h-full text-muted-foreground">No data to display</div>;
    }

    switch (chartType) {
      case 'bar':
        return (
          <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid horizontal={false} strokeDasharray="3 3" />
            <XAxis type="number" hide />
            <YAxis
              dataKey={dataKey}
              type="category"
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => value.length > 15 ? `${value.substring(0, 15)}...` : value}
              width={100}
            />
            <ChartTooltip
              cursor={{ fill: "hsl(var(--background))" }}
              content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey={valueKey} fill={`var(--color-${valueKey})`} radius={4}>
              <LabelList dataKey={valueKey} position="right" offset={8} className="fill-foreground" fontSize={12} />
            </Bar>
          </BarChart>
        );
      case 'pie':
        return (
          <PieChart accessibilityLayer margin={{ top: 20, bottom: 20 }}>
            <ChartTooltip content={<ChartTooltipContent nameKey={dataKey} hideLabel={false} />} />
            <Pie
              data={data}
              dataKey={valueKey}
              nameKey={dataKey}
              cx="50%"
              cy="50%"
              outerRadius={Math.min(height / 2 - 40, 120)} // Adjust radius based on height
              labelLine={false}
              label={({ percent, name }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill as string || DEFAULT_PIE_COLORS[index % DEFAULT_PIE_COLORS.length]} />
              ))}
            </Pie>
            <ChartLegend content={<ChartLegendContent nameKey={dataKey} />} />
          </PieChart>
        );
      case 'line':
        return (
          <LineChart accessibilityLayer data={data} margin={{ left: 10, right: 20, top: 5, bottom: 5 }}>
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey={dataKey}
              tickLine={false}
              axisLine={false}
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(value) => typeof value === 'string' && value.length > 10 ? value.substring(0,10) : value}
            />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  labelFormatter={(label) => typeof label === 'string' && label.length > 10 ? label.substring(0,10) : label}
                />
              }
            />
            <Line
              type="monotone"
              dataKey={valueKey}
              stroke={`var(--color-${valueKey})`}
              strokeWidth={2}
              dot={{ r: 4, fill: `var(--color-${valueKey})`, strokeWidth: 2, stroke: "hsl(var(--background))" }}
              activeDot={{r: 6}}
            />
            {/* <ChartLegend content={<ChartLegendContent />} /> Commented out if only one line series */}
          </LineChart>
        );
      default:
        return <div className="text-red-500">Invalid chart type specified.</div>;
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="pb-4">
        <ChartContainer config={chartConfig} className="aspect-auto" style={{ height: `${height}px` }}>
          <ResponsiveContainer width="100%" height="100%">
            {renderChart()}
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export default SpendingAnalysisChartWidget;