console.log('🔍 Testing API Configuration for Vite Environment...\n');

// Read the .env file directly since VITE_ vars aren't in process.env during build
const fs = require('fs');
const envFile = fs.readFileSync('.env', 'utf8');

const checkKey = (keyName) => {
  const regex = new RegExp(`${keyName}=(.+)`);
  const match = envFile.match(regex);
  if (!match || !match[1]) return false;
  const value = match[1].trim();
  // Check if it's not a placeholder value
  return value && 
         value !== 'your_' + keyName.toLowerCase().replace('vite_', '') + '_here' &&
         value !== 'PAID' &&
         value !== 'DEMO_KEY' &&
         value.length > 10;
};

console.log('🔑 Core API Keys Status:');
console.log('─────────────────────────────────────');
console.log('RapidAPI Realtor:  ', checkKey('VITE_RAPIDAPI_REALTOR_KEY') ? '✅ CONFIGURED' : '❌ MISSING');
console.log('Google Maps:       ', checkKey('VITE_GOOGLE_MAPS_API_KEY') ? '✅ CONFIGURED' : '❌ MISSING');
console.log('Census Bureau:     ', checkKey('VITE_CENSUS_API_KEY') ? '✅ CONFIGURED' : '❌ MISSING');
console.log('BLS Employment:    ', checkKey('VITE_BLS_API_KEY') ? '✅ CONFIGURED' : '❌ MISSING');
console.log('OpenWeather:       ', checkKey('VITE_OPENWEATHER_API_KEY') ? '✅ CONFIGURED' : '❌ MISSING');
console.log('News API:          ', checkKey('VITE_NEWS_API_KEY') ? '✅ CONFIGURED' : '❌ MISSING');

console.log('\n🌟 Additional APIs:');
console.log('─────────────────────────────────────');
console.log('EPA Air Quality:   ', checkKey('VITE_EPA_AIR_QUALITY_API_KEY') ? '✅ CONFIGURED' : '❌ MISSING');
console.log('FBI Crime Data:    ', checkKey('VITE_FBI_CRIME_API_KEY') ? '✅ CONFIGURED' : '❌ MISSING');
console.log('HUD Housing:       ', checkKey('VITE_HUD_API_KEY') ? '✅ CONFIGURED' : '❌ MISSING');
console.log('Supabase:          ', checkKey('VITE_SUPABASE_URL') ? '✅ CONFIGURED' : '❌ MISSING');

// Count configured APIs
const coreAPIs = ['VITE_RAPIDAPI_REALTOR_KEY', 'VITE_GOOGLE_MAPS_API_KEY', 'VITE_CENSUS_API_KEY', 'VITE_BLS_API_KEY', 'VITE_OPENWEATHER_API_KEY', 'VITE_NEWS_API_KEY'];
const configuredCore = coreAPIs.filter(checkKey).length;

console.log('\n📊 Configuration Summary:');
console.log('─────────────────────────────────────');
console.log(`Core APIs: ${configuredCore}/${coreAPIs.length} configured`);

if (configuredCore === coreAPIs.length) {
  console.log('🎉 Status: READY FOR FULL API MIGRATION!');
  console.log('🚀 Your platform can now scale to unlimited communities!');
} else {
  console.log('⚠️  Status: Some core APIs need configuration');
}
