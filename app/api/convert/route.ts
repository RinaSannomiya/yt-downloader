import { NextRequest, NextResponse } from 'next/server'
import { spawn } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import { v4 as uuidv4 } from 'uuid'

// 注意: これは例示的な実装です
// 実際のプロダクションでは、YouTube動画のダウンロードには
// 適切なライセンスと権利確認が必要です

export async function POST(request: NextRequest) {
  try {
    const { url, title, artist, trackNumber, folderName } = await request.json()
    
    // バリデーション
    if (!url || !title) {
      return NextResponse.json(
        { error: 'URLとタイトルは必須です' },
        { status: 400 }
      )
    }
    
    // 一時ディレクトリとファイル名を生成
    const tempDir = path.join(process.cwd(), 'temp')
    await fs.mkdir(tempDir, { recursive: true })
    
    const sessionId = uuidv4()
    const fileName = `${String(trackNumber).padStart(3, '0')}_${title.replace(/[<>:"/\\|?*]/g, '_')}.mp3`
    const outputPath = path.join(tempDir, sessionId, fileName)
    
    // セッション用のディレクトリを作成
    await fs.mkdir(path.join(tempDir, sessionId), { recursive: true })
    
    // Pythonスクリプトを実行
    const pythonScriptPath = path.join(process.cwd(), 'python-scripts', 'download_single.py')
    
    console.log('Executing Python script:', pythonScriptPath)
    console.log('Output path:', outputPath)
    console.log('URL:', url)
    
    return new Promise((resolve) => {
      const pythonProcess = spawn('python3', [
        pythonScriptPath,
        url,
        outputPath,
        String(trackNumber),
        title,
        artist || '',
        folderName || ''
      ])
      
      let stdout = ''
      let stderr = ''
      
      pythonProcess.stdout.on('data', (data) => {
        stdout += data.toString()
        console.log('Python stdout:', data.toString())
      })
      
      pythonProcess.stderr.on('data', (data) => {
        stderr += data.toString()
        console.error('Python stderr:', data.toString())
      })
      
      pythonProcess.on('close', async (code) => {
        if (code === 0) {
          // 成功した場合
          const downloadUrl = `/api/download?session=${sessionId}&file=${encodeURIComponent(fileName)}`
          
          resolve(NextResponse.json({
            success: true,
            fileName,
            downloadUrl,
            sessionId,
            message: '変換が完了しました'
          }))
        } else {
          // エラーの場合
          console.error('Python script error:', stderr)
          resolve(NextResponse.json(
            { error: '変換中にエラーが発生しました', details: stderr },
            { status: 500 }
          ))
        }
      })
      
      pythonProcess.on('error', (error) => {
        console.error('Process error:', error)
        resolve(NextResponse.json(
          { error: 'プロセスの起動に失敗しました' },
          { status: 500 }
        ))
      })
    })
    
  } catch (error) {
    console.error('変換エラー:', error)
    return NextResponse.json(
      { error: '変換中にエラーが発生しました' },
      { status: 500 }
    )
  }
}