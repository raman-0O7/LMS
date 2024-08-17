"use client";

import { Card } from "@/components/ui/card";
import toast from "react-hot-toast";
import {
  ResponsiveContainer,
  XAxis,
  BarChart,
  YAxis,
  Bar
} from "recharts";

interface ChartProps {
  data: {
    name: string;
    total: number;
  }[];
}
export const Chart = ({data}: ChartProps) => {

  if(!data) {
    toast.error("Something went wrong!");
    return null;
  }
  return (
    <Card>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
          <XAxis 
            dataKey={"name"}
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          /> 
          <YAxis 
            stroke="#888888"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value)=> `$${value}`}
          />
          <Bar 
            dataKey={"total"}
            fill="#0369a1"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  )
}