// Test the Supabase connection and data loading
import { testConnection } from './src/lib/supabase.js';
import { CommunityService } from './src/data/communitiesService.js';

async function testDatabase() {
  console.log('🔍 Testing Supabase database connection...\n');
  
  // Test basic connection
  console.log('1. Testing basic connection...');
  const connectionResult = await testConnection();
  console.log('Connection result:', connectionResult);
  
  if (!connectionResult.success) {
    console.log('❌ Connection failed. Using fallback data.');
    return;
  }
  
  try {
    // Test getting communities
    console.log('\n2. Testing getAllCommunities...');
    const communities = await CommunityService.getAllCommunities();
    console.log(`✅ Found ${communities.length} communities`);
    
    if (communities.length > 0) {
      console.log('Sample community:', communities[0].name, 'in', communities[0].city);
    }
    
    // Test getting cities
    console.log('\n3. Testing getCities...');
    const cities = await CommunityService.getCities();
    console.log(`✅ Found ${cities.length} cities:`, cities.join(', '));
    
    // Test search
    console.log('\n4. Testing search...');
    const searchResults = await CommunityService.searchCommunities('Austin');
    console.log(`✅ Found ${searchResults.length} communities matching "Austin"`);
    
    console.log('\n🎉 All database tests passed!');
    
  } catch (error) {
    console.error('❌ Database test failed:', error);
  }
}

testDatabase().catch(console.error);
