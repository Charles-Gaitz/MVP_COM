# Supabase Database Setup Guide

## 🚀 Quick Setup Steps

### 1. Access Supabase SQL Editor
- Go to your Supabase dashboard: https://supabase.com/dashboard
- Select your project: `fggrkxjvxlruryyookeh`
- Click on "SQL Editor" in the sidebar

### 2. Create Database Schema
- Copy the contents of `database/schema.sql`
- Paste into the SQL Editor
- Click "Run" to create all tables and relationships

### 3. Add Demo Data
- Copy the contents of `database/demo_data.sql`  
- Paste into the SQL Editor
- Click "Run" to populate with 25 Texas communities

### 4. Install Supabase in Your Project
```bash
npm install @supabase/supabase-js
```

### 5. Create Supabase Client
Create `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

## 📊 Database Structure

### Main Tables Created:
- **communities** - 25 Texas communities with full data
- **amenities** - Shopping, dining, recreation near communities  
- **neighborhoods** - Sub-areas within communities
- **reviews** - User reviews and ratings
- **market_trends** - Housing price history
- **transportation** - Highways, transit, airports
- **events** - Community events and festivals
- **user_favorites** - User saved communities
- **lead_captures** - Email signups and contacts

## 🎯 Sample Data Included:

### **Austin Area (4 communities):**
- West Lake Hills (luxury lakefront)
- Cedar Park (family suburb)  
- Round Rock (business hub)
- Georgetown (historic charm)

### **Dallas Area (6 communities):**
- Plano (top schools, corporate)
- Frisco (sports facilities)
- Allen (family events)
- Southlake (luxury)
- Colleyville (upscale)
- And more...

### **Houston Area (4 communities):**
- The Woodlands (master-planned)
- Katy (famous schools)
- Sugar Land (safe, affluent)
- And more...

### **Growing Communities:**
- Leander, Pflugerville, Prosper, McKinney
- Perfect for showcasing growth trends

## 🔧 Usage Examples:

### Fetch All Communities:
```typescript
const { data: communities } = await supabase
  .from('communities')
  .select('*')
  .eq('active', true)
```

### Search by Price Range:
```typescript
const { data: communities } = await supabase
  .from('communities')
  .select('*')
  .gte('average_home_price', 300000)
  .lte('average_home_price', 500000)
```

### Get Community with Amenities:
```typescript
const { data: community } = await supabase
  .from('communities')
  .select(`
    *,
    amenities(*),
    neighborhoods(*),
    reviews(*)
  `)
  .eq('slug', 'cedar-park')
  .single()
```

## ✅ Ready to Use!

Your TexasCommunities database now has:
- ✅ Complete schema with relationships
- ✅ 25 realistic Texas communities  
- ✅ Sample amenities, reviews, events
- ✅ Market trends and transportation data
- ✅ Proper indexing for performance
- ✅ Row Level Security enabled

Your website can now display real-looking data while you develop features!
