const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

class ApiService {
  private getAuthToken(): string | null {
    const user = localStorage.getItem('auth_user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.token;
    }
    return null;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = this.getAuthToken();
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        if (response.status === 401) {
          // Token expired or invalid, clear auth data
          localStorage.removeItem('auth_user');
          window.location.href = '/auth';
          throw new Error('Authentication required');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication APIs
  async login(email: string, password: string) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async signup(email: string, password: string) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  }

  async validateToken(token: string) {
    return this.request('/auth/validate', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Dashboard APIs
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  async healthCheck() {
    return this.request('/dashboard/health');
  }

  // Donor APIs
  async getAllDonors() {
    return this.request('/donors');
  }

  async createDonor(donor: any) {
    return this.request('/donors', {
      method: 'POST',
      body: JSON.stringify(donor),
    });
  }

  async updateDonor(id: number, donor: any) {
    return this.request(`/donors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(donor),
    });
  }

  async deleteDonor(id: number) {
    return this.request(`/donors/${id}`, {
      method: 'DELETE',
    });
  }

  async getDonorsByBloodGroup(bloodGroup: string) {
    return this.request(`/donors/blood-group/${bloodGroup}`);
  }

  // Blood Request APIs
  async getAllRequests() {
    return this.request('/requests');
  }

  async createRequest(request: any) {
    return this.request('/requests', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateRequestStatus(id: number, status: string) {
    return this.request(`/requests/${id}/status?status=${status}`, {
      method: 'PUT',
    });
  }

  async getRequestsByStatus(status: string) {
    return this.request(`/requests/status/${status}`);
  }

  // Blood Stock APIs
  async getAllStock() {
    return this.request('/stock');
  }

  async updateStockQuantity(id: number, quantity: number) {
    return this.request(`/stock/${id}/quantity?quantity=${quantity}`, {
      method: 'PUT',
    });
  }

  async getExpiringStock(days: number = 7) {
    return this.request(`/stock/expiring?days=${days}`);
  }

  async getTotalUnits() {
    return this.request('/stock/total-units');
  }

  async getExpiringUnitsCount(days: number = 2) {
    return this.request(`/stock/expiring/count?days=${days}`);
  }

  async getExpiredStock() {
    return this.request('/stock/expired');
  }

  async discardExpiredStock() {
    return this.request('/stock/discard-expired', {
      method: 'POST',
    });
  }

  async discardStockById(id: number) {
    return this.request(`/stock/${id}/discard`, {
      method: 'POST',
    });
  }
}

export const apiService = new ApiService();