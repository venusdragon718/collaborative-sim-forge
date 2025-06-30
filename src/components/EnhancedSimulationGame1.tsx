
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import PieChart from './PieChart';
import FactorScoreSlider from './FactorScoreSlider';

interface Game1Data {
  team1: {
    ebitda: number;
    interestRate: number;
    multiple: number;
    factorScore: number;
    companyName: string;
    description: string;
  };
  team2: {
    ebitdaApproval: string;
    interestRateApproval: string;
    multipleApproval: string;
    factorScoreApproval: string;
    companyNameApproval: string;
    descriptionApproval: string;
  };
}

interface EnhancedSimulationGame1Props {
  gameData: Game1Data;
  selectedTeam: 1 | 2;
  onUpdateData: (team: 'team1' | 'team2', data: any) => void;
}

const EnhancedSimulationGame1: React.FC<EnhancedSimulationGame1Props> = ({ 
  gameData, 
  selectedTeam, 
  onUpdateData 
}) => {
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
      return { value: "Not yet agreed by Team 2", percentage: 20 };
    }
    const valuation = gameData.team1.ebitda * gameData.team1.multiple * gameData.team1.factorScore;
    const percentage = Math.min(Math.max((valuation / 1000000000) * 100, 10), 90);
    return { value: formatCurrency(valuation), percentage: Math.round(percentage) };
  };

  const handleTeam1Change = (field: string, value: string | number) => {
    const processedValue = typeof value === 'string' && field !== 'companyName' && field !== 'description'
      ? (field === 'interestRate' ? parseFloat(value) : parseInt(value) || 0)
      : value;
    
    onUpdateData('team1', { [field]: processedValue });
    
    // Reset corresponding approval
    const approvalMap: { [key: string]: string } = {
      ebitda: 'ebitdaApproval',
      interestRate: 'interestRateApproval',
      multiple: 'multipleApproval',
      factorScore: 'factorScoreApproval',
      companyName: 'companyNameApproval',
      description: 'descriptionApproval'
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

  const valuation = calculateValuation();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Input Fields */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Financial Inputs</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* EBITDA */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="ebitda" className="text-sm font-medium">EBITDA:</Label>
                <Input
                  id="ebitda"
                  type="number"
                  value={gameData.team1.ebitda}
                  onChange={(e) => handleTeam1Change('ebitda', e.target.value)}
                  disabled={selectedTeam !== 1}
                  className="mt-1 w-32"
                />
                <span className="text-xs text-gray-500 ml-2">million</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={gameData.team2.ebitdaApproval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.ebitdaApproval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('ebitdaApproval')}
                  >
                    {gameData.team2.ebitdaApproval === 'TBD' ? 'OK' : 'TBD'}
                  </Button>
                )}
              </div>
            </div>

            {/* Interest Rate */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="interestRate" className="text-sm font-medium">Interest Rate:</Label>
                <Input
                  id="interestRate"
                  type="number"
                  step="0.1"
                  value={gameData.team1.interestRate}
                  onChange={(e) => handleTeam1Change('interestRate', e.target.value)}
                  disabled={selectedTeam !== 1}
                  className="mt-1 w-20"
                />
                <span className="text-xs text-gray-500 ml-2">%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={gameData.team2.interestRateApproval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.interestRateApproval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('interestRateApproval')}
                  >
                    {gameData.team2.interestRateApproval === 'TBD' ? 'OK' : 'TBD'}
                  </Button>
                )}
              </div>
            </div>

            {/* Multiple */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="multiple" className="text-sm font-medium">Multiple:</Label>
                <Input
                  id="multiple"
                  type="number"
                  value={gameData.team1.multiple}
                  onChange={(e) => handleTeam1Change('multiple', e.target.value)}
                  disabled={selectedTeam !== 1}
                  className="mt-1 w-20"
                />
                <span className="text-xs text-gray-500 ml-2">x</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={gameData.team2.multipleApproval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.multipleApproval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('multipleApproval')}
                  >
                    {gameData.team2.multipleApproval === 'TBD' ? 'OK' : 'TBD'}
                  </Button>
                )}
              </div>
            </div>

            {/* Factor Score */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <Label className="text-sm font-medium">Factor Score:</Label>
                <div className="mt-2">
                  <FactorScoreSlider
                    value={gameData.team1.factorScore}
                    onChange={(value) => handleTeam1Change('factorScore', value)}
                    disabled={selectedTeam !== 1}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={gameData.team2.factorScoreApproval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.factorScoreApproval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('factorScoreApproval')}
                  >
                    {gameData.team2.factorScoreApproval === 'TBD' ? 'OK' : 'TBD'}
                  </Button>
                )}
              </div>
            </div>

            {/* Company Name */}
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="companyName" className="text-sm font-medium">Company Name:</Label>
                <Input
                  id="companyName"
                  type="text"
                  value={gameData.team1.companyName}
                  onChange={(e) => handleTeam1Change('companyName', e.target.value)}
                  disabled={selectedTeam !== 1}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={gameData.team2.companyNameApproval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.companyNameApproval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('companyNameApproval')}
                  >
                    {gameData.team2.companyNameApproval === 'TBD' ? 'OK' : 'TBD'}
                  </Button>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <Label htmlFor="description" className="text-sm font-medium">Description:</Label>
                <Textarea
                  id="description"
                  value={gameData.team1.description}
                  onChange={(e) => handleTeam1Change('description', e.target.value)}
                  disabled={selectedTeam !== 1}
                  className="mt-1"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2 ml-4">
                <Badge variant={gameData.team2.descriptionApproval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.descriptionApproval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('descriptionApproval')}
                  >
                    {gameData.team2.descriptionApproval === 'TBD' ? 'OK' : 'TBD'}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Valuation and Chart */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-purple-600">Valuation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="text-lg font-bold mb-4">
              {valuation.value}
            </div>
            <PieChart percentage={valuation.percentage} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Next Stage</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-gray-600">
              STRUCTURING - 1 hour
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EnhancedSimulationGame1;
