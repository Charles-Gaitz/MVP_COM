-- TexasCommunities Database Schema
-- Run these commands in your Supabase SQL Editor

-- 1. Communities Table (Main table for Texas communities)
CREATE TABLE communities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL, -- URL-friendly name
  city VARCHAR(50) NOT NULL,
  county VARCHAR(50) NOT NULL,
  state VARCHAR(2) DEFAULT 'TX',
  
  -- Location data
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  zip_codes TEXT[], -- Array of zip codes
  
  -- Demographics
  population INTEGER,
  median_age DECIMAL(4, 1),
  median_household_income INTEGER,
  
  -- Housing data
  average_home_price INTEGER,
  median_home_price INTEGER,
  average_rent INTEGER,
  home_price_trend VARCHAR(20), -- 'rising', 'falling', 'stable'
  
  -- Education
  school_district VARCHAR(100),
  school_rating DECIMAL(3, 1), -- 0.0 to 10.0
  elementary_schools INTEGER,
  middle_schools INTEGER,
  high_schools INTEGER,
  
  -- Quality of life
  crime_rate DECIMAL(5, 2), -- Per 100,000 residents
  walkability_score INTEGER, -- 0-100
  transit_score INTEGER, -- 0-100
  bike_score INTEGER, -- 0-100
  
  -- Weather/Climate
  average_temp_summer INTEGER, -- Fahrenheit
  average_temp_winter INTEGER,
  annual_rainfall DECIMAL(5, 2), -- Inches
  
  -- Economy
  unemployment_rate DECIMAL(4, 2),
  job_growth_rate DECIMAL(4, 2),
  major_employers TEXT[],
  
  -- Lifestyle
  cost_of_living_index INTEGER, -- 100 = national average
  diversity_index DECIMAL(4, 2), -- 0-100
  
  -- Media
  description TEXT,
  short_description VARCHAR(500),
  image_url TEXT,
  gallery_images TEXT[],
  video_tour_url TEXT,
  
  -- SEO
  meta_title VARCHAR(200),
  meta_description VARCHAR(300),
  
  -- System fields
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Amenities Table
CREATE TABLE amenities (
  id SERIAL PRIMARY KEY,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  category VARCHAR(50) NOT NULL, -- 'shopping', 'dining', 'recreation', 'healthcare', 'education'
  name VARCHAR(200) NOT NULL,
  type VARCHAR(100), -- 'mall', 'restaurant', 'park', 'hospital', etc.
  address TEXT,
  distance_miles DECIMAL(4, 2),
  rating DECIMAL(3, 1), -- Google/Yelp rating
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Neighborhoods Table (Sub-communities within larger areas)
CREATE TABLE neighborhoods (
  id SERIAL PRIMARY KEY,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  average_home_price INTEGER,
  home_price_range_min INTEGER,
  home_price_range_max INTEGER,
  characteristics TEXT[], -- ['family-friendly', 'luxury', 'historic', etc.]
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Reviews Table (User-generated content)
CREATE TABLE reviews (
  id SERIAL PRIMARY KEY,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  user_name VARCHAR(100),
  user_email VARCHAR(255),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  content TEXT,
  pros TEXT[],
  cons TEXT[],
  years_lived INTEGER,
  family_type VARCHAR(50), -- 'single', 'couple', 'family', 'retiree'
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Market Trends Table (Price history)
CREATE TABLE market_trends (
  id SERIAL PRIMARY KEY,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  average_price INTEGER,
  median_price INTEGER,
  homes_sold INTEGER,
  days_on_market INTEGER,
  price_per_sqft DECIMAL(8, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Transportation Table
CREATE TABLE transportation (
  id SERIAL PRIMARY KEY,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  type VARCHAR(50), -- 'highway', 'public_transit', 'airport', 'train'
  name VARCHAR(200),
  distance_miles DECIMAL(4, 2),
  travel_time_minutes INTEGER,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Events Table (Community events)
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  event_date TIMESTAMP WITH TIME ZONE,
  location VARCHAR(200),
  category VARCHAR(50), -- 'festival', 'market', 'sports', 'cultural'
  image_url TEXT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. User Favorites Table
CREATE TABLE user_favorites (
  id SERIAL PRIMARY KEY,
  user_email VARCHAR(255) NOT NULL,
  community_id INTEGER REFERENCES communities(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_email, community_id)
);

-- 9. Lead Captures Table (Email signups)
CREATE TABLE lead_captures (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  community_interest INTEGER REFERENCES communities(id),
  source VARCHAR(100), -- 'comparison_tool', 'newsletter', 'contact_form'
  message TEXT,
  subscribed_newsletter BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_communities_city ON communities(city);
CREATE INDEX idx_communities_county ON communities(county);
CREATE INDEX idx_communities_featured ON communities(featured) WHERE featured = TRUE;
CREATE INDEX idx_communities_active ON communities(active) WHERE active = TRUE;
CREATE INDEX idx_communities_price_range ON communities(average_home_price);
CREATE INDEX idx_communities_school_rating ON communities(school_rating);
CREATE INDEX idx_amenities_community ON amenities(community_id);
CREATE INDEX idx_reviews_community ON reviews(community_id);
CREATE INDEX idx_reviews_approved ON reviews(approved) WHERE approved = TRUE;

-- Enable Row Level Security (RLS)
ALTER TABLE communities ENABLE ROW LEVEL SECURITY;
ALTER TABLE amenities ENABLE ROW LEVEL SECURITY;
ALTER TABLE neighborhoods ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE market_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE transportation ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_captures ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies (allow read access to public data)
CREATE POLICY "Public communities are viewable by everyone" ON communities
  FOR SELECT USING (active = TRUE);

CREATE POLICY "Public amenities are viewable by everyone" ON amenities
  FOR SELECT USING (TRUE);

CREATE POLICY "Public neighborhoods are viewable by everyone" ON neighborhoods
  FOR SELECT USING (TRUE);

CREATE POLICY "Approved reviews are viewable by everyone" ON reviews
  FOR SELECT USING (approved = TRUE);

CREATE POLICY "Public market trends are viewable by everyone" ON market_trends
  FOR SELECT USING (TRUE);

CREATE POLICY "Public transportation is viewable by everyone" ON transportation
  FOR SELECT USING (TRUE);

CREATE POLICY "Active events are viewable by everyone" ON events
  FOR SELECT USING (active = TRUE);

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add update triggers
CREATE TRIGGER update_communities_updated_at BEFORE UPDATE ON communities
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
