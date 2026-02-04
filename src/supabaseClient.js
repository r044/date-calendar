import { createClient } from '@supabase/supabase-js'

// ⚠️ ЗАМЕНИТЕ ЭТИ КЛЮЧИ НА СВОИ ⚠️
const supabaseUrl = 'https://afzvwhwiopxvvpizbgrj.supabase.co'
const supabaseAnonKey = 'sb_publishable_4iBOHKmXUYo5dbI29o8uuw_UL8K0bjP'

// Создаем клиент Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})