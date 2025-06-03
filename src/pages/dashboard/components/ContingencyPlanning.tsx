
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

const ContingencyPlanning = () => {
  const [contingencyPercentage, setContingencyPercentage] = useState([10]);
  const [baseCost, setBaseCost] = useState(1000000); // This would come from the cost breakdown in a real app

  const calculateContingencyCost = () => {
    return (baseCost * contingencyPercentage[0]) / 100;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Contingency Planning</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label htmlFor="base-cost">Base Cost ($)</Label>
            <Input
              id="base-cost"
              type="number"
              value={baseCost}
              onChange={(e) => setBaseCost(parseFloat(e.target.value) || 0)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label>Contingency Percentage: {contingencyPercentage[0]}%</Label>
            <div className="mt-2">
              <Slider
                value={contingencyPercentage}
                onValueChange={setContingencyPercentage}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-orange-50 rounded-md">
            <h3 className="font-medium text-orange-800">
              Total Contingency Cost: <span className="text-2xl font-bold">${calculateContingencyCost().toLocaleString()}</span>
            </h3>
          </div>
          
          <div className="mt-4 p-4 bg-blue-50 rounded-md">
            <h3 className="font-medium text-blue-800">
              Total Project Cost (with Contingency): <span className="text-2xl font-bold">${(baseCost + calculateContingencyCost()).toLocaleString()}</span>
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContingencyPlanning;
