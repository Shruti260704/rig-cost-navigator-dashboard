import React, { useState } from "react";
import axios from "axios";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  ScatterChart, Scatter,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";

type ChartConfig = {
  type: "bar" | "line" | "pie" | "scatter";
  title: string;
  xAxis?: { dataKey: string; label?: string };
  yAxis?: { label?: string };
  series: { dataKey: string; name: string; stroke?: string; fill?: string }[];
};

type ChartData = {
  chartConfig: ChartConfig;
  data: any[];
};

const chartColors = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const DynamicCharts: React.FC = () => {
  const [charts, setCharts] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/charts`, formData);
      setCharts(res.data.charts || []);
    } catch (err) {
      setError("Failed to load charts from file");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="mb-4">
        <input type="file" accept=".csv,.xlsx,.xls,.json" onChange={handleFileChange} />
      </div>
      {loading && <div>Loading charts...</div>}
      {error && <div>{error}</div>}
      {!loading && !error && charts.map((chart, idx) => {
        const { chartConfig, data } = chart;
        const { type, title, xAxis, yAxis, series } = chartConfig;

        return (
          <Card key={idx}>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  {type === "bar" && (
                    <BarChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      {xAxis && <XAxis dataKey={xAxis.dataKey} label={xAxis.label} />}
                      <YAxis label={yAxis?.label} />
                      <Tooltip />
                      <Legend />
                      {series.map((s, i) => (
                        <Bar
                          key={s.dataKey}
                          dataKey={s.dataKey}
                          name={s.name}
                          fill={s.fill || s.stroke || chartColors[i % chartColors.length]}
                        />
                      ))}
                    </BarChart>
                  )}
                  {type === "line" && (
                    <LineChart data={data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      {xAxis && <XAxis dataKey={xAxis.dataKey} label={xAxis.label} />}
                      <YAxis label={yAxis?.label} />
                      <Tooltip />
                      <Legend />
                      {series.map((s, i) => (
                        <Line
                          key={s.dataKey}
                          type="monotone"
                          dataKey={s.dataKey}
                          name={s.name}
                          stroke={s.stroke || chartColors[i % chartColors.length]}
                        />
                      ))}
                    </LineChart>
                  )}
                  {type === "pie" && (
                    <PieChart>
                      <Tooltip />
                      <Legend />
                      <Pie
                        data={data}
                        dataKey={series[0]?.dataKey}
                        nameKey={xAxis?.dataKey}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        label
                      >
                        {data.map((entry, i) => (
                          <Cell key={i} fill={chartColors[i % chartColors.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  )}
                  {type === "scatter" && (
                    <ScatterChart>
                      <CartesianGrid />
                      {xAxis && <XAxis type="number" dataKey={xAxis.dataKey} name={xAxis.label} label={{ value: xAxis.label, position: "insideBottom", offset: -10 }} />}
                      <YAxis type="number" dataKey={series[0]?.dataKey} name={yAxis?.label} label={{ value: yAxis?.label, angle: -90, position: "insideLeft" }} />
                      <Tooltip />
                      <Legend />
                      <Scatter
                        name={series[0]?.name}
                        data={data}
                        fill={series[0]?.stroke || chartColors[0]}
                      />
                    </ScatterChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default DynamicCharts;
