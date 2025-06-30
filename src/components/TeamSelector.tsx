
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, CheckCircle } from 'lucide-react';

interface TeamSelectorProps {
  selectedTeam: 1 | 2;
  onTeamSelect: (team: 1 | 2) => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ selectedTeam, onTeamSelect }) => {
  return (
    <Card className="mb-6 bg-white/80 backdrop-blur-sm border-2 border-blue-100">
      <CardContent className="pt-6">
        <div className="flex justify-center space-x-6">
          <Button
            variant={selectedTeam === 1 ? "default" : "outline"}
            onClick={() => onTeamSelect(1)}
            className={`px-8 py-4 text-lg font-semibold transition-all duration-200 ${
              selectedTeam === 1 
                ? "bg-blue-600 hover:bg-blue-700 shadow-lg transform scale-105" 
                : "border-blue-300 text-blue-700 hover:bg-blue-50"
            }`}
          >
            <Users className="mr-2 h-5 w-5" />
            Team 1
            <span className="ml-2 text-sm opacity-75">(Input Values)</span>
          </Button>
          <Button
            variant={selectedTeam === 2 ? "default" : "outline"}
            onClick={() => onTeamSelect(2)}
            className={`px-8 py-4 text-lg font-semibold transition-all duration-200 ${
              selectedTeam === 2 
                ? "bg-green-600 hover:bg-green-700 shadow-lg transform scale-105" 
                : "border-green-300 text-green-700 hover:bg-green-50"
            }`}
          >
            <CheckCircle className="mr-2 h-5 w-5" />
            Team 2
            <span className="ml-2 text-sm opacity-75">(Approve Terms)</span>
          </Button>
        </div>
        <div className="text-center mt-4 p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
          <p className="text-sm text-gray-700">
            Current Perspective: <strong className="text-lg">Team {selectedTeam}</strong>
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {selectedTeam === 1 ? "You can modify input values" : "You can approve or reject terms"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamSelector;
