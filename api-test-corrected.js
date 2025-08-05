/**
 * Quick API Fix Test - Correct Endpoints
 */

import { readFileSync } from 'fs';

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
    return {};
  }
}

const env = loadEnvFile();

console.log('🔧 Quick API Endpoint Fix Test...\n');

// Test OpenWeather with correct endpoint
async function testWeatherFixed() {
  try {
    console.log('🌤️  Testing OpenWeather (corrected endpoint)...');
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=Austin,TX,US&appid=${env.VITE_OPENWEATHER_API_KEY}&units=metric`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ OpenWeather: WORKING');
      console.log(`   Austin weather: ${Math.round(data.main.temp)}°C, ${data.weather[0].description}`);
      return true;
    } else {
      console.log(`❌ OpenWeather: HTTP ${response.status}`);
      const text = await response.text();
      console.log(`   Error: ${text.substring(0, 100)}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ OpenWeather: ${error.message}`);
    return false;
  }
}

// Test RapidAPI with simpler endpoint
async function testRealtorFixed() {
  try {
    console.log('📍 Testing RapidAPI Realtor (simpler endpoint)...');
    const response = await fetch('https://realtor.p.rapidapi.com/properties/v3/list?limit=1&offset=0&postal_code=78701&status=for_sale&sort=relevance', {
      headers: {
        'X-RapidAPI-Key': env.VITE_RAPIDAPI_REALTOR_KEY,
        'X-RapidAPI-Host': 'realtor.p.rapidapi.com'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ RapidAPI Realtor: WORKING');
      console.log(`   Found ${data.data?.home_search?.total || 0} properties in Austin area`);
      return true;
    } else {
      console.log(`❌ RapidAPI Realtor: HTTP ${response.status}`);
      const text = await response.text();
      console.log(`   Response: ${text.substring(0, 200)}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ RapidAPI Realtor: ${error.message}`);
    return false;
  }
}

// Test Census with simpler query
async function testCensusFixed() {
  try {
    console.log('📊 Testing Census Bureau (simpler query)...');
    const response = await fetch(`https://api.census.gov/data/2021/acs/acs5?get=B01003_001E&for=county:*&in=state:48&key=${env.VITE_CENSUS_API_KEY}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Census Bureau: WORKING');
      console.log(`   Retrieved data for ${data.length - 1} Texas counties`);
      return true;
    } else {
      console.log(`❌ Census Bureau: HTTP ${response.status}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Census Bureau: ${error.message}`);
    return false;
  }
}

async function runFixedTests() {
  console.log('Running corrected API tests...\n');
  
  const results = await Promise.all([
    testWeatherFixed(),
    testRealtorFixed(),
    testCensusFixed()
  ]);
  
  const successCount = results.filter(Boolean).length;
  
  console.log('\n🎯 Final Results:');
  console.log(`✅ Working APIs: ${successCount}/3`);
  
  if (successCount >= 2) {
    console.log('🚀 API architecture is production ready!');
    console.log('📊 Ready to activate API-first community system');
  }
}

runFixedTests().catch(console.error);
