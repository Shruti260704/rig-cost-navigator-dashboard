
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const CostBreakdown = () => {
  const [selectedRig, setSelectedRig] = useState('rig-1');
  const [rigs, setRigs] = useState([
    { id: 'rig-1', name: 'Rig 1', costs: getInitialCosts() },
    { id: 'rig-2', name: 'Rig 2', costs: getInitialCosts() }
  ]);

  function getInitialCosts() {
    return [
      {
        id: 'pre-drilling',
        name: '🛠️ Pre-Drilling',
        items: [
          { id: 'land', name: 'Land Acquisition / Site Preparation', cost: 0 },
          { id: 'permits', name: 'Permitting & Regulatory Fees', cost: 0 },
          { id: 'environmental', name: 'Environmental Assessments', cost: 0 },
          { id: 'surveying', name: 'Surveying & Engineering Design', cost: 0 },
          { id: 'mobilization', name: 'Mobilization of Equipment', cost: 0 },
          { id: 'road', name: 'Road & Location Construction', cost: 0 },
        ]
      },
      {
        id: 'drilling',
        name: '🧱 Drilling',
        items: [
          { id: 'rig', name: 'Rig Rental / Rig Rate (Daily)', cost: 0 },
          { id: 'fuel', name: 'Fuel & Power Supply', cost: 0 },
          { id: 'bits', name: 'Drill Bits & Casing', cost: 0 },
          { id: 'mud', name: 'Mud & Chemicals', cost: 0 },
          { id: 'services', name: 'Drilling Services (MWD/LWD)', cost: 0 },
          { id: 'directional', name: 'Directional Drilling / Horizontal Sections', cost: 0 },
          { id: 'cementing', name: 'Cementing', cost: 0 },
        ]
      },
      {
        id: 'completion',
        name: '⚙️ Completion',
        items: [
          { id: 'logging', name: 'Well Logging', cost: 0 },
          { id: 'perforation', name: 'Perforation', cost: 0 },
          { id: 'stimulation', name: 'Stimulation (Fracking/Acidizing)', cost: 0 },
          { id: 'tubing-hanger', name: 'Tubing Hanger', cost: 0 },
          { id: 'prodn-tubing', name: 'Prodn Tubing', cost: 0 },
          { id: 'scsssv', name: 'SCSSSV', cost: 0 },
          { id: 'packer', name: 'Packer', cost: 0 },
          { id: 'ssd', name: 'SSD', cost: 0 },
          { id: 'no-go', name: 'No-Go Locator Seal Assembly', cost: 0 },
          { id: 'millout', name: 'Millout Extension', cost: 0 },
          { id: 'downhole', name: 'Downhole Equipment', cost: 0 },
          { id: 'wellhead', name: 'Wellhead & Christmas Tree Installation', cost: 0 },
        ]
      },
      {
        id: 'post-completion',
        name: '🔧 Post-Completion',
        items: [
          { id: 'surface', name: 'Surface Facilities & Hook-up', cost: 0 },
          { id: 'pipeline', name: 'Pipeline Tie-in', cost: 0 },
          { id: 'testing', name: 'Production Testing', cost: 0 },
          { id: 'cleanup', name: 'Clean-up Operations', cost: 0 },
          { id: 'restoration', name: 'Site Restoration / Waste Handling', cost: 0 },
        ]
      },
      {
        id: 'logistics',
        name: '🚚 Logistics & Other',
        items: [
          { id: 'transport', name: 'Transport (equipment, personnel, materials)', cost: 0 },
          { id: 'camp', name: 'Camp / Accommodation & Catering', cost: 0 },
          { id: 'security', name: 'Security', cost: 0 },
          { id: 'third-party', name: 'Third-party Services', cost: 0 },
          { id: 'insurance', name: 'Insurance & Contingency', cost: 0 },
          { id: 'communication', name: 'Communication & Remote Monitoring', cost: 0 },
        ]
      }
    ];
  }

  const addNewRig = () => {
    const newRigNumber = rigs.length + 1;
    const newRig = {
      id: `rig-${newRigNumber}`,
      name: `Rig ${newRigNumber}`,
      costs: getInitialCosts()
    };
    setRigs([...rigs, newRig]);
    setSelectedRig(newRig.id);
  };

  const removeRig = (rigId: string) => {
    if (rigs.length > 1) {
      const updatedRigs = rigs.filter(rig => rig.id !== rigId);
      setRigs(updatedRigs);
      if (selectedRig === rigId) {
        setSelectedRig(updatedRigs[0].id);
      }
    }
  };

  const handleCostChange = (categoryId: string, itemId: string, value: string) => {
    const updatedRigs = rigs.map(rig => {
      if (rig.id === selectedRig) {
        return {
          ...rig,
          costs: rig.costs.map(category => {
            if (category.id === categoryId) {
              return {
                ...category,
                items: category.items.map(item => 
                  item.id === itemId ? { ...item, cost: parseFloat(value) || 0 } : item
                )
              };
            }
            return category;
          })
        };
      }
      return rig;
    });
    setRigs(updatedRigs);
  };

  const calculateCategoryTotal = (category: any) => {
    return category.items.reduce((total: number, item: any) => total + item.cost, 0);
  };

  const calculateGrandTotal = () => {
    const currentRig = rigs.find(rig => rig.id === selectedRig);
    if (!currentRig) return 0;
    
    return currentRig.costs.reduce((total, category) => {
      return total + calculateCategoryTotal(category);
    }, 0);
  };

  const getCurrentRigCosts = () => {
    return rigs.find(rig => rig.id === selectedRig)?.costs || [];
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Detailed Cost Breakdown</CardTitle>
          <div className="text-2xl font-bold text-green-600">
            Total: ${calculateGrandTotal().toLocaleString()}
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="rig-select" className="text-sm font-medium">Select Rig:</label>
            <Select value={selectedRig} onValueChange={setSelectedRig}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {rigs.map(rig => (
                  <SelectItem key={rig.id} value={rig.id}>{rig.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <Button onClick={addNewRig} size="sm">
            Add New Rig
          </Button>
          
          {rigs.length > 1 && (
            <Button 
              onClick={() => removeRig(selectedRig)} 
              variant="destructive" 
              size="sm"
            >
              Remove Current Rig
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={getCurrentRigCosts().map(c => c.id)}>
          {getCurrentRigCosts().map(category => (
            <AccordionItem key={category.id} value={category.id}>
              <AccordionTrigger className="text-lg font-medium">
                <div className="flex justify-between w-full mr-4">
                  <span>{category.name}</span>
                  <span className="text-blue-600 font-bold">
                    ${calculateCategoryTotal(category).toLocaleString()}
                  </span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cost Item
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Amount ($)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {category.items.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {item.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <Input
                              type="number"
                              value={item.cost}
                              onChange={(e) => handleCostChange(category.id, item.id, e.target.value)}
                              className="w-32 text-right"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        {rigs.length > 1 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-4">Cost Comparison</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rig
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Cost
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {rigs.map(rig => {
                    const total = rig.costs.reduce((sum, category) => 
                      sum + calculateCategoryTotal(category), 0
                    );
                    return (
                      <tr key={rig.id} className={selectedRig === rig.id ? 'bg-blue-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rig.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold">
                          ${total.toLocaleString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CostBreakdown;
