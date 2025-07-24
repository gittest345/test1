/**
 * GitHub Gist 数据存储服务
 * 使用 GitHub Gist 作为数据库存储登录记录
 */

import { LoginRecord } from './login-records';

// GitHub API 配置
// 从环境变量读取 GitHub Token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GIST_FILENAME = 'login-records.json';
const GIST_DESCRIPTION = '登录记录数据存储';

// 固定的共享 Gist ID - 所有设备都使用这个 Gist
// 硬编码的 Gist ID，确保所有设备访问同一个数据源
// 这个ID已通过脚本创建并硬编码，实现设备间数据互通
const SHARED_GIST_ID: string | null = "e02dfac041bad4a709a8247b2a787d50";

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
    return JSON.parse(file.content);
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
      console.log('✅ 登录记录已保存到 Gist');
    } else {
      // 如果没有 Gist ID，创建新的 Gist
      const newGistId = await createGist(updatedRecords);
      console.log('✅ 新 Gist 已创建，登录记录已保存');
    }
  } catch (error) {
    console.error('❌ 保存登录记录到 Gist 失败:', error);
    throw error;
  }
}

/**
 * 从 Gist 获取登录记录
 */
export async function getLoginRecordsFromGist(): Promise<LoginRecord[]> {
  try {
    const gistId = getGistId();
    if (!gistId) {
      console.log('📝 没有找到 Gist ID，返回空记录');
      return [];
    }

    console.log('📖 从 Gist 读取登录记录...');
    const records = await readGist(gistId);
    console.log('✅ 成功从 Gist 读取到', records.length, '条记录');
    return records;
  } catch (error) {
    console.error('❌ 从 Gist 获取登录记录失败:', error);
    return [];
  }
}

/**
 * 清空 Gist 中的所有登录记录
 */
export async function clearLoginRecordsFromGist(): Promise<void> {
  try {
    const gistId = getGistId();
    if (!gistId) {
      console.log('📝 没有找到 Gist ID，无需清空');
      return;
    }

    console.log('🗑️ 清空 Gist 中的所有登录记录...');
    await updateGist(gistId, []);
    console.log('✅ Gist 中的登录记录已清空');
  } catch (error) {
    console.error('❌ 清空 Gist 登录记录失败:', error);
    throw error;
  }
}

/**
 * 生成测试数据到 Gist
 */
export async function generateTestRecordsToGist(): Promise<void> {
  try {
    console.log('🧪 生成测试数据到 Gist...');
    
    const testRecords: LoginRecord[] = [
      {
        id: '1',
        account: 'test_user_001',
        timestamp: new Date(Date.now() - 86400000).toISOString(), // 1天前
        deviceInfo: {
          userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          platform: 'Win32',
          language: 'zh-CN',
          screenResolution: '1920x1080',
          timezone: 'Asia/Shanghai'
        },
        ipAddress: '192.168.1.100',
        location: '北京市',
        isFirstLogin: true
      },
      {
        id: '2',
        account: 'test_user_002',
        timestamp: new Date(Date.now() - 43200000).toISOString(), // 12小时前
        deviceInfo: {
          userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
          platform: 'iPhone',
          language: 'zh-CN',
          screenResolution: '375x812',
          timezone: 'Asia/Shanghai'
        },
        ipAddress: '192.168.1.101',
        location: '上海市',
        isFirstLogin: false
      },
      {
        id: '3',
        account: 'test_user_003',
        timestamp: new Date().toISOString(), // 现在
        deviceInfo: {
          userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
          platform: 'MacIntel',
          language: 'zh-CN',
          screenResolution: '2560x1440',
          timezone: 'Asia/Shanghai'
        },
        ipAddress: '192.168.1.102',
        location: '广州市',
        isFirstLogin: true
      }
    ];

    const gistId = getGistId();
    if (gistId) {
      await updateGist(gistId, testRecords);
      console.log('✅ 测试数据已生成到 Gist');
    } else {
      const newGistId = await createGist(testRecords);
      console.log('✅ 新 Gist 已创建，测试数据已生成');
    }
  } catch (error) {
    console.error('❌ 生成测试数据到 Gist 失败:', error);
    throw error;
  }
}

/**
 * 检查 Gist 连接状态
 */
export async function checkGistConnection(): Promise<boolean> {
  try {
    const gistId = getGistId();
    if (!gistId) {
      console.log('📝 没有找到 Gist ID');
      return false;
    }

    console.log('🔍 检查 Gist 连接状态...');
    await readGist(gistId);
    console.log('✅ Gist 连接正常');
    return true;
  } catch (error) {
    console.error('❌ Gist 连接失败:', error);
    return false;
  }
}