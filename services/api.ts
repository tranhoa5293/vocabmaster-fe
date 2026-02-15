
const API_BASE_URL = 'http://localhost:8080/api/v1';

class ApiService {
  private token: string | null = localStorage.getItem('auth_token');

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('auth_token', token);
  }

  getToken() {
    return this.token;
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers = {
      'Content-Type': 'application/json',
      ...(this.token ? { 'Authorization': `Bearer ${this.token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, { ...options, headers });
      
      if (response.status === 401) {
        // Chỉ logout nếu không phải đang trong quá trình init (me)
        // Hoặc để App.tsx tự xử lý lỗi 401
        if (endpoint !== '/auth/me') {
          this.logout();
          window.location.href = '/'; 
        }
        throw new Error('Unauthorized');
      }
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `API Request failed: ${response.status}`);
      }

      return response.json();
    } catch (err) {
      console.error(`API Error [${endpoint}]:`, err);
      throw err;
    }
  }

  // Auth
  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Collections & Lessons
  async getCollections() {
    return this.request('/collections');
  }

  async getLessons(collectionId: string) {
    return this.request(`/collections/${collectionId}/lessons`);
  }

  async saveLesson(collectionId: string, name: string) {
    return this.request(`/collections/${collectionId}/lessons`, {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async toggleFavoriteCollection(collectionId: string) {
    return this.request(`/collections/${collectionId}/favorite`, {
      method: 'POST'
    });
  }

  async toggleFavoriteLesson(lessonId: string) {
    return this.request(`/lessons/${lessonId}/favorite`, {
      method: 'POST'
    });
  }

  // Vocabulary
  async getVocabulary(lessonId: string) {
    return this.request(`/vocabulary/lessons/${lessonId}`);
  }

  async getDueVocabulary(limit: number = 10, lessonId?: string, mode?: string) {
    let url = `/vocabulary/due?limit=${limit}`;
    if (lessonId) {
      url += `&lessonId=${lessonId}`;
    }
    if (mode) {
      url += `&mode=${mode}`;
    }
    return this.request(url);
  }

  // Phân trang cho bảng Progress
  async getUserProgress(page: number = 0, size: number = 10) {
    return this.request(`/vocabulary/progress?page=${page}&size=${size}`);
  }

  // Stats - Mới: Chỉ lấy số lượng, không lấy data { totalLearning: 0, dueCount: 0, masteredCount: 0 }
  async getStudyStats() {
    return this.request('/vocabulary/stats');
  }

  // SRS Actions
  async updateSRS(vocabId: string, score: number) {
    return this.request('/srs/update', {
      method: 'POST',
      body: JSON.stringify({ vocabId, score }),
    });
  }

  async updateSRSBatch(updates: Array<{ vocabId: string; score: number }>) {
    return this.request('/srs/batch-update', {
      method: 'POST',
      body: JSON.stringify(updates),
    });
  }

  async saveCollection(data: { name: string; description: string; category: string }) {
    return this.request('/collections', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async importVocabulary(lessonId: string, items: any[]) {
    return this.request(`/vocabulary/lessons/${lessonId}/import`, {
      method: 'POST',
      body: JSON.stringify(items),
    });
  }

  // Social & Community
  async getActiveLearners() {
    return this.request('/active-learners');
  }

  async getLeaderboard(period: string = 'weekly') {
    return this.request(`/leaderboard?period=${period}`);
  }
}

export const api = new ApiService();
