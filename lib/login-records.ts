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
 * 保存登录记录到本地存储（GitHub Pages静态版本）
 * @param record 登录记录对象
 */
export async function saveLoginRecord(record: LoginRecord): Promise<void> {
  try {
    // 从localStorage获取现有记录
    const existingRecords = localStorage.getItem('login_records');
    let records: LoginRecord[] = [];
    
    if (existingRecords) {
      try {
        records = JSON.parse(existingRecords);
      } catch (error) {
        console.error('解析登录记录失败:', error);
      }
    }
    
    // 检查是否是第一次登录（根据账号判断）
    const isFirstLogin = !records.some(r => r.account === record.account);
    record.isFirstLogin = isFirstLogin;
    
    // 添加新记录
    records.push(record);
    
    // 保存到localStorage
    localStorage.setItem('login_records', JSON.stringify(records));
  } catch (error) {
    console.error('保存登录记录失败:', error);
    throw error; // 重新抛出错误，让调用者处理
  }
}

/**
 * 从本地存储读取登录记录（GitHub Pages静态版本）
 * @returns 登录记录数组
 */
export async function getLoginRecords(): Promise<LoginRecord[]> {
  try {
    // 从localStorage获取记录
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
  } catch (error) {
    console.error('读取登录记录失败:', error);
    return [];
  }
}