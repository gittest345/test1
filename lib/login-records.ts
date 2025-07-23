/**
 * 登录记录工具函数
 * 提供保存和读取登录记录的功能
 */

// 定义登录记录的接口
export interface LoginRecord {
  id: number;
  timestamp: string;
  ip: string;
  account: string;
  password: string;
  isFirstLogin: boolean;
}

/**
 * 保存登录记录到本地文件（通过API）
 * @param record 登录记录对象
 */
export async function saveLoginRecord(record: LoginRecord): Promise<void> {
  try {
    // 调用API保存记录
    const response = await fetch('/api/login-records', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ record }),
    });
    
    if (!response.ok) {
      throw new Error(`保存失败: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 更新isFirstLogin属性
    record.isFirstLogin = data.isFirstLogin;
    
    // 同时保存到localStorage（为了兼容现有功能）
    const existingRecords = localStorage.getItem('login_records');
    let records: LoginRecord[] = [];
    
    if (existingRecords) {
      try {
        records = JSON.parse(existingRecords);
      } catch (error) {
        console.error('解析登录记录失败:', error);
      }
    }
    
    records.push(record);
    localStorage.setItem('login_records', JSON.stringify(records));
  } catch (error) {
    console.error('保存登录记录失败:', error);
    throw error; // 重新抛出错误，让调用者处理
  }
}

/**
 * 从本地文件读取登录记录（通过API）
 * @returns 登录记录数组
 */
export async function getLoginRecords(): Promise<LoginRecord[]> {
  try {
    // 调用API获取记录
    const response = await fetch('/api/login-records');
    
    if (!response.ok) {
      throw new Error(`获取失败: ${response.status}`);
    }
    
    const data = await response.json();
    return data.records;
  } catch (error) {
    console.error('读取登录记录失败:', error);
    
    // 如果API调用失败，尝试从localStorage获取
    if (typeof window !== 'undefined') {
      const storedRecords = localStorage.getItem('login_records');
      if (storedRecords) {
        try {
          return JSON.parse(storedRecords);
        } catch (e) {
          console.error('解析localStorage登录记录失败:', e);
        }
      }
    }
    
    return [];
  }
}