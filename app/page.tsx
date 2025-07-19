'use client'

import { useState } from 'react'
import Papa from 'papaparse'
import toast, { Toaster } from 'react-hot-toast'

interface VideoData {
  url: string
  title: string
  artist?: string
}

interface DownloadStatus {
  index: number
  title: string
  status: 'pending' | 'downloading' | 'completed' | 'error'
  downloadUrl?: string
  error?: string
}

export default function Home() {
  const [csvData, setCsvData] = useState<VideoData[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [downloadStatuses, setDownloadStatuses] = useState<DownloadStatus[]>([])
  const [folderName, setFolderName] = useState('')

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // フォルダ名をCSVファイル名から設定
    const name = file.name.replace(/\.csv$/i, '')
    setFolderName(name)

    Papa.parse(file, {
      header: true,
      complete: (results) => {
        const data = results.data as VideoData[]
        const validData = data.filter(row => row.url && row.title)
        setCsvData(validData)
        
        // ダウンロードステータスを初期化
        const statuses = validData.map((video, index) => ({
          index: index + 1,
          title: video.title,
          status: 'pending' as const,
        }))
        setDownloadStatuses(statuses)
        
        toast.success(`${validData.length}件の動画を読み込みました`)
      },
      error: (error) => {
        toast.error('CSVファイルの読み込みに失敗しました')
        console.error(error)
      }
    })
  }

  const processVideos = async () => {
    setIsProcessing(true)
    
    for (let i = 0; i < csvData.length; i++) {
      const video = csvData[i]
      
      // ステータスを更新
      setDownloadStatuses(prev => prev.map((status, idx) => 
        idx === i ? { ...status, status: 'downloading' } : status
      ))
      
      try {
        const response = await fetch('/api/convert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            url: video.url,
            title: video.title,
            artist: video.artist,
            trackNumber: i + 1,
            folderName
          })
        })
        
        if (!response.ok) {
          throw new Error('変換に失敗しました')
        }
        
        const data = await response.json()
        
        setDownloadStatuses(prev => prev.map((status, idx) => 
          idx === i ? { 
            ...status, 
            status: 'completed',
            downloadUrl: data.downloadUrl 
          } : status
        ))
        
      } catch (error) {
        setDownloadStatuses(prev => prev.map((status, idx) => 
          idx === i ? { 
            ...status, 
            status: 'error',
            error: error instanceof Error ? error.message : '不明なエラー'
          } : status
        ))
      }
      
      // レート制限を避けるため少し待機
      await new Promise(resolve => setTimeout(resolve, 1000))
    }
    
    setIsProcessing(false)
    toast.success('処理が完了しました')
  }

  const downloadAll = () => {
    const completedDownloads = downloadStatuses.filter(s => s.status === 'completed' && s.downloadUrl)
    
    completedDownloads.forEach((download, index) => {
      setTimeout(() => {
        const a = document.createElement('a')
        a.href = download.downloadUrl!
        a.download = `${String(download.index).padStart(3, '0')}_${download.title}.mp3`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
      }, index * 500) // 連続ダウンロードの間隔
    })
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <Toaster position="top-right" />
      
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          YouTube to MP3 Downloader
        </h1>
        
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="mb-6">
            <label htmlFor="csv-upload" className="block text-sm font-medium text-gray-700 mb-2">
              CSVファイルをアップロード
            </label>
            <input
              id="csv-upload"
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
          </div>
          
          {csvData.length > 0 && (
            <>
              <p className="text-sm text-gray-600 mb-4">
                {csvData.length}件の動画が見つかりました
              </p>
              
              <button
                onClick={processVideos}
                disabled={isProcessing}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isProcessing ? '処理中...' : '変換開始'}
              </button>
            </>
          )}
        </div>
        
        {downloadStatuses.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">処理状況</h2>
              {downloadStatuses.some(s => s.status === 'completed') && (
                <button
                  onClick={downloadAll}
                  className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 text-sm"
                >
                  完了分を一括ダウンロード
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              {downloadStatuses.map((status) => (
                <div key={status.index} className="flex items-center justify-between p-3 border rounded-md">
                  <span className="text-sm">
                    {String(status.index).padStart(3, '0')}_{status.title}
                  </span>
                  
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    status.status === 'pending' ? 'bg-gray-100 text-gray-600' :
                    status.status === 'downloading' ? 'bg-blue-100 text-blue-600' :
                    status.status === 'completed' ? 'bg-green-100 text-green-600' :
                    'bg-red-100 text-red-600'
                  }`}>
                    {status.status === 'pending' ? '待機中' :
                     status.status === 'downloading' ? 'ダウンロード中' :
                     status.status === 'completed' ? '完了' :
                     'エラー'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}