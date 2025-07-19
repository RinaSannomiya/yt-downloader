import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const fileName = searchParams.get('file')
  
  if (!fileName) {
    return NextResponse.json(
      { error: 'ファイル名が指定されていません' },
      { status: 400 }
    )
  }
  
  // 実際の実装では、一時ストレージからファイルを取得して
  // ストリーミングレスポンスとして返します
  
  // モックレスポンス
  const mockMp3Content = Buffer.from('Mock MP3 content')
  
  return new NextResponse(mockMp3Content, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': mockMp3Content.length.toString(),
    },
  })
}