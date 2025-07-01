
const API_BASE_URL = 'http://localhost:8000';

export interface Game1InputData {
  ebitda?: number;
  interest_rate?: number;
  multiple?: number;
  factor_score?: number;
  company_name?: string;
  description?: string;
}

export interface Game1ApprovalData {
  ebitda_approval?: string;
  interest_rate_approval?: string;
  multiple_approval?: string;
  factor_score_approval?: string;
  company_name_approval?: string;
  description_approval?: string;
}

export interface Game2InputData {
  company1_price?: number;
  company2_price?: number;
  company3_price?: number;
  company1_shares?: number;
  company2_shares?: number;
  company3_shares?: number;
}

export interface InvestorBidsData {
  investor1_company1_bid?: number;
  investor1_company2_bid?: number;
  investor1_company3_bid?: number;
  investor2_company1_bid?: number;
  investor2_company2_bid?: number;
  investor2_company3_bid?: number;
  investor3_company1_bid?: number;
  investor3_company2_bid?: number;
  investor3_company3_bid?: number;
}

class ApiService {
  private async makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async createSession(sessionId: string) {
    return this.makeRequest(`/simulation/?session_id=${sessionId}`, {
      method: 'POST',
    });
  }

  async updateGame1Input(sessionId: string, team: number, data: Game1InputData) {
    return this.makeRequest(`/simulation/game1/${sessionId}/${team}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGame1Approval(sessionId: string, team: number, data: Game1ApprovalData) {
    return this.makeRequest(`/simulation/game1/approve/${sessionId}/${team}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGame2Input(sessionId: string, team: number, data: Game2InputData) {
    return this.makeRequest(`/simulation/game2/${sessionId}/${team}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateGame2Bids(sessionId: string, team: number, data: InvestorBidsData) {
    return this.makeRequest(`/simulation/game2/bids/${sessionId}/${team}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async healthCheck() {
    return this.makeRequest('/health');
  }
}

export const apiService = new ApiService();
