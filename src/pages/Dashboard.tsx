
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import WellIdentification from './dashboard/components/WellIdentification';
import CostBreakdown from './dashboard/components/CostBreakdown';
import CostCategories from './dashboard/components/CostCategories';
import NptCalculator from './dashboard/components/NptCalculator';
import ContingencyPlanning from './dashboard/components/ContingencyPlanning';
import DataImport from './dashboard/components/DataImport';
import AIPredictions from './dashboard/components/AIPredictions';
import Cost3DCharts from './dashboard/components/Cost3DCharts';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('cost-breakdown');

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Oil Well Cost Estimation Dashboard</h1>
        
        <WellIdentification />
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="cost-breakdown">Cost Breakdown</TabsTrigger>
            <TabsTrigger value="cost-categories">Cost Categories</TabsTrigger>
            <TabsTrigger value="3d-charts">3D Charts</TabsTrigger>
            <TabsTrigger value="npt-calculator">NPT Calculator</TabsTrigger>
            <TabsTrigger value="contingency">Contingency</TabsTrigger>
            <TabsTrigger value="ai-predictions">AI Predictions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cost-breakdown">
            <CostBreakdown />
          </TabsContent>
          
          <TabsContent value="cost-categories">
            <CostCategories />
          </TabsContent>
          
          <TabsContent value="3d-charts">
            <Cost3DCharts />
          </TabsContent>
          
          <TabsContent value="npt-calculator">
            <NptCalculator />
          </TabsContent>
          
          <TabsContent value="contingency">
            <ContingencyPlanning />
          </TabsContent>
          
          <TabsContent value="ai-predictions">
            <AIPredictions />
          </TabsContent>
        </Tabs>
        
        <div className="mt-6">
          <DataImport />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
