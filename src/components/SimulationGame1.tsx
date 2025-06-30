
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

interface Game1Data {
  team1: {
    ebitda: number;
    interestRate: number;
    multiple: number;
    factorScore: number;
  };
  team2: {
    ebitdaApproval: string;
    interestRateApproval: string;
    multipleApproval: string;
    factorScoreApproval: string;
  };
}

interface SimulationGame1Props {
  gameData: Game1Data;
  selectedTeam: 1 | 2;
  onUpdateData: (team: 'team1' | 'team2', data: any) => void;
}

const SimulationGame1: React.FC<SimulationGame1Props> = ({ gameData, selectedTeam, onUpdateData }) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const calculateValuation = () => {
    const allApproved = Object.values(gameData.team2).every(approval => approval === 'OK');
    if (!allApproved) {
      return "Not yet agreed by Team 2";
    }
    // Simple valuation calculation: EBITDA * Multiple * Factor Score * (1 + Interest Rate)
    const valuation = gameData.team1.ebitda * gameData.team1.multiple * gameData.team1.factorScore * (1 + gameData.team1.interestRate / 100);
    return formatCurrency(valuation);
  };

  const handleTeam1Change = (field: string, value: string) => {
    const numValue = field === 'interestRate' ? parseFloat(value) : parseInt(value) || 0;
    onUpdateData('team1', { [field]: numValue });
    
    // Reset corresponding approval to TBD when Team 1 changes input
    const approvalMap: { [key: string]: string } = {
      ebitda: 'ebitdaApproval',
      interestRate: 'interestRateApproval',
      multiple: 'multipleApproval',
      factorScore: 'factorScoreApproval'
    };
    
    if (approvalMap[field]) {
      onUpdateData('team2', { [approvalMap[field]]: 'TBD' });
    }
  };

  const handleTeam2Toggle = (field: string) => {
    const currentValue = gameData.team2[field as keyof typeof gameData.team2];
    const newValue = currentValue === 'TBD' ? 'OK' : 'TBD';
    onUpdateData('team2', { [field]: newValue });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Team 1 Inputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-blue-600">Team 1 - Inputs</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ebitda">EBITDA</Label>
            <Input
              id="ebitda"
              type="number"
              value={gameData.team1.ebitda}
              onChange={(e) => handleTeam1Change('ebitda', e.target.value)}
              disabled={selectedTeam !== 1}
              className="mt-1"
            />
            <span className="text-sm text-gray-500">USD</span>
          </div>
          
          <div>
            <Label htmlFor="interestRate">Interest Rate</Label>
            <Input
              id="interestRate"
              type="number"
              step="0.1"
              value={gameData.team1.interestRate}
              onChange={(e) => handleTeam1Change('interestRate', e.target.value)}
              disabled={selectedTeam !== 1}
              className="mt-1"
            />
            <span className="text-sm text-gray-500">%</span>
          </div>
          
          <div>
            <Label htmlFor="multiple">Multiple</Label>
            <Input
              id="multiple"
              type="number"
              value={gameData.team1.multiple}
              onChange={(e) => handleTeam1Change('multiple', e.target.value)}
              disabled={selectedTeam !== 1}
              className="mt-1"
            />
            <span className="text-sm text-gray-500">#</span>
          </div>
          
          <div>
            <Label htmlFor="factorScore">Factor Score</Label>
            <Input
              id="factorScore"
              type="number"
              value={gameData.team1.factorScore}
              onChange={(e) => handleTeam1Change('factorScore', e.target.value)}
              disabled={selectedTeam !== 1}
              className="mt-1"
            />
            <span className="text-sm text-gray-500">#</span>
          </div>
        </CardContent>
      </Card>

      {/* Team 2 Approvals */}
      <Card>
        <CardHeader>
          <CardTitle className="text-green-600">Team 2 - Approvals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(gameData.team2).map(([key, value]) => {
            const fieldName = key.replace('Approval', '').replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
            return (
              <div key={key} className="flex items-center justify-between p-3 border rounded">
                <span className="font-medium">{fieldName}:</span>
                <div className="flex items-center space-x-2">
                  <Badge variant={value === 'OK' ? 'default' : 'secondary'}>
                    {value}
                  </Badge>
                  {selectedTeam === 2 && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleTeam2Toggle(key)}
                    >
                      Toggle
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Common Output */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-purple-600">Common Output - Valuation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold mb-2">Valuation Result</h3>
            <p className="text-xl text-blue-600 font-semibold">
              {calculateValuation()}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationGame1;
