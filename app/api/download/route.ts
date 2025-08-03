import { NextRequest, NextResponse } from 'next/server'
import path from 'path'
import fs from 'fs/promises'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const sessionId = searchParams.get('session')
  const fileName = searchParams.get('file')
  
  console.log('Download request:', { sessionId, fileName })
  
  if (!sessionId || !fileName) {
    return NextResponse.json(
      { error: 'セッションIDとファイル名が必要です' },
      { status: 400 }
    )
  }
  
  try {
    // ファイルパスを構築
    const filePath = path.join(process.cwd(), 'temp', sessionId, fileName)
    console.log('File path:', filePath)
    
    // ファイルの存在確認
    await fs.access(filePath)
    console.log('File exists')
    
    // ファイルを読み込む
    const fileContent = await fs.readFile(filePath)
    console.log('File size:', fileContent.length)
    
    // 一時ファイルを削除（オプション：ダウンロード後にクリーンアップ）
    // await fs.unlink(filePath)
    
    // ファイル名をエンコード（日本語対応）
    const encodedFileName = encodeURIComponent(fileName)
    const asciiFileName = fileName.replace(/[^\x00-\x7F]/g, '_')  // 非ASCII文字を_に置換
    
    return new NextResponse(fileContent, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Content-Disposition': `attachment; filename="${asciiFileName}"; filename*=UTF-8''${encodedFileName}`,
        'Content-Length': fileContent.length.toString(),
      },
    })
  } catch (error) {
    console.error('Download error:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      path: path.join(process.cwd(), 'temp', sessionId, fileName)
    })
    return NextResponse.json(
      { error: 'ファイルが見つかりません' },
      { status: 404 }
    )
  }
}