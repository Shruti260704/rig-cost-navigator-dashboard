
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const NptCalculator = () => {
  const [nptHours, setNptHours] = useState(0);
  const [rigHourlyRate, setRigHourlyRate] = useState(0);

  const calculateNptCost = () => {
    return nptHours * rigHourlyRate;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>NPT Calculator</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="npt-hours">Non-Productive Time (hours)</Label>
              <Input
                id="npt-hours"
                type="number"
                value={nptHours}
                onChange={(e) => setNptHours(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="rig-rate">Rig Hourly Rate ($)</Label>
              <Input
                id="rig-rate"
                type="number"
                value={rigHourlyRate}
                onChange={(e) => setRigHourlyRate(parseFloat(e.target.value) || 0)}
                className="mt-1"
              />
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-red-50 rounded-md">
            <h3 className="font-medium text-red-800">
              Total NPT Cost: <span className="text-2xl font-bold">${calculateNptCost().toLocaleString()}</span>
            </h3>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NptCalculator;
