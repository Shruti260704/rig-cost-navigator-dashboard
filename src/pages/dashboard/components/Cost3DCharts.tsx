
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Cost3DCharts = () => {
  const [chartType, setChartType] = useState('scatter');
  
  const data = [
    { x: 100, y: 200, z: 50000, category: 'Pre-Drilling', name: 'Land Acquisition' },
    { x: 120, y: 300, z: 75000, category: 'Pre-Drilling', name: 'Geological Survey' },
    { x: 200, y: 400, z: 25000, category: 'Drilling', name: 'Rig Rental' },
    { x: 180, y: 350, z: 30000, category: 'Drilling', name: 'Drilling Mud' },
    { x: 300, y: 250, z: 80000, category: 'Completion', name: 'Casing' },
    { x: 250, y: 280, z: 45000, category: 'Completion', name: 'Production Tubing' },
    { x: 400, y: 500, z: 120000, category: 'Facilities', name: 'Processing Equipment' },
    { x: 350, y: 450, z: 80000, category: 'Facilities', name: 'Storage Tanks' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-300 rounded shadow">
          <p className="font-semibold">{data.name}</p>
          <p>Category: {data.category}</p>
          <p>Cost: ${data.z.toLocaleString()}</p>
          <p>Risk Factor: {data.x}</p>
          <p>Complexity: {data.y}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>3D Cost Analysis</CardTitle>
          <div className="flex space-x-2">
            <Button 
              variant={chartType === 'scatter' ? 'default' : 'outline'}
              onClick={() => setChartType('scatter')}
            >
              Scatter Plot
            </Button>
            <Button 
              variant={chartType === 'bubble' ? 'default' : 'outline'}
              onClick={() => setChartType('bubble')}
            >
              Bubble Chart
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-96 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid />
              <XAxis 
                type="number" 
                dataKey="x" 
                name="Risk Factor"
                label={{ value: 'Risk Factor', position: 'insideBottom', offset: -10 }}
              />
              <YAxis 
                type="number" 
                dataKey="y" 
                name="Complexity"
                label={{ value: 'Complexity', angle: -90, position: 'insideLeft' }}
              />
              <ZAxis 
                type="number" 
                dataKey="z" 
                range={[50, 1000]} 
                name="Cost"
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Scatter 
                name="Pre-Drilling" 
                data={data.filter(d => d.category === 'Pre-Drilling')} 
                fill="#8884d8" 
              />
              <Scatter 
                name="Drilling" 
                data={data.filter(d => d.category === 'Drilling')} 
                fill="#82ca9d" 
              />
              <Scatter 
                name="Completion" 
                data={data.filter(d => d.category === 'Completion')} 
                fill="#ffc658" 
              />
              <Scatter 
                name="Facilities" 
                data={data.filter(d => d.category === 'Facilities')} 
                fill="#ff7300" 
              />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-md">
          <h3 className="font-semibold mb-2">Chart Controls & Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>X-Axis:</strong> Risk Factor (0-500)</p>
              <p><strong>Y-Axis:</strong> Complexity Score (0-600)</p>
              <p><strong>Bubble Size:</strong> Cost Amount</p>
            </div>
            <div>
              <p><strong>Interaction:</strong> Hover for details</p>
              <p><strong>Legend:</strong> Click to toggle categories</p>
              <p><strong>Colors:</strong> Represent different cost phases</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default Cost3DCharts;
