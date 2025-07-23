import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { LoginRecord } from '@/lib/login-records';

// 登录记录文件路径
const LOGIN_RECORDS_FILE = path.join(process.cwd(), 'login-records.json');

/**
 * 获取所有登录记录
 */
export async function GET() {
  try {
    // 检查文件是否存在
    if (!fs.existsSync(LOGIN_RECORDS_FILE)) {
      return NextResponse.json({ records: [] });
    }
    
    // 读取文件内容
    const fileContent = fs.readFileSync(LOGIN_RECORDS_FILE, 'utf-8');
    const records = JSON.parse(fileContent);
    
    return NextResponse.json({ records });
  } catch (error) {
    console.error('读取登录记录失败:', error);
    return NextResponse.json(
      { error: '读取登录记录失败' },
      { status: 500 }
    );
  }
}

/**
 * 保存登录记录
 */
export async function POST(request: NextRequest) {
  try {
    // 获取请求体
    const { record } = await request.json();
    
    if (!record) {
      return NextResponse.json(
        { error: '缺少登录记录数据' },
        { status: 400 }
      );
    }
    
    // 检查文件是否存在
    let records: LoginRecord[] = [];
    
    if (fs.existsSync(LOGIN_RECORDS_FILE)) {
      // 读取现有记录
      const fileContent = fs.readFileSync(LOGIN_RECORDS_FILE, 'utf-8');
      records = JSON.parse(fileContent);
    }
    
    // 检查是否是第一次登录（根据账号判断）
    const isFirstLogin = !records.some(r => r.account === record.account);
    record.isFirstLogin = isFirstLogin;
    
    // 添加新记录
    records.push(record);
    
    // 保存到文件
    fs.writeFileSync(LOGIN_RECORDS_FILE, JSON.stringify(records, null, 2));
    
    return NextResponse.json({ success: true, isFirstLogin });
  } catch (error) {
    console.error('保存登录记录失败:', error);
    return NextResponse.json(
      { error: '保存登录记录失败' },
      { status: 500 }
    );
  }
}