import React, { useState } from 'react';
import axios from '@/lib/axios'; // <-- yahi import use karein
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const chartColors = [
  "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#ff0000", "#0088FE", "#00C49F", "#FFBB28", "#FF8042"
];

const CostCategories = () => {
  const [charts, setCharts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
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
      const res = await axios.post(`/cost-categories`, formData);
      setCharts(res.data.charts || []);
    } catch (err) {
      setError("Failed to load charts from file");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get('/cost-categories');
      setCategories(res.data.categories || []);
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

    return null;
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <input type="file" accept=".csv,.xlsx,.xls,.json" onChange={handleFileChange} />
      </div>
      <button onClick={fetchCategories}>Reload Categories</button>
      {loading && <div>Loading...</div>}
      {error && <div>{error}</div>}
      <div>
        {categories.map((cat, idx) => (
          <Card key={idx}>
            <CardContent>
              <div>{cat.name}</div>
              {/* aur bhi fields yahan show kar sakte hain */}
            </CardContent>
          </Card>
        ))}
      </div>
      {!loading && !error && charts.length > 0 ? (
        <div className="space-y-6">
          {charts.map((chart, idx) => renderChart(chart, idx))}
        </div>
      ) : null}
    </div>
  );
};

export default CostCategories;
