const API_BASE_URL = 'http://localhost:8080/api/v1';

export interface SteamUser {
  steamId: string;
  username: string;
  realName?: string;
  avatar?: string;
  avatarMedium?: string;
  avatarFull?: string;
  profileUrl?: string;
  personaState?: number;
  communityVisibilityState?: number;
}

export interface ItemDto {
  appId?: number;
  classId?: string;
  instanceId?: string;
  currency?: number;
  backgroundColor?: string;
  iconUrl?: string;
  tradable?: number;
  name?: string;
  marketHashName?: string;
  nameColor?: string;
  type?: string;
  marketName?: string;
  commodity?: number;
  marketable?: number;
}

export interface ResponseDto<T> {
  code: number;
  message: string;
  data?: T[];
}

export interface PriceTimeSeriesDto {
  time: number;
  price: number;
}

class ApiService {
  private async fetchWithCredentials<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ResponseDto<T>> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      credentials: 'include', // Important for session cookies
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  async getCurrentUser(): Promise<SteamUser | null> {
    try {
      const response = await this.fetchWithCredentials<SteamUser>('/auth/user');
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Failed to get current user:', error);
      return null;
    }
  }

  async getInventory(steamId: string): Promise<ItemDto[]> {
    try {
      const response = await this.fetchWithCredentials<ItemDto>(`/inventory/${steamId}`);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get inventory:', error);
      return [];
    }
  }

  async checkAuthStatus(): Promise<boolean> {
    try {
      const response = await this.fetchWithCredentials('/auth/status');
      return response.message.includes('Authenticated');
    } catch (error) {
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.fetchWithCredentials('/auth/logout');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  }

  getSteamLoginUrl(): string {
    return `${API_BASE_URL}/auth/steam/login`;
  }

  async getPrice(marketHashName: string): Promise<number | null> {
    try {
      const response = await this.fetchWithCredentials<number>(`/price?marketHashName=${encodeURIComponent(marketHashName)}`);
      return response.data && response.data.length > 0 ? response.data[0] : null;
    } catch (error) {
      console.error('Failed to get price:', error);
      return null;
    }
  }

  async getPriceHistory(
    marketHashName: string,
    startTime?: string,
    endTime?: string
  ): Promise<PriceTimeSeriesDto[]> {
    try {
      let url = `/price/history?marketHashName=${encodeURIComponent(marketHashName)}`;
      if (startTime) {
        url += `&startTime=${encodeURIComponent(startTime)}`;
      }
      if (endTime) {
        url += `&endTime=${encodeURIComponent(endTime)}`;
      }
      const response = await this.fetchWithCredentials<PriceTimeSeriesDto>(url);
      return response.data || [];
    } catch (error) {
      console.error('Failed to get price history:', error);
      return [];
    }
  }
}

export const apiService = new ApiService();

