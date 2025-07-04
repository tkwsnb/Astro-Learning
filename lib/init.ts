import { startNotificationScheduler } from './scheduler'

let initialized = false

export function initializeApp() {
  if (initialized) return
  
  // スケジューラーを開始
  if (typeof window === 'undefined') {
    // サーバーサイドでのみ実行
    startNotificationScheduler()
  }
  
  initialized = true
  console.log('Application initialized')
}