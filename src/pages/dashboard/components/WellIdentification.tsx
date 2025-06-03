
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const WellIdentification = () => {
  const [wellData, setWellData] = useState({
    wellName: 'Well 755',
    wellType: 'Production',
    location: 'Permian Basin, TX',
    depth: '8500',
    operator: 'Energy Corp',
    totalCost: 0
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Well Identification</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="wellName">Well Name</Label>
            <Input 
              id="wellName"
              value={wellData.wellName}
              onChange={(e) => setWellData({...wellData, wellName: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="wellType">Well Type</Label>
            <select 
              id="wellType"
              value={wellData.wellType}
              onChange={(e) => setWellData({...wellData, wellType: e.target.value})}
              className="w-full mt-1 border border-gray-300 rounded-md shadow-sm p-2"
            >
              <option>Production</option>
              <option>Exploration</option>
              <option>Injection</option>
            </select>
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input 
              id="location"
              value={wellData.location}
              onChange={(e) => setWellData({...wellData, location: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="depth">Depth (ft)</Label>
            <Input 
              id="depth"
              type="number"
              value={wellData.depth}
              onChange={(e) => setWellData({...wellData, depth: e.target.value})}
            />
          </div>
          <div>
            <Label htmlFor="operator">Operator</Label>
            <Input 
              id="operator"
              value={wellData.operator}
              onChange={(e) => setWellData({...wellData, operator: e.target.value})}
            />
          </div>
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 rounded-md">
          <h3 className="font-medium text-blue-800">
            Total Estimated Cost: <span className="text-2xl font-bold">${wellData.totalCost.toLocaleString()}</span>
          </h3>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellIdentification;
