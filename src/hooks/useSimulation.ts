
import { useState, useCallback } from 'react';
import { apiService, Game1InputData, Game1ApprovalData, Game2InputData, InvestorBidsData } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

export const useSimulation = (sessionId: string = 'default-session') => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleApiCall = useCallback(async (apiCall: () => Promise<any>, successMessage?: string) => {
    setLoading(true);
    try {
      const result = await apiCall();
      if (successMessage) {
        toast({
          title: "Success",
          description: successMessage,
        });
      }
      return result;
    } catch (error) {
      console.error('API Error:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const updateGame1Input = useCallback(async (team: number, data: Game1InputData) => {
    return handleApiCall(
      () => apiService.updateGame1Input(sessionId, team, data),
      "Game 1 input updated successfully"
    );
  }, [sessionId, handleApiCall]);

  const updateGame1Approval = useCallback(async (team: number, data: Game1ApprovalData) => {
    return handleApiCall(
      () => apiService.updateGame1Approval(sessionId, team, data),
      "Approval status updated"
    );
  }, [sessionId, handleApiCall]);

  const updateGame2Input = useCallback(async (team: number, data: Game2InputData) => {
    return handleApiCall(
      () => apiService.updateGame2Input(sessionId, team, data),
      "Game 2 input updated successfully"
    );
  }, [sessionId, handleApiCall]);

  const updateGame2Bids = useCallback(async (team: number, data: InvestorBidsData) => {
    return handleApiCall(
      () => apiService.updateGame2Bids(sessionId, team, data),
      "Bids updated successfully"
    );
  }, [sessionId, handleApiCall]);

  const createSession = useCallback(async () => {
    return handleApiCall(
      () => apiService.createSession(sessionId),
      "Session created successfully"
    );
  }, [sessionId, handleApiCall]);

  return {
    loading,
    updateGame1Input,
    updateGame1Approval,
    updateGame2Input,
    updateGame2Bids,
    createSession,
  };
};
