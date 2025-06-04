import React, { useState } from 'react';
import axios from '@/lib/axios'; // <-- yahi import use karein
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ScatterChart, Scatter } from 'recharts';

const chartColors = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"
];

const CostCategories = () => {
  const [charts, setCharts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post('/query', {
        query: 'Draw as many pie and bar charts from the given files. Do not return any other answer, you need to draw some charts.',
        top_k: 80,
        include_images: false,
      });
      // Update both categories and charts from the response
      setCategories(res.data.categories || []);
      setCharts(res.data.charts || []);
    } catch (err) {
      setError('Failed to load cost categories');
    } finally {
      setLoading(false);
    }
  };

  // Example: Fetch on mount
  React.useEffect(() => {
    fetchCategories();
  }, []);

  // Chart rendering helper
  const renderChart = (chart: any, idx: number) => {
    const { chartConfig, data } = chart;
    if (!chartConfig || !data) return null;
    const { type, title, xAxis, yAxis, series } = chartConfig;

    if (type === "pie") {
      return (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>{title || "Pie Chart"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey={series?.[0]?.dataKey || 'value'}
                    nameKey={xAxis?.dataKey || 'name'}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {data.map((entry: any, i: number) => (
                      <Cell key={i} fill={chartColors[i % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (type === "bar") {
      return (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>{title || "Bar Chart"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {xAxis && <XAxis dataKey={xAxis.dataKey} label={xAxis.label} />}
                  <YAxis label={yAxis?.label} />
                  <Tooltip />
                  <Legend />
                  {series?.map((s: any, i: number) => (
                    <Bar
                      key={s.dataKey}
                      dataKey={s.dataKey}
                      name={s.name}
                      fill={s.fill || s.stroke || chartColors[i % chartColors.length]}
                    />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (type === "line") {
      return (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>{title || "Line Chart"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {xAxis && <XAxis dataKey={xAxis.dataKey} label={xAxis.label} />}
                  <YAxis label={yAxis?.label} />
                  <Tooltip />
                  <Legend />
                  {series?.map((s: any, i: number) => (
                    <Line
                      key={s.dataKey}
                      type="monotone"
                      dataKey={s.dataKey}
                      name={s.name}
                      stroke={s.stroke || chartColors[i % chartColors.length]}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      );
    }

    if (type === "scatter") {
      return (
        <Card key={idx}>
          <CardHeader>
            <CardTitle>{title || "Scatter Chart"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
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
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      <button onClick={fetchCategories} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
        Reload Categories
      </button>
      {loading && <div className="text-center py-4">Loading...</div>}
      {error && <div className="text-red-500 py-2">{error}</div>}

      {categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat, idx) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <div>{cat.name}</div>
                {/* aur bhi fields yahan show kar sakte hain */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && !error && charts.length > 0 && (
        <div className="space-y-6">
          {charts.map((chart, idx) => renderChart(chart, idx))}
        </div>
      )}
    </div>
  );
};

export default CostCategories;
