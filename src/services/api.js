// Mock API service - replace with actual API calls
import axios from 'axios';

class ApiService {
  BASE_URL = 'https://localhost:44382/api';
  constructor() {
    axios.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );
  }


async login(username, password) {
  try {
    const response = await axios.post(`https://localhost:44382/api/Employees/login`, {
      userName: username,
      password: password
    });

    return response.data; // { user, token }
  } catch (error) {
    if (error.response && error.response.status === 401) {
      throw new Error('שם משתמש או סיסמה לא נכונים');
    } else {
      throw new Error('שגיאה בשרת');
    }
  }
};

  async logout() {
    // Mock logout
  }

  // Dashboard
  async getDashboardStats() {
    await new Promise(resolve => setTimeout(resolve, 300));

    return {
      totalSheets: 24,
      totalSubscribers: 15420,
      activeSheets: 18,
      monthlyGrowth: 12.5
    };
  }

  async getRecentActivity() {
    await new Promise(resolve => setTimeout(resolve, 400));

    return [
      {
        id: 1,
        type: 'sheet_created',
        description: 'נוצר גיליון חדש',
        timestamp: '2024-01-15T10:30:00Z',
        sheetName: 'גיליון תשפ"ד - וירא'
      },
      {
        id: 2,
        type: 'subscriber_added',
        description: 'נוסף מנוי חדש',
        timestamp: '2024-01-15T09:15:00Z',
        sheetName: 'גיליון תשפ"ד - לך לך'
      },
      {
        id: 3,
        type: 'subscriber_updated',
        description: 'עודכנו פרטי מנוי',
        timestamp: '2024-01-14T16:45:00Z',
        sheetName: 'גיליון תשפ"ד - נח'
      },
      {
        id: 4,
        type: 'sheet_created',
        description: 'נוצר גיליון חדש',
        timestamp: '2024-01-14T14:20:00Z',
        sheetName: 'גיליון תשפ"ד - בראשית'
      },
      {
        id: 5,
        type: 'subscriber_added',
        description: 'נוסף מנוי חדש',
        timestamp: '2024-01-14T11:30:00Z',
        sheetName: 'גיליון תשפ"ד - וירא'
      }
    ];
  }

  // Sheets
  async getSheets() {
    try {
      const response = await axios.get(`${this.BASE_URL}/Sheet`); return response.data;
    } catch (error) {
      console.error('שגיאה בשליפת גליונות:', error);
      return [];
    }
  }

  async getSheet(id) {
    const sheets = await this.getSheets();
    const sheet = sheets.find(s => s.id === id);
    if (!sheet) throw new Error('גיליון לא נמצא');
    return sheet;
  }

  // Subscribers
  async getSubscribers(sheetId, page = 1, pageSize = 50, filters) {
     try {
      const response = await axios.get(`${this.BASE_URL}/SubscriberWin/${sheetId}`); return response.data;
    } catch (error) {
      console.error('שגיאה בשליפת גליונות:', error);
      return [];
    }
      
  }

  async updateSubscriber(sheetId, subscriber) {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock update
  }

  async deleteSubscriber(sheetId, filingNumber) {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock delete
  }

  async addSubscriber(sheetId, subscriber) {
    await new Promise(resolve => setTimeout(resolve, 500));
    // Mock add
  }

  // Dropdown options
  async getParashaAnswers() {
   try {
      const response = await axios.get(`${this.BASE_URL}/CodeWithoutAnswersParasha`); return response.data;
    } catch (error) {
      console.error('שגיאה בשליפת קוד ללא תשובות פרשה:', error);
      return [];
    }
  }

  async getYiunHalachaAnswers() {
   try {
      const response = await axios.get(`${this.BASE_URL}/CodeWithoutAnswers`); return response.data;
    } catch (error) {
      console.error('שגיאה בשליפת קוד ללא תשובות פרשה:', error);
      return [];
    }
  }

  // Search subscribers
  async searchSubscribers(query) {
    await new Promise(resolve => setTimeout(resolve, 300));

    // Mock search results
    return [
      { code: 'SUB0001', name: 'יחיאל כהן', idNumber: '123456789', yeshiva: 'מיר', locality: 'ירושלים' },
      { code: 'SUB0002', name: 'משה לוי', idNumber: '987654321', yeshiva: 'פוניבז', locality: 'בני ברק' },
      { code: 'SUB0003', name: 'אברהם ברק', idNumber: '456789123', yeshiva: 'חברון', locality: 'ביתר עילית' }
    ].filter(s =>
      s.code.includes(query) ||
      s.name.includes(query) ||
      s.idNumber.includes(query)
    );
  }
}

export const apiService = new ApiService();