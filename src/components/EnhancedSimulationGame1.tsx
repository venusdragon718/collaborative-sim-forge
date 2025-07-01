
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import PieChart from './PieChart';
import FactorScoreSlider from './FactorScoreSlider';

interface EnhancedSimulationGame1Props {
  selectedTeam: 1 | 2;
  sessionId: string;
  simulation: any;
}

const EnhancedSimulationGame1: React.FC<EnhancedSimulationGame1Props> = ({ 
  selectedTeam, 
  sessionId,
  simulation
}) => {
  const [gameData, setGameData] = useState({
    team1: {
      ebitda: 10,
      interest_rate: 20,
      multiple: 10,
      factor_score: 2,
      company_name: 'ABC Corp.',
      description: 'This is the company\'s description. This company is B2B'
    },
    team2: {
      ebitda_approval: 'TBD',
      interest_rate_approval: 'OK',
      multiple_approval: 'TBD',
      factor_score_approval: 'OK',
      company_name_approval: 'TBD',
      description_approval: 'TBD'
    }
  });

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
    const valuation = gameData.team1.ebitda * gameData.team1.multiple * gameData.team1.factor_score;
    const percentage = Math.min(Math.max((valuation / 1000000000) * 100, 10), 90);
    return { value: formatCurrency(valuation), percentage: Math.round(percentage) };
  };

  const handleTeam1Change = async (field: string, value: string | number) => {
    const processedValue = typeof value === 'string' && field !== 'company_name' && field !== 'description'
      ? (field === 'interest_rate' ? parseFloat(value) : parseInt(value) || 0)
      : value;
    
    // Update local state immediately for better UX
    setGameData(prev => ({
      ...prev,
      team1: {
        ...prev.team1,
        [field]: processedValue
      }
    }));

    try {
      // Map frontend field names to backend field names
      const fieldMapping: { [key: string]: string } = {
        ebitda: 'ebitda',
        interestRate: 'interest_rate',
        multiple: 'multiple',
        factorScore: 'factor_score',
        companyName: 'company_name',
        description: 'description'
      };

      const backendField = fieldMapping[field] || field;
      
      await simulation.updateGame1Input(selectedTeam, { 
        [backendField]: processedValue 
      });

      // Reset corresponding approval in local state
      const approvalMap: { [key: string]: string } = {
        ebitda: 'ebitda_approval',
        interestRate: 'interest_rate_approval',
        multiple: 'multiple_approval',
        factorScore: 'factor_score_approval',
        companyName: 'company_name_approval',
        description: 'description_approval'
      };
      
      if (approvalMap[field]) {
        setGameData(prev => ({
          ...prev,
          team2: {
            ...prev.team2,
            [approvalMap[field]]: 'TBD'
          }
        }));
      }
    } catch (error) {
      console.error('Failed to update input:', error);
    }
  };

  const handleTeam2Toggle = async (field: string) => {
    const currentValue = gameData.team2[field as keyof typeof gameData.team2];
    const newValue = currentValue === 'TBD' ? 'OK' : 'TBD';
    
    // Update local state immediately
    setGameData(prev => ({
      ...prev,
      team2: {
        ...prev.team2,
        [field]: newValue
      }
    }));

    try {
      await simulation.updateGame1Approval(selectedTeam, { 
        [field]: newValue 
      });
    } catch (error) {
      console.error('Failed to update approval:', error);
      // Revert local state on error
      setGameData(prev => ({
        ...prev,
        team2: {
          ...prev.team2,
          [field]: currentValue
        }
      }));
    }
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
                <Badge variant={gameData.team2.ebitda_approval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.ebitda_approval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('ebitda_approval')}
                  >
                    {gameData.team2.ebitda_approval === 'TBD' ? 'OK' : 'TBD'}
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
                  value={gameData.team1.interest_rate}
                  onChange={(e) => handleTeam1Change('interestRate', e.target.value)}
                  disabled={selectedTeam !== 1}
                  className="mt-1 w-20"
                />
                <span className="text-xs text-gray-500 ml-2">%</span>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={gameData.team2.interest_rate_approval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.interest_rate_approval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('interest_rate_approval')}
                  >
                    {gameData.team2.interest_rate_approval === 'TBD' ? 'OK' : 'TBD'}
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
                <Badge variant={gameData.team2.multiple_approval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.multiple_approval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('multiple_approval')}
                  >
                    {gameData.team2.multiple_approval === 'TBD' ? 'OK' : 'TBD'}
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
                    value={gameData.team1.factor_score}
                    onChange={(value) => handleTeam1Change('factorScore', value)}
                    disabled={selectedTeam !== 1}
                  />
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={gameData.team2.factor_score_approval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.factor_score_approval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('factor_score_approval')}
                  >
                    {gameData.team2.factor_score_approval === 'TBD' ? 'OK' : 'TBD'}
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
                  value={gameData.team1.company_name}
                  onChange={(e) => handleTeam1Change('companyName', e.target.value)}
                  disabled={selectedTeam !== 1}
                  className="mt-1"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant={gameData.team2.company_name_approval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.company_name_approval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('company_name_approval')}
                  >
                    {gameData.team2.company_name_approval === 'TBD' ? 'OK' : 'TBD'}
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
                <Badge variant={gameData.team2.description_approval === 'OK' ? 'default' : 'secondary'}>
                  {gameData.team2.description_approval}
                </Badge>
                {selectedTeam === 2 && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleTeam2Toggle('description_approval')}
                  >
                    {gameData.team2.description_approval === 'TBD' ? 'OK' : 'TBD'}
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
