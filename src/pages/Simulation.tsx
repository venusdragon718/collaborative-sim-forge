
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SimulationGame1 from "@/components/SimulationGame1";
import SimulationGame2 from "@/components/SimulationGame2";
import TeamSelector from "@/components/TeamSelector";
import GameSidebar from "@/components/GameSidebar";

const Simulation = () => {
  const [selectedTeam, setSelectedTeam] = useState<1 | 2>(1);
  const [timer, setTimer] = useState(0);
  const [gameData, setGameData] = useState({
    game1: {
      team1: {
        ebitda: 100000000,
        interestRate: 15,
        multiple: 3,
        factorScore: 2
      },
      team2: {
        ebitdaApproval: 'TBD',
        interestRateApproval: 'OK',
        multipleApproval: 'TBD',
        factorScoreApproval: 'OK'
      }
    },
    game2: {
      team1: {
        pricing: { company1: 4, company2: 12, company3: 15 },
        shares: { company1: 10000, company2: 8000, company3: 5000 }
      },
      team2: {
        sharesBid: {
          investor1: { company1: 1000, company2: 4000, company3: 1300 },
          investor2: { company1: 1500, company2: 2000, company3: 4000 },
          investor3: { company1: 6000, company2: 1000, company3: 1000 }
        }
      }
    }
  });

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateGameData = (game: 'game1' | 'game2', team: 'team1' | 'team2', data: any) => {
    setGameData(prev => ({
      ...prev,
      [game]: {
        ...prev[game],
        [team]: {
          ...prev[game][team],
          ...data
        }
      }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Sidebar */}
      <GameSidebar timer={timer} />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Business Simulation Games
            </h1>
            <p className="text-center text-gray-600 mb-6">
              Collaborative decision-making platform for financial modeling and investment analysis
            </p>
            <TeamSelector selectedTeam={selectedTeam} onTeamSelect={setSelectedTeam} />
          </div>

          <Tabs defaultValue="game1" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="game1" className="text-lg py-3">
                🎯 Valuation Simulation
              </TabsTrigger>
              <TabsTrigger value="game2" className="text-lg py-3">
                💼 Investment Bidding
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="game1" className="space-y-6">
              <SimulationGame1 
                gameData={gameData.game1}
                selectedTeam={selectedTeam}
                onUpdateData={(team, data) => updateGameData('game1', team, data)}
              />
            </TabsContent>
            
            <TabsContent value="game2" className="space-y-6">
              <SimulationGame2 
                gameData={gameData.game2}
                selectedTeam={selectedTeam}
                onUpdateData={(team, data) => updateGameData('game2', team, data)}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
