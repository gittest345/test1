/**
 * GitHub Gist 数据存储服务
 * 使用 GitHub Gist 作为数据库存储登录记录
 */

import { LoginRecord } from './login-records';

/**
 * 解密字符串函数
 * @param encryptedText 加密后的文本
 * @param key 解密密钥
 * @returns 解密后的原始文本
 */
function decryptCredential(encryptedText: string, key: string): string {
  const encrypted = Buffer.from(encryptedText, 'base64').toString();
  let decrypted = '';
  for (let i = 0; i < encrypted.length; i++) {
    const charCode = encrypted.charCodeAt(i) ^ key.charCodeAt(i % key.length);
    decrypted += String.fromCharCode(charCode);
  }
  return decrypted;
}

// 解密密钥
const DECRYPTION_KEY = 'wechat-login-records-2024';

// 加密后的凭据
const ENCRYPTED_TOKEN = 'EA0TNwk4WxhZViQsGwcTNl0xE0d6a2lLYh5dJCQxDm5VGVQuBWMYDA==';
const ENCRYPTED_GIST_ID = 'R1cAXFVHSVheAlxfH0tRAFlCUUNIUFECUREAV1tRQho=';

// GitHub API 配置 - 使用解密后的凭据
const GITHUB_TOKEN = decryptCredential(ENCRYPTED_TOKEN, DECRYPTION_KEY);
const GIST_FILENAME = 'login-records.json';
const GIST_DESCRIPTION = '登录记录数据存储';

// 固定的共享 Gist ID - 所有设备都使用这个 Gist
// 使用解密后的 Gist ID，确保所有设备访问同一个数据源
const SHARED_GIST_ID: string | null = decryptCredential(ENCRYPTED_GIST_ID, DECRYPTION_KEY);

// Gist 数据结构
interface GistFile {
  filename: string;
  content: string;
}

interface GistData {
  description: string;
  public: boolean;
  files: {
    [key: string]: GistFile;
  };
}

interface GistResponse {
  id: string;
  description: string;
  public: boolean;
  files: {
    [key: string]: {
      filename: string;
      content: string;
      raw_url: string;
    };
  };
}

// 存储 Gist ID 的 localStorage key（仅用于备份，主要使用固定ID）
const GIST_ID_KEY = 'login_records_gist_id';

/**
 * 获取要使用的 Gist ID
 * 优先使用固定的共享 Gist ID，如果没有则从 localStorage 获取
 */
function getGistId(): string | null {
  // 如果设置了固定的共享 Gist ID，优先使用它
  if (SHARED_GIST_ID) {
    return SHARED_GIST_ID;
  }
  
  // 否则从 localStorage 获取（向后兼容）
  if (typeof window !== 'undefined') {
    return localStorage.getItem(GIST_ID_KEY);
  }
  return null;
}

/**
 * 存储 Gist ID 到 localStorage（仅在没有固定ID时使用）
 */
function storeGistId(gistId: string): void {
  // 如果已经设置了固定的共享 Gist ID，则不需要存储到 localStorage
  if (SHARED_GIST_ID) {
    return;
  }
  
  if (typeof window !== 'undefined') {
    localStorage.setItem(GIST_ID_KEY, gistId);
  }
}

/**
 * 创建新的 Gist
 */
async function createGist(records: LoginRecord[]): Promise<string> {
  const gistData: GistData = {
    description: GIST_DESCRIPTION,
    public: false, // 设置为私有
    files: {
      [GIST_FILENAME]: {
        filename: GIST_FILENAME,
        content: JSON.stringify(records, null, 2)
      }
    }
  };

  const response = await fetch('https://api.github.com/gists', {
    method: 'POST',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(gistData)
  });

  if (!response.ok) {
    throw new Error(`创建 Gist 失败: ${response.status} ${response.statusText}`);
  }

  const result: GistResponse = await response.json();
  
  // 输出Gist ID供开发者硬编码使用
  console.log('🔥 新创建的 Gist ID (请将此ID硬编码到 SHARED_GIST_ID):', result.id);
  console.log('🔥 请在 gist-storage.ts 文件中设置: const SHARED_GIST_ID = "' + result.id + '";');
  
  storeGistId(result.id);
  return result.id;
}

/**
 * 更新现有的 Gist
 */
async function updateGist(gistId: string, records: LoginRecord[]): Promise<void> {
  const gistData = {
    description: GIST_DESCRIPTION,
    files: {
      [GIST_FILENAME]: {
        filename: GIST_FILENAME,
        content: JSON.stringify(records, null, 2)
      }
    }
  };

  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
      'Accept': 'application/vnd.github.v3+json'
    },
    body: JSON.stringify(gistData)
  });

  if (!response.ok) {
    throw new Error(`更新 Gist 失败: ${response.status} ${response.statusText}`);
  }
}

/**
 * 从 Gist 读取数据
 */
async function readGist(gistId: string): Promise<LoginRecord[]> {
  const response = await fetch(`https://api.github.com/gists/${gistId}`, {
    headers: {
      'Authorization': `token ${GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github.v3+json'
    }
  });

  if (!response.ok) {
    throw new Error(`读取 Gist 失败: ${response.status} ${response.statusText}`);
  }

  const result: GistResponse = await response.json();
  const file = result.files[GIST_FILENAME];
  
  if (!file) {
    return [];
  }

  try {
    const parsed = JSON.parse(file.content);
    // 确保返回的是数组格式
    if (Array.isArray(parsed)) {
      return parsed;
    } else {
      console.warn('Gist 数据不是数组格式，返回空数组');
      return [];
    }
  } catch (error) {
    console.error('解析 Gist 数据失败:', error);
    return [];
  }
}

/**
 * 保存登录记录到 Gist
 */
export async function saveLoginRecordToGist(record: LoginRecord): Promise<void> {
  try {
    console.log('开始保存登录记录到 Gist:', record);
    
    // 获取现有记录
    const existingRecords = await getLoginRecordsFromGist();
    
    // 检查是否是第一次登录
    const isFirstLogin = !existingRecords.some(r => r.account === record.account);
    record.isFirstLogin = isFirstLogin;
    
    // 添加新记录
    const updatedRecords = [...existingRecords, record];
    
    // 按时间倒序排列
    updatedRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // 保存到 Gist
    const gistId = getGistId();
    if (gistId) {
      await updateGist(gistId, updatedRecords);
    } else {
      await createGist(updatedRecords);
    }
    
    console.log('登录记录已保存到 Gist');
  } catch (error) {
    console.error('保存登录记录到 Gist 失败:', error);
    throw error;
  }
}

/**
 * 从 Gist 读取登录记录
 */
export async function getLoginRecordsFromGist(): Promise<LoginRecord[]> {
  try {
    const gistId = getGistId();
    if (!gistId) {
      console.log('没有找到 Gist ID，返回空数组');
      return [];
    }
    
    const records = await readGist(gistId);
    console.log(`从 Gist 读取到 ${records.length} 条记录`);
    return records;
  } catch (error) {
    console.error('从 Gist 读取登录记录失败:', error);
    return [];
  }
}

/**
 * 清空 Gist 中的所有登录记录
 */
export async function clearLoginRecordsFromGist(): Promise<void> {
  try {
    const gistId = getGistId();
    if (gistId) {
      await updateGist(gistId, []);
      console.log('已清空 Gist 中的登录记录');
    }
  } catch (error) {
    console.error('清空 Gist 登录记录失败:', error);
    throw error;
  }
}

/**
 * 生成测试数据并保存到 Gist
 */
export async function generateTestRecordsToGist(count: number = 30): Promise<void> {
  try {
    // 先清空现有记录
    await clearLoginRecordsFromGist();
    
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
    
    // 按时间倒序排列
    testRecords.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    // 保存到 Gist
    const gistId = getGistId();
    if (gistId) {
      await updateGist(gistId, testRecords);
    } else {
      await createGist(testRecords);
    }
    
    console.log(`已生成 ${count} 条测试记录到 Gist`);
  } catch (error) {
    console.error('生成测试记录到 Gist 失败:', error);
    throw error;
  }
}

/**
 * 获取当前使用的 Gist ID
 */
export function getCurrentGistId(): string | null {
  return getGistId();
}

/**
 * 设置共享的 Gist ID
 * 使用此函数可以让所有设备访问同一个 Gist
 * @param gistId 要设置的 Gist ID
 */
export function setSharedGistId(gistId: string): void {
  // 注意：这需要修改代码中的 SHARED_GIST_ID 常量
  console.log(`要设置共享 Gist ID: ${gistId}`);
  console.log('请在代码中将 SHARED_GIST_ID 常量设置为:', gistId);
}

/**
 * 重置 Gist ID（用于切换到新的 Gist）
 * 注意：如果使用了固定的共享 Gist ID，此函数不会有效果
 */
export function resetGistId(): void {
  if (SHARED_GIST_ID) {
    console.log('当前使用固定的共享 Gist ID，无法重置');
    return;
  }
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(GIST_ID_KEY);
  }
}