/**
 * Pure Node.js API Test - No External Dependencies
 */

import { readFileSync } from 'fs';

console.log('🚀 Starting API Architecture Test...\n');

// Load .env file manually
function loadEnvFile() {
  try {
    const envContent = readFileSync('.env', 'utf8');
    const envVars = {};
    
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && !key.startsWith('#') && valueParts.length > 0) {
        envVars[key.trim()] = valueParts.join('=').trim();
      }
    });
    
    return envVars;
  } catch (error) {
    console.log('❌ Could not load .env file');
    return {};
  }
}

const env = loadEnvFile();

// Test 1: Check Environment Variables
console.log('📋 Test 1: Checking API Key Configuration...');
const apiKeys = {
  'Google Maps': env.VITE_GOOGLE_MAPS_API_KEY,
  'RapidAPI Realtor': env.VITE_RAPIDAPI_REALTOR_KEY,
  'OpenWeather': env.VITE_OPENWEATHER_API_KEY,
  'News API': env.VITE_NEWS_API_KEY,
  'Census Bureau': env.VITE_CENSUS_API_KEY,
  'BLS Employment': env.VITE_BLS_API_KEY
};

let configuredCount = 0;
Object.entries(apiKeys).forEach(([name, key]) => {
  if (key && key !== 'your_api_key_here' && key !== 'PAID' && key.length > 10) {
    console.log(`✅ ${name}: CONFIGURED`);
    configuredCount++;
  } else {
    console.log(`❌ ${name}: MISSING`);
  }
});

console.log(`\n📊 Configuration Summary: ${configuredCount}/6 APIs configured\n`);

// Test 2: API Connectivity Tests
console.log('🌐 Test 2: Testing API Connectivity...');

// Test RapidAPI Realtor
async function testRealtor() {
  try {
    console.log('📍 Testing RapidAPI Realtor (1 API call)...');
    const response = await fetch('https://realtor.p.rapidapi.com/locations/v2/auto-complete?input=Austin,TX', {
      headers: {
        'X-RapidAPI-Key': env.VITE_RAPIDAPI_REALTOR_KEY,
        'X-RapidAPI-Host': 'realtor.p.rapidapi.com'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ RapidAPI Realtor: WORKING');
      console.log(`   Found ${data.autocomplete?.length || 0} location suggestions for Austin`);
      return true;
    } else {
      console.log(`❌ RapidAPI Realtor: HTTP ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ RapidAPI Realtor: ${error.message}`);
    return false;
  }
}

// Test OpenWeather
async function testWeather() {
  try {
    console.log('🌤️  Testing OpenWeather (1 API call)...');
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Austin,TX&appid=${env.VITE_OPENWEATHER_API_KEY}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ OpenWeather: WORKING');
      console.log(`   Current temp in Austin: ${Math.round(data.main.temp - 273.15)}°C (${Math.round((data.main.temp - 273.15) * 9/5 + 32)}°F)`);
      return true;
    } else {
      console.log(`❌ OpenWeather: HTTP ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ OpenWeather: ${error.message}`);
    return false;
  }
}

// Test Census API
async function testCensus() {
  try {
    console.log('📊 Testing Census Bureau (1 API call)...');
    const response = await fetch(`https://api.census.gov/data/2021/acs/acs5?get=B01003_001E,NAME&for=place:05000&in=state:48&key=${env.VITE_CENSUS_API_KEY}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Census Bureau: WORKING');
      console.log(`   Retrieved population data for ${data.length - 1} Texas cities`);
      return true;
    } else {
      console.log(`❌ Census Bureau: HTTP ${response.status} - ${response.statusText}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Census Bureau: ${error.message}`);
    return false;
  }
}

// Run all tests with progress tracking
async function runAllTests() {
  const startTime = Date.now();
  let successCount = 0;
  
  console.log('⏱️  Starting connectivity tests...\n');
  
  const results = await Promise.all([
    testRealtor(),
    testWeather(), 
    testCensus()
  ]);
  
  successCount = results.filter(Boolean).length;
  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  
  console.log('\n🎯 Test Summary:');
  console.log(`⏱️  Total time: ${duration} seconds`);
  console.log(`✅ APIs working: ${successCount}/3`);
  console.log(`📊 Total API calls used: 3 (minimal impact on quotas)`);
  
  if (successCount === 3) {
    console.log('🚀 API architecture ready for production deployment!');
    console.log('🏘️  Ready to scale to unlimited Texas communities');
  } else {
    console.log('⚠️  Some APIs need attention before full deployment');
  }
}

runAllTests().catch(console.error);
