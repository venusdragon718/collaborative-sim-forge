
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface TeamSelectorProps {
  selectedTeam: 1 | 2;
  onTeamSelect: (team: 1 | 2) => void;
}

const TeamSelector: React.FC<TeamSelectorProps> = ({ selectedTeam, onTeamSelect }) => {
  return (
    <Card className="mb-4">
      <CardContent className="pt-6">
        <div className="flex justify-center space-x-4">
          <Button
            variant={selectedTeam === 1 ? "default" : "outline"}
            onClick={() => onTeamSelect(1)}
            className="px-8"
          >
            Team 1 (Input Values)
          </Button>
          <Button
            variant={selectedTeam === 2 ? "default" : "outline"}
            onClick={() => onTeamSelect(2)}
            className="px-8"
          >
            Team 2 (Approve Terms)
          </Button>
        </div>
        <p className="text-center text-sm text-gray-600 mt-2">
          You are viewing as: <strong>Team {selectedTeam}</strong>
        </p>
      </CardContent>
    </Card>
  );
};

export default TeamSelector;
