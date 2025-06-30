
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Play, FileText, Timer } from 'lucide-react';

interface GameSidebarProps {
  timer: number;
}

const GameSidebar: React.FC<GameSidebarProps> = ({ timer }) => {
  const [isFirstTime, setIsFirstTime] = useState(true);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleGuidanceToggle = () => {
    if (isFirstTime) {
      setIsFirstTime(false);
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-blue-50 to-blue-100 p-4 space-y-4 border-r border-blue-200">
      {/* Timer */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-4">
          <div className="flex items-center space-x-2 mb-2">
            <Timer className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-blue-800">Session Timer</span>
          </div>
          <div className="text-2xl font-mono font-bold text-blue-900">
            {formatTime(timer)}
          </div>
        </CardContent>
      </Card>

      {/* Video Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
            <Play className="h-4 w-4 mr-2" />
            Watch Tutorial
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Simulation Tutorial Video</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Tutorial video would be embedded here</p>
              <p className="text-sm text-gray-500 mt-2">
                This video explains the simulation mechanics, team roles, and how to navigate the interface effectively.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Instructions Modal */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full border-blue-300 text-blue-700 hover:bg-blue-50">
            <FileText className="h-4 w-4 mr-2" />
            Instructions
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Game Instructions</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-700">
              Welcome to the Business Simulation Platform! This interactive experience allows two teams to collaborate on financial modeling and investment decisions. Team 1 focuses on inputting values and setting parameters, while Team 2 reviews and approves terms or places investment bids. The simulation features real-time calculations, collaborative workflows, and dynamic outputs that reflect both teams' decisions. Navigate between the two games using the tabs above, and switch team perspectives using the team selector to experience both sides of the negotiation process.
            </p>
          </div>
        </DialogContent>
      </Dialog>

      {/* First Time Guidance */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardContent className="pt-4">
          <Accordion type="single" collapsible defaultValue={isFirstTime ? "guidance" : undefined}>
            <AccordionItem value="guidance">
              <AccordionTrigger 
                className="text-sm font-semibold text-blue-800"
                onClick={handleGuidanceToggle}
              >
                First Time Guidance
              </AccordionTrigger>
              <AccordionContent>
                <div className="text-xs text-gray-700 space-y-2">
                  <p>
                    <strong>Getting Started:</strong> Use the team selector to switch between Team 1 (Input Values) and Team 2 (Approve Terms) perspectives.
                  </p>
                  <p>
                    <strong>Game 1:</strong> Team 1 enters financial metrics while Team 2 approves each term. The valuation updates in real-time when all terms are approved.
                  </p>
                  <p>
                    <strong>Game 2:</strong> Team 1 sets pricing and shares, Team 2 places investor bids. Watch the subscription analysis and capital calculations update automatically.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default GameSidebar;
