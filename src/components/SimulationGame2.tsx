
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Game2Data {
  team1: {
    pricing: { company1: number; company2: number; company3: number };
    shares: { company1: number; company2: number; company3: number };
  };
  team2: {
    sharesBid: {
      investor1: { company1: number; company2: number; company3: number };
      investor2: { company1: number; company2: number; company3: number };
      investor3: { company1: number; company2: number; company3: number };
    };
  };
}

interface SimulationGame2Props {
  gameData: Game2Data;
  selectedTeam: 1 | 2;
  onUpdateData: (team: 'team1' | 'team2', data: any) => void;
}

const SimulationGame2: React.FC<SimulationGame2Props> = ({ gameData, selectedTeam, onUpdateData }) => {
  const companies = ['company1', 'company2', 'company3'];
  const companyNames = ['Company 1', 'Company 2', 'Company 3'];

  const handleTeam1Change = (field: 'pricing' | 'shares', company: string, value: string) => {
    const numValue = parseInt(value) || 0;
    onUpdateData('team1', {
      [field]: {
        ...gameData.team1[field],
        [company]: numValue
      }
    });
  };

  const handleTeam2Change = (investor: string, company: string, value: string) => {
    const numValue = parseInt(value) || 0;
    onUpdateData('team2', {
      sharesBid: {
        ...gameData.team2.sharesBid,
        [investor]: {
          ...gameData.team2.sharesBid[investor as keyof typeof gameData.team2.sharesBid],
          [company]: numValue
        }
      }
    });
  };

  const calculateOutputs = () => {
    const sharesBidFor = companies.map(company => {
      return Object.values(gameData.team2.sharesBid).reduce((sum, investor) => {
        return sum + investor[company as keyof typeof investor];
      }, 0);
    });

    const capitalRaised = companies.map((company, index) => {
      const price = gameData.team1.pricing[company as keyof typeof gameData.team1.pricing];
      return sharesBidFor[index] * price;
    });

    const subscription = companies.map((company, index) => {
      const available = gameData.team1.shares[company as keyof typeof gameData.team1.shares];
      const bidFor = sharesBidFor[index];
      if (bidFor > available) return 'Over';
      if (bidFor < available) return 'Under';
      return 'Exact';
    });

    const mostBidsCompany = sharesBidFor.indexOf(Math.max(...sharesBidFor));

    return { sharesBidFor, capitalRaised, subscription, mostBidsCompany };
  };

  const outputs = calculateOutputs();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team 1 Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Team 1 - Pricing & Shares</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-base font-semibold mb-3 block">Pricing</Label>
              <div className="grid grid-cols-3 gap-2">
                {companies.map((company, index) => (
                  <div key={`price-${company}`}>
                    <Label className="text-sm">{companyNames[index]}</Label>
                    <Input
                      type="number"
                      value={gameData.team1.pricing[company as keyof typeof gameData.team1.pricing]}
                      onChange={(e) => handleTeam1Change('pricing', company, e.target.value)}
                      disabled={selectedTeam !== 1}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label className="text-base font-semibold mb-3 block">Shares Available</Label>
              <div className="grid grid-cols-3 gap-2">
                {companies.map((company, index) => (
                  <div key={`shares-${company}`}>
                    <Label className="text-sm">{companyNames[index]}</Label>
                    <Input
                      type="number"
                      value={gameData.team1.shares[company as keyof typeof gameData.team1.shares]}
                      onChange={(e) => handleTeam1Change('shares', company, e.target.value)}
                      disabled={selectedTeam !== 1}
                      className="mt-1"
                    />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Team 2 Inputs */}
        <Card>
          <CardHeader>
            <CardTitle className="text-green-600">Team 2 - Shares Bid</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(gameData.team2.sharesBid).map(([investor, bids]) => (
              <div key={investor}>
                <Label className="text-base font-semibold mb-2 block capitalize">
                  {investor.replace(/(\d+)/, ' $1')}
                </Label>
                <div className="grid grid-cols-3 gap-2">
                  {companies.map((company, index) => (
                    <div key={`${investor}-${company}`}>
                      <Label className="text-sm">{companyNames[index]}</Label>
                      <Input
                        type="number"
                        value={bids[company as keyof typeof bids]}
                        onChange={(e) => handleTeam2Change(investor, company, e.target.value)}
                        disabled={selectedTeam !== 2}
                        className="mt-1"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Common Outputs */}
      <Card>
        <CardHeader>
          <CardTitle className="text-purple-600">Common Outputs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Summary</h3>
              <div className="space-y-2">
                <div className="grid grid-cols-4 gap-2 text-sm font-medium">
                  <span></span>
                  {companyNames.map(name => (
                    <span key={name} className="text-center">{name}</span>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <span className="font-medium">Shares Bid For:</span>
                  {outputs.sharesBidFor.map((shares, index) => (
                    <span key={index} className="text-center">{shares.toLocaleString()}</span>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 text-sm">
                  <span className="font-medium">Capital Raised:</span>
                  {outputs.capitalRaised.map((capital, index) => (
                    <span key={index} className="text-center">{capital.toLocaleString()}</span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Subscription Status</h3>
              <div className="space-y-2">
                {companyNames.map((name, index) => (
                  <div key={name} className="flex justify-between">
                    <span>{name}:</span>
                    <span className={`font-medium ${
                      outputs.subscription[index] === 'Over' ? 'text-red-600' : 
                      outputs.subscription[index] === 'Under' ? 'text-yellow-600' : 
                      'text-green-600'
                    }`}>
                      {outputs.subscription[index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Most Popular Company</h3>
              <p className="text-lg font-semibold text-blue-600">
                {companyNames[outputs.mostBidsCompany]}
              </p>
              <p className="text-sm text-gray-600">
                Received the most bids from investors
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SimulationGame2;
