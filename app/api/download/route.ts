import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session')
  const fileName = searchParams.get('file')
  
  if (!sessionId || !fileName) {
    return NextResponse.json(
      { error: 'セッションIDとファイル名が必要です' },
      { status: 400 }
    )
  }
  
  try {
    // ファイルパスを構築
    const filePath = path.join(process.cwd(), 'temp', sessionId, fileName)
    
    // ファイルの存在確認
    await fs.access(filePath)
    
    // ファイルを読み込む
    const fileContent = await fs.readFile(filePath)
    
    // 一時ファイルを削除（オプション：ダウンロード後にクリーンアップ）
    // await fs.unlink(filePath)
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': fileContent.length.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'ファイルが見つかりません' },
      { status: 404 }
    )
  }
}