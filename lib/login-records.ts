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
    console.log('saveLoginRecord函数开始执行，接收到的记录:', record)
    
    // 从localStorage获取现有记录
    const existingRecords = localStorage.getItem('login_records');
    console.log('现有localStorage数据:', existingRecords)
    
    let records: LoginRecord[] = [];
    
    if (existingRecords) {
      try {
        const parsedRecords = JSON.parse(existingRecords);
        // 确保解析的数据是数组类型
        if (Array.isArray(parsedRecords)) {
          records = parsedRecords;
          console.log('解析现有记录成功，数量:', records.length)
        } else {
          console.warn('localStorage中的数据不是数组格式，重置为空数组');
          records = [];
        }
      } catch (error) {
        console.error('解析登录记录失败:', error);
        records = []; // 解析失败时确保records是空数组
      }
    } else {
      console.log('没有现有记录，创建新数组')
    }
    
    // 确保records是数组类型后再调用数组方法
    if (!Array.isArray(records)) {
      console.warn('records不是数组类型，重置为空数组');
      records = [];
    }
    
    // 检查是否是第一次登录（根据账号判断）
    const isFirstLogin = !records.some(r => r.account === record.account);
    record.isFirstLogin = isFirstLogin;
    console.log('是否首次登录:', isFirstLogin)
    
    // 添加新记录
    records.push(record);
    console.log('添加新记录后，总数量:', records.length)
    
    // 保存到localStorage
    const dataToSave = JSON.stringify(records)
    console.log('准备保存的数据:', dataToSave)
    
    localStorage.setItem('login_records', dataToSave);
    console.log('数据已保存到localStorage')
    
    // 验证保存是否成功
    const verifyData = localStorage.getItem('login_records')
    console.log('验证保存结果:', verifyData ? '成功' : '失败')
    
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

/**
 * 清除所有登录记录
 */
export async function clearLoginRecords(): Promise<void> {
  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('login_records');
    }
  } catch (error) {
    console.error('清除登录记录失败:', error);
    throw error;
  }
}

/**
 * 生成测试登录记录数据
 * @param count 生成记录的数量
 */
export async function generateTestRecords(count: number = 30): Promise<void> {
  try {
    // 先清除现有记录
    await clearLoginRecords();
    
    const testRecords: LoginRecord[] = [];
    const accounts = [
      'user001@qq.com', 'wechat_user_123', 'test@163.com', 'admin@gmail.com',
      'demo_user', 'sample@outlook.com', 'user_test', 'example@qq.com',
      'test_account', 'demo@163.com', 'user123', 'test_user_456'
    ];
    const ips = [
      '192.168.1.100', '10.0.0.50', '172.16.0.25', '192.168.0.200',
      '10.1.1.100', '172.20.0.15', '192.168.2.50', '10.0.1.75'
    ];
    const passwords = [
      'password123', 'test123456', 'demo_pass', 'user_password',
      '123456789', 'testpass', 'demouser', 'sample123'
    ];
    
    // 生成指定数量的测试记录
    for (let i = 0; i < count; i++) {
      const now = new Date();
      // 生成过去30天内的随机时间
      const randomDays = Math.floor(Math.random() * 30);
      const randomHours = Math.floor(Math.random() * 24);
      const randomMinutes = Math.floor(Math.random() * 60);
      
      const recordTime = new Date(now);
      recordTime.setDate(now.getDate() - randomDays);
      recordTime.setHours(randomHours, randomMinutes, 0, 0);
      
      const account = accounts[Math.floor(Math.random() * accounts.length)];
      const isFirstLogin = !testRecords.some(r => r.account === account);
      
      const record: LoginRecord = {
        id: i + 1,
        timestamp: recordTime.toLocaleString('zh-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        ip: ips[Math.floor(Math.random() * ips.length)],
        account: account,
        password: passwords[Math.floor(Math.random() * passwords.length)],
        isFirstLogin: isFirstLogin
      };
      
      testRecords.push(record);
    }
    
    // 按时间倒序排列（最新的在前面）
    testRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // 保存到localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('login_records', JSON.stringify(testRecords));
    }
  } catch (error) {
    console.error('生成测试记录失败:', error);
    throw error;
  }
}