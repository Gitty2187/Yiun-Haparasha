// Mock API service - replace with actual API calls
class ApiService {
  baseUrl = '/api';

  // Auth
  async login(username, password) {
    // Mock login - replace with actual API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (username === 'admin' && password === 'password') {
      return {
        user: {
          id: 1,
          username: 'admin',
          name: 'מנהל המערכת'
        },
        token: 'mock-jwt-token'
      };
    }
    
    throw new Error('שם משתמש או סיסמה שגויים');
  }

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
    // Mock sheets data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return [
      { id: 1, name: 'גיליון תשפ"ד - בראשית', number: '001', parasha: 'בראשית', subscriberCount: 5250 },
      { id: 2, name: 'גיליון תשפ"ד - נח', number: '002', parasha: 'נח', subscriberCount: 4180 },
      { id: 3, name: 'גיליון תשפ"ד - לך לך', number: '003', parasha: 'לך לך', subscriberCount: 6320 },
      { id: 4, name: 'גיליון תשפ"ד - וירא', number: '004', parasha: 'וירא', subscriberCount: 7420 },
    ];
  }

  async getSheet(id) {
    const sheets = await this.getSheets();
    const sheet = sheets.find(s => s.id === id);
    if (!sheet) throw new Error('גיליון לא נמצא');
    return sheet;
  }

  // Subscribers
  async getSubscribers(sheetId, page = 1, pageSize = 50, filters) {
    await new Promise(resolve => setTimeout(resolve, 800));

    // Generate mock data with much more subscribers
    const mockSubscribers = [];
    const totalCount = 5250; // Increased from 1250
    
    for (let i = (page - 1) * pageSize; i < Math.min(page * pageSize, totalCount); i++) {
      mockSubscribers.push({
        filingNumber: 1000 + i,
        subscriberCode: `SUB${String(i + 1).padStart(4, '0')}`,
        name: `מנוי ${i + 1}`,
        idNumber: `${200000000 + i}`,
        yeshiva: i % 3 === 0 ? 'מיר' : i % 3 === 1 ? 'פוניבז' : 'חברון',
        locality: i % 4 === 0 ? 'ירושלים' : i % 4 === 1 ? 'בני ברק' : i % 4 === 2 ? 'ביתר עילית' : 'עלעד',
        numberOfWins: Math.floor(Math.random() * 10) + 1,
        scholarshipFund: Math.floor(Math.random() * 5000) + 1000,
        parashaAnswersCode: ['A', 'B', 'C', 'D'][Math.floor(Math.random() * 4)],
        yiunHalacha: Math.random() > 0.5,
        yiunHalachaAnswersCode: ['H1', 'H2', 'H3'][Math.floor(Math.random() * 3)],
        answersText: `הערות למנוי ${i + 1}`
      });
    }

    return {
      data: mockSubscribers,
      totalCount,
      hasMore: page * pageSize < totalCount,
      page
    };
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
    return [
      { value: 'A', label: 'תשובה נכונה' },
      { value: 'B', label: 'תשובה שגויה' },
      { value: 'C', label: 'לא השיב' },
      { value: 'D', label: 'פסול' }
    ];
  }

  async getYiunHalachaAnswers() {
    return [
      { value: 'H1', label: 'תשובה נכונה' },
      { value: 'H2', label: 'תשובה שגויה' },
      { value: 'H3', label: 'לא השיב' }
    ];
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