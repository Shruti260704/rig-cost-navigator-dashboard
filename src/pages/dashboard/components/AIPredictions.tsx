import React, { useState } from 'react';
import axios from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const AIPredictions = () => {
  // Query section (dynamic)
  const [input, setInput] = useState('');
  const [prediction, setPrediction] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Automated Predictions (static)
  const predictions = [
    {
      type: 'Cost Optimization',
      confidence: 87,
      recommendation: 'Bulk purchasing of drilling mud could reduce costs by 12% ($18,000 savings)',
      impact: 'High'
    },
    {
      type: 'Schedule Optimization',
      confidence: 92,
      recommendation: 'Adjusting rig schedule to avoid peak season could save 8 days and $200,000',
      impact: 'High'
    },
    {
      type: 'Risk Mitigation',
      confidence: 78,
      recommendation: 'Weather patterns suggest 15% chance of delays in March - consider schedule buffer',
      impact: 'Medium'
    },
    {
      type: 'Equipment Efficiency',
      confidence: 84,
      recommendation: 'Rig X model shows 23% better performance for similar geology - consider upgrade',
      impact: 'High'
    }
  ];

  // Cost Projection Forecast (static)
  const forecastData = [
    { month: 'Jan', predicted: 50000, actual: 48000 },
    { month: 'Feb', predicted: 120000, actual: 125000 },
    { month: 'Mar', predicted: 200000, actual: 195000 },
    { month: 'Apr', predicted: 280000, actual: null },
    { month: 'May', predicted: 320000, actual: null },
    { month: 'Jun', predicted: 350000, actual: null },
  ];

  // Query section: dynamic (InsightPanel style)
  const handlePredict = async () => {
    if (!input.trim()) {
      toast({
        title: "Input required",
        description: "Please enter a question about cost optimization",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(`/query`, {
        query: input,
        top_k: 100,
        include_images: false,
      });

      let answer = "No answer available.";
      try {
        if (typeof res.data === "string") {
          const parsed = JSON.parse(res.data);
          answer = parsed.answer || answer;
        } else {
          answer = res.data.answer || answer;
        }
      } catch {
        answer = "Sorry, could not parse a valid answer from the backend.";
      }

      setPrediction(answer);
    } catch {
      toast({
        title: "Prediction failed",
        description: "Could not get AI prediction. Please try again.",
        variant: "destructive"
      });
      setPrediction('');
    } finally {
      setIsLoading(false);
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 85) return 'text-green-600 bg-green-100';
    if (confidence >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  return (
    <div className="space-y-6">
      {/* Query Section (Dynamic) */}
      <Card>
        <CardHeader>
          <CardTitle>AI Cost Optimization Assistant</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ask for cost optimization insights:
              </label>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="How can I reduce drilling costs for this well type in this region?"
                className="w-full"
              />
            </div>
            <Button onClick={handlePredict} disabled={isLoading} className="w-full">
              {isLoading ? "Analyzing..." : "Get AI Recommendations"}
            </Button>
            {prediction && (
              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-blue-800 mb-2">AI Analysis & Recommendations:</h3>
                <div className="text-gray-700 whitespace-pre-line text-sm">
                  {prediction}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Automated Predictions (Static) */}
      <Card>
        <CardHeader>
          <CardTitle>Automated Predictions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {predictions.map((pred, index) => (
              <div key={index} className="border border-gray-200 p-4 rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold">{pred.type}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getConfidenceColor(pred.confidence)}`}>
                    {pred.confidence}% confidence
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{pred.recommendation}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Impact: {pred.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cost Projection Forecast (Static) */}
      <Card>
        <CardHeader>
          <CardTitle>Cost Projection Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => value ? `$${value.toLocaleString()}` : 'N/A'} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="predicted" 
                  stroke="#8884d8" 
                  strokeDasharray="5 5"
                  name="AI Predicted Costs"
                />
                <Line 
                  type="monotone" 
                  dataKey="actual" 
                  stroke="#82ca9d" 
                  name="Actual Costs"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>Accuracy Rate:</strong> 94.2% | <strong>Last Updated:</strong> 2 hours ago</p>
            <p>Predictions based on regional data, market trends, and historical performance</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AIPredictions;
