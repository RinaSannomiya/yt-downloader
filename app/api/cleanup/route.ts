import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

// 24時間以上経過した一時ファイルを削除
const CLEANUP_AGE_MS = 24 * 60 * 60 * 1000

export async function POST(request: NextRequest) {
  try {
    const tempDir = path.join(process.cwd(), 'temp')
    
    // tempディレクトリが存在しない場合はスキップ
    try {
      await fs.access(tempDir)
    } catch {
      return NextResponse.json({ cleaned: 0 })
    }
    
    const sessions = await fs.readdir(tempDir)
    let cleanedCount = 0
    
    for (const sessionId of sessions) {
      const sessionPath = path.join(tempDir, sessionId)
      const stat = await fs.stat(sessionPath)
      
      // 24時間以上経過している場合は削除
      if (Date.now() - stat.mtime.getTime() > CLEANUP_AGE_MS) {
        await fs.rm(sessionPath, { recursive: true, force: true })
        cleanedCount++
      }
    }
    
    return NextResponse.json({ 
      success: true,
      cleaned: cleanedCount 
    })
  } catch (error) {
    console.error('Cleanup error:', error)
    return NextResponse.json(
      { error: 'クリーンアップに失敗しました' },
      { status: 500 }
    )
  }
}