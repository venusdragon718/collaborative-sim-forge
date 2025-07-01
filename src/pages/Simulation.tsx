
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnhancedSimulationGame1 from "@/components/EnhancedSimulationGame1";
import SimulationGame2 from "@/components/SimulationGame2";
import TeamSelector from "@/components/TeamSelector";
import GameSidebar from "@/components/GameSidebar";
import { useSimulation } from "@/hooks/useSimulation";

const Simulation = () => {
  const [selectedTeam, setSelectedTeam] = useState<1 | 2>(1);
  const [timer, setTimer] = useState(0);
  const [sessionId] = useState(() => `session-${Date.now()}`);
  
  const simulation = useSimulation(sessionId);

  // Initialize session on component mount
  useEffect(() => {
    simulation.createSession().catch(console.error);
  }, [simulation]);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setTimer(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex">
      {/* Sidebar */}
      <GameSidebar timer={timer} />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Business Simulation Games
                </h1>
                <p className="text-gray-600 mt-2">
                  Collaborative decision-making platform for financial modeling and investment analysis
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold">John Doe</div>
                <button className="text-sm text-blue-600 hover:underline">Logout</button>
              </div>
            </div>
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
              <EnhancedSimulationGame1 
                selectedTeam={selectedTeam}
                sessionId={sessionId}
                simulation={simulation}
              />
            </TabsContent>
            
            <TabsContent value="game2" className="space-y-6">
              <SimulationGame2 
                selectedTeam={selectedTeam}
                sessionId={sessionId}
                simulation={simulation}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Simulation;
