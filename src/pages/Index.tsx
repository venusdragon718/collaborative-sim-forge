
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Business Simulation Platform
          </h1>
          <p className="text-lg text-gray-600">
            Collaborative simulation games for business analysis and decision making
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-blue-600">Simulation Game 1</CardTitle>
              <CardDescription>
                Team collaboration on EBITDA valuation with approval workflow
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Team 1 inputs financial metrics</li>
                <li>• Team 2 approves or rejects terms</li>
                <li>• Real-time valuation calculations</li>
                <li>• Collaborative decision making</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-green-600">Simulation Game 2</CardTitle>
              <CardDescription>
                Investment bidding simulation with multiple companies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Team 1 sets pricing and shares</li>
                <li>• Team 2 places investor bids</li>
                <li>• Automatic subscription analysis</li>
                <li>• Capital raising calculations</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <Button 
            onClick={() => navigate('/simulation')} 
            size="lg"
            className="px-8 py-3 text-lg"
          >
            Start Simulation Games
          </Button>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Switch between Team 1 and Team 2 perspectives to experience collaborative gameplay</p>
        </div>
      </div>
    </div>
  );
};

export default Index;
