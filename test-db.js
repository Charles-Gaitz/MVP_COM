// Test database connection
import { testConnection } from './src/lib/supabase.js'

async function test() {
  console.log('Testing database connection...')
  const result = await testConnection()
  console.log('Connection result:', result)
}

test().catch(console.error)
