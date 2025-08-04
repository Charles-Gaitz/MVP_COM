-- TexasCommunities Demo Data
-- Run this after creating the schema

-- Insert demo communities (25 popular Texas areas)
INSERT INTO communities (name, slug, city, county, latitude, longitude, zip_codes, population, median_age, median_household_income, average_home_price, median_home_price, average_rent, home_price_trend, school_district, school_rating, elementary_schools, middle_schools, high_schools, crime_rate, walkability_score, transit_score, bike_score, average_temp_summer, average_temp_winter, annual_rainfall, unemployment_rate, job_growth_rate, major_employers, cost_of_living_index, diversity_index, description, short_description, image_url, featured, active, meta_title, meta_description) VALUES

-- Austin Area Communities
('West Lake Hills', 'west-lake-hills', 'Austin', 'Travis', 30.2672, -97.7717, ARRAY['78746', '78732'], 3116, 47.2, 157829, 1250000, 1150000, 2800, 'rising', 'Eanes ISD', 10.0, 2, 1, 1, 12.8, 45, 25, 35, 94, 48, 32.5, 2.1, 8.7, ARRAY['Dell Technologies', 'Apple', 'Google'], 145, 72.3, 'Exclusive lakeside community with top-rated schools and luxury homes overlooking Lake Austin. Known for its scenic beauty and proximity to downtown Austin.', 'Luxury Austin community with 10/10 schools and stunning lake views.', 'https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg', true, true, 'West Lake Hills TX - Luxury Community Near Austin | TexasCommunities', 'Discover West Lake Hills, an exclusive Austin community with top schools, luxury homes, and beautiful lake views. Compare prices and amenities.'),

('Cedar Park', 'cedar-park', 'Cedar Park', 'Williamson', 30.5052, -97.8203, ARRAY['78613', '78641'], 77595, 36.8, 89456, 425000, 398000, 1650, 'rising', 'Leander ISD', 9.1, 12, 4, 3, 18.2, 32, 18, 22, 95, 49, 32.1, 2.8, 12.4, ARRAY['Dell Technologies', 'National Instruments', 'IBM'], 102, 68.7, 'Family-friendly suburb northwest of Austin with excellent schools, parks, and a strong sense of community. Popular for young families and professionals.', 'Fast-growing Austin suburb with great schools and family amenities.', 'https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg', true, true, 'Cedar Park TX - Top Austin Suburb for Families | TexasCommunities', 'Explore Cedar Park, a top-rated Austin suburb with excellent schools, family amenities, and affordable homes. Perfect for young families.'),

('Round Rock', 'round-rock', 'Round Rock', 'Williamson', 30.5083, -97.6789, ARRAY['78664', '78665', '78681'], 133372, 35.2, 78945, 389000, 365000, 1580, 'stable', 'Round Rock ISD', 8.7, 23, 8, 5, 19.5, 38, 22, 28, 95, 49, 32.1, 3.1, 10.8, ARRAY['Dell Technologies', 'Seton Healthcare', 'IKEA'], 98, 71.2, 'Dynamic city north of Austin known for its business-friendly environment, excellent schools, and the famous Round Rock Donuts. Home to Dell headquarters.', 'Business hub north of Austin with excellent schools and opportunities.', 'https://images.pexels.com/photos/1643389/pexels-photo-1643389.jpeg', true, true, 'Round Rock TX - Austin Area Business Hub | TexasCommunities', 'Discover Round Rock, a thriving Austin suburb with top schools, major employers like Dell, and great quality of life for families.'),

('Georgetown', 'georgetown', 'Georgetown', 'Williamson', 30.6327, -97.6770, ARRAY['78626', '78628', '78633'], 75420, 42.1, 76234, 385000, 358000, 1520, 'rising', 'Georgetown ISD', 8.9, 15, 4, 3, 16.7, 42, 19, 31, 95, 49, 32.1, 2.9, 9.6, ARRAY['Southwestern University', 'St. Davids HealthCare', 'Andice'], 95, 65.4, 'Historic town square charm meets modern amenities in this rapidly growing community. Known for beautiful Victorian architecture and excellent schools.', 'Historic charm with modern growth north of Austin.', 'https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg', false, true, 'Georgetown TX - Historic Charm Near Austin | TexasCommunities', 'Explore Georgetown TX, combining historic charm with modern amenities. Great schools, beautiful downtown, and growing community.'),

-- Dallas Area Communities
('Plano', 'plano', 'Plano', 'Collin', 33.0198, -96.6989, ARRAY['75023', '75024', '75025', '75074', '75075'], 285494, 40.1, 95678, 485000, 445000, 1750, 'stable', 'Plano ISD', 9.4, 38, 12, 7, 14.2, 48, 35, 42, 96, 45, 37.2, 2.4, 7.8, ARRAY['Toyota', 'JCPenney', 'Frito-Lay'], 108, 79.8, 'Highly-rated suburb known for exceptional schools, corporate headquarters, and diverse community. Consistently ranked among best places to live in Texas.', 'Top-rated Dallas suburb with excellent schools and corporate presence.', 'https://images.pexels.com/photos/280222/pexels-photo-280222.jpeg', true, true, 'Plano TX - Top Dallas Suburb for Families | TexasCommunities', 'Discover Plano, a premier Dallas suburb with top-rated schools, major corporations, and exceptional quality of life for families.'),

('Frisco', 'frisco', 'Frisco', 'Collin', 33.1507, -96.8236, ARRAY['75033', '75034', '75035'], 200509, 35.7, 102345, 525000, 485000, 1850, 'rising', 'Frisco ISD', 9.6, 42, 13, 8, 12.1, 44, 28, 38, 96, 45, 37.2, 2.2, 11.3, ARRAY['Dallas Cowboys', 'FC Dallas', 'T-Mobile'], 112, 77.3, 'Fast-growing city with world-class sports facilities, top schools, and family-friendly amenities. Home to Dallas Cowboys headquarters and training facility.', 'Booming Dallas suburb with sports facilities and top schools.', 'https://images.pexels.com/photos/1029604/pexels-photo-1029604.jpeg', true, true, 'Frisco TX - Premier Dallas Sports City | TexasCommunities', 'Explore Frisco, home to Dallas Cowboys and top-rated schools. Fast-growing community with excellent amenities and family attractions.'),

('Allen', 'allen', 'Allen', 'Collin', 33.1031, -96.6706, ARRAY['75013'], 105623, 38.9, 98234, 465000, 425000, 1680, 'stable', 'Allen ISD', 9.2, 14, 4, 2, 13.8, 41, 26, 35, 96, 45, 37.2, 2.5, 8.9, ARRAY['PrimeLending', 'Fossil Group', 'Allen ISD'], 105, 74.6, 'Family-oriented community with award-winning schools and the spectacular Allen Event Center. Known for its excellent youth sports programs and community events.', 'Family-focused Dallas suburb with award-winning schools and events.', 'https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg', false, true, 'Allen TX - Family Community Near Dallas | TexasCommunities', 'Discover Allen, a family-focused Dallas suburb with award-winning schools, youth sports, and the famous Allen Event Center.'),

-- Houston Area Communities
('The Woodlands', 'the-woodlands', 'The Woodlands', 'Montgomery', 30.1588, -95.4613, ARRAY['77380', '77381', '77382', '77384'], 116278, 40.7, 112456, 495000, 465000, 1780, 'rising', 'Conroe ISD', 9.3, 25, 8, 4, 11.7, 52, 31, 45, 93, 52, 49.8, 2.3, 9.4, ARRAY['ExxonMobil', 'Anadarko', 'Huntsman'], 115, 71.8, 'Master-planned community featuring lush forests, top schools, and world-class amenities. Known for its natural beauty and high quality of life.', 'Master-planned Houston community with forests and top amenities.', 'https://images.pexels.com/photos/1029613/pexels-photo-1029613.jpeg', true, true, 'The Woodlands TX - Master-Planned Houston Community | TexasCommunities', 'Explore The Woodlands, a premier master-planned community near Houston with excellent schools, natural beauty, and luxury amenities.'),

('Katy', 'katy', 'Katy', 'Harris', 29.7858, -95.8244, ARRAY['77449', '77450', '77494'], 21894, 36.4, 89567, 425000, 395000, 1650, 'rising', 'Katy ISD', 9.8, 45, 15, 8, 15.3, 35, 22, 28, 93, 52, 49.8, 2.7, 8.2, ARRAY['BP America', 'Shell Oil', 'ConocoPhillips'], 103, 82.4, 'Renowned for having some of the best schools in Texas, this family-friendly community offers suburban charm with easy access to Houston.', 'Houston suburb famous for top-rated schools and family life.', 'https://images.pexels.com/photos/1438834/pexels-photo-1438834.jpeg', true, true, 'Katy TX - Top Schools Near Houston | TexasCommunities', 'Discover Katy, famous for top-rated schools and family-friendly living near Houston. Compare homes and amenities in this premier suburb.'),

('Sugar Land', 'sugar-land', 'Sugar Land', 'Fort Bend', 29.5997, -95.6349, ARRAY['77478', '77479', '77496'], 118563, 38.2, 125678, 485000, 445000, 1720, 'stable', 'Fort Bend ISD', 9.4, 28, 9, 6, 12.4, 46, 29, 38, 93, 52, 49.8, 2.1, 7.6, ARRAY['Schlumberger', 'Fluor', 'Minute Maid'], 118, 86.7, 'Affluent suburb known for excellent schools, diverse community, and proximity to major employment centers. Consistently ranked among safest cities in Texas.', 'Affluent Houston suburb with top schools and safety ratings.', 'https://images.pexels.com/photos/1370704/pexels-photo-1370704.jpeg', true, true, 'Sugar Land TX - Safe Houston Suburb | TexasCommunities', 'Explore Sugar Land, one of Texas safest cities with excellent schools, diverse community, and affluent lifestyle near Houston.'),

-- San Antonio Area Communities
('Alamo Heights', 'alamo-heights', 'San Antonio', 'Bexar', 29.4849, -98.4663, ARRAY['78209'], 8326, 45.6, 134567, 695000, 625000, 2100, 'rising', 'Alamo Heights ISD', 9.7, 3, 1, 1, 8.9, 58, 24, 41, 95, 51, 32.4, 1.8, 5.4, ARRAY['USAA', 'Valero', 'H-E-B'], 125, 68.9, 'Prestigious enclave within San Antonio known for tree-lined streets, historic homes, and top-rated schools. One of the most desirable neighborhoods in the city.', 'Prestigious San Antonio enclave with historic charm and top schools.', 'https://images.pexels.com/photos/1438832/pexels-photo-1438832.jpeg', true, true, 'Alamo Heights TX - Prestigious San Antonio Neighborhood | TexasCommunities', 'Discover Alamo Heights, San Antonios most prestigious neighborhood with historic homes, tree-lined streets, and top-rated schools.'),

('Stone Oak', 'stone-oak', 'San Antonio', 'Bexar', 29.6238, -98.4525, ARRAY['78258', '78259'], 89756, 39.2, 95234, 415000, 385000, 1580, 'stable', 'North East ISD', 8.8, 8, 3, 2, 13.7, 42, 26, 32, 95, 51, 32.4, 2.4, 7.8, ARRAY['USAA', 'Rackspace', 'Toyota'], 98, 76.4, 'Upscale master-planned community in North San Antonio featuring golf courses, luxury homes, and excellent schools. Popular with families and professionals.', 'Upscale San Antonio community with golf courses and luxury homes.', 'https://images.pexels.com/photos/1029586/pexels-photo-1029586.jpeg', false, true, 'Stone Oak San Antonio - Luxury Master-Planned Community | TexasCommunities', 'Explore Stone Oak, an upscale San Antonio community with golf courses, luxury homes, and excellent schools in North San Antonio.'),

-- Fort Worth Area Communities
('Southlake', 'southlake', 'Southlake', 'Tarrant', 32.9412, -97.1342, ARRAY['76092'], 31684, 42.8, 178234, 875000, 795000, 2650, 'stable', 'Carroll ISD', 10.0, 7, 2, 1, 7.2, 39, 21, 35, 96, 45, 37.2, 1.6, 6.8, ARRAY['American Airlines', 'Sabre', 'Bell Helicopter'], 152, 71.2, 'Affluent community consistently ranked among the wealthiest in Texas. Known for excellent schools, upscale shopping, and luxury homes.', 'Affluent Dallas-Fort Worth community with top schools and luxury.', 'https://images.pexels.com/photos/1029591/pexels-photo-1029591.jpeg', true, true, 'Southlake TX - Luxury DFW Community | TexasCommunities', 'Discover Southlake, one of Texas wealthiest communities with top-rated schools, luxury homes, and upscale amenities in DFW.'),

('Colleyville', 'colleyville', 'Colleyville', 'Tarrant', 32.8809, -97.1550, ARRAY['76034'], 26766, 44.1, 156789, 695000, 625000, 2350, 'stable', 'Grapevine-Colleyville ISD', 9.6, 4, 1, 1, 8.4, 37, 19, 33, 96, 45, 37.2, 1.7, 5.9, ARRAY['American Airlines', 'Grapevine Mills', 'DFW Airport'], 142, 68.7, 'Upscale suburban community known for large custom homes, excellent schools, and small-town feel despite proximity to Dallas-Fort Worth metroplex.', 'Upscale DFW suburb with custom homes and small-town charm.', 'https://images.pexels.com/photos/280224/pexels-photo-280224.jpeg', false, true, 'Colleyville TX - Upscale DFW Suburb | TexasCommunities', 'Explore Colleyville, an upscale DFW suburb with custom homes, top schools, and small-town charm near Dallas and Fort Worth.'),

-- Emerging/Growing Communities
('Leander', 'leander', 'Leander', 'Williamson', 30.5788, -97.8531, ARRAY['78641', '78645'], 67124, 34.8, 82456, 365000, 345000, 1480, 'rising', 'Leander ISD', 8.6, 18, 6, 3, 17.8, 29, 15, 24, 95, 49, 32.1, 3.2, 15.6, ARRAY['Dell Technologies', 'Apple', 'City of Austin'], 93, 71.8, 'Fast-growing community northwest of Austin with new developments, good schools, and family-friendly amenities. Popular with young families seeking affordability.', 'Fast-growing Austin area community with affordable family living.', 'https://images.pexels.com/photos/1043459/pexels-photo-1043459.jpeg', false, true, 'Leander TX - Growing Austin Suburb | TexasCommunities', 'Discover Leander, a fast-growing Austin suburb with affordable homes, good schools, and family amenities. Perfect for first-time buyers.'),

('Pflugerville', 'pflugerville', 'Pflugerville', 'Travis', 30.4394, -97.6200, ARRAY['78660'], 70791, 32.1, 76234, 335000, 318000, 1420, 'rising', 'Pflugerville ISD', 8.4, 16, 5, 3, 19.2, 31, 18, 26, 95, 49, 32.1, 3.4, 13.7, ARRAY['Dell Technologies', 'Indeed', 'Facebook'], 89, 75.6, 'Diverse and growing community northeast of Austin known for its affordability, good schools, and strong community spirit. Great for young families.', 'Diverse Austin suburb with affordability and strong community spirit.', 'https://images.pexels.com/photos/1029597/pexels-photo-1029597.jpeg', false, true, 'Pflugerville TX - Affordable Austin Community | TexasCommunities', 'Explore Pflugerville, an affordable and diverse Austin suburb with good schools and strong community spirit for growing families.'),

('Prosper', 'prosper', 'Prosper', 'Collin', 33.2362, -96.8011, ARRAY['75078'], 30174, 36.9, 125678, 565000, 515000, 1950, 'rising', 'Prosper ISD', 9.5, 8, 3, 2, 11.3, 34, 21, 29, 96, 45, 37.2, 2.1, 18.4, ARRAY['Toyota', 'Liberty Mutual', 'Charles Schwab'], 118, 72.4, 'Rapidly growing town between Dallas and Frisco with excellent schools and new master-planned communities. Popular with families seeking newer homes.', 'Rapidly growing Dallas area town with new developments and top schools.', 'https://images.pexels.com/photos/1029595/pexels-photo-1029595.jpeg', false, true, 'Prosper TX - Growing Dallas Community | TexasCommunities', 'Discover Prosper, a rapidly growing Dallas area community with excellent schools, new homes, and master-planned developments.'),

('McKinney', 'mckinney', 'McKinney', 'Collin', 33.1972, -96.6153, ARRAY['75069', '75070', '75071'], 199177, 36.4, 87654, 435000, 405000, 1620, 'rising', 'McKinney ISD', 8.9, 35, 11, 6, 15.6, 43, 24, 34, 96, 45, 37.2, 2.8, 12.1, ARRAY['Raytheon', 'Encore Wire', 'McKinney ISD'], 101, 74.3, 'Historic downtown charm meets modern growth in this thriving Dallas suburb. Known for its beautiful town square and family-friendly atmosphere.', 'Historic Dallas suburb with charming downtown and modern growth.', 'https://images.pexels.com/photos/280225/pexels-photo-280225.jpeg', false, true, 'McKinney TX - Historic Dallas Suburb | TexasCommunities', 'Explore McKinney, a historic Dallas suburb with charming downtown, modern amenities, and family-friendly atmosphere.'),

-- Additional Communities
('Flower Mound', 'flower-mound', 'Flower Mound', 'Denton', 33.0145, -97.0969, ARRAY['75022', '75028'], 78854, 40.2, 118567, 485000, 445000, 1720, 'stable', 'Lewisville ISD', 9.1, 12, 4, 2, 12.8, 41, 23, 36, 96, 45, 37.2, 2.3, 8.6, ARRAY['Charles Schwab', 'Nokia', 'PepsiCo'], 112, 76.8, 'Master-planned community known for its parks, trails, and family-friendly amenities. Features excellent schools and easy access to DFW metroplex.', 'Master-planned DFW community with parks and family amenities.', 'https://images.pexels.com/photos/1029593/pexels-photo-1029593.jpeg', false, true, 'Flower Mound TX - Master-Planned DFW Community | TexasCommunities', 'Discover Flower Mound, a master-planned DFW community with excellent parks, trails, schools, and family amenities.'),

('Coppell', 'coppell', 'Coppell', 'Dallas', 32.9546, -97.0150, ARRAY['75019'], 42659, 41.7, 134567, 525000, 485000, 1850, 'stable', 'Coppell ISD', 9.7, 9, 3, 2, 9.1, 44, 27, 39, 96, 45, 37.2, 1.9, 6.7, ARRAY['IBM', 'Xerox', 'Quest Diagnostics'], 125, 81.2, 'Small but affluent city with top-rated schools and strong sense of community. Known for its excellent public services and family-oriented lifestyle.', 'Small affluent Dallas city with top schools and community feel.', 'https://images.pexels.com/photos/1029589/pexels-photo-1029589.jpeg', false, true, 'Coppell TX - Affluent Dallas Community | TexasCommunities', 'Explore Coppell, a small but affluent Dallas community with top-rated schools and strong community feel.'),

('Richardson', 'richardson', 'Richardson', 'Dallas', 32.9483, -96.7299, ARRAY['75080', '75081', '75082'], 121323, 38.9, 78234, 395000, 365000, 1580, 'stable', 'Richardson ISD', 8.7, 26, 8, 4, 16.2, 52, 38, 44, 96, 45, 37.2, 2.6, 8.9, ARRAY['Blue Cross Blue Shield', 'Perot Systems', 'State Farm'], 103, 83.4, 'Diverse and established suburb with good schools, central location, and strong technology sector presence. Known for cultural diversity and dining.', 'Diverse Dallas suburb with tech presence and cultural variety.', 'https://images.pexels.com/photos/1029587/pexels-photo-1029587.jpeg', false, true, 'Richardson TX - Diverse Dallas Tech Hub | TexasCommunities', 'Discover Richardson, a diverse Dallas suburb with strong tech presence, good schools, and excellent cultural dining scene.'),

('Tomball', 'tomball', 'Tomball', 'Harris', 30.0972, -95.6160, ARRAY['77375', '77377'], 12341, 41.3, 89567, 325000, 295000, 1380, 'rising', 'Tomball ISD', 8.5, 12, 4, 2, 18.7, 33, 19, 25, 93, 52, 49.8, 3.1, 11.2, ARRAY['ExxonMobil', 'HP Inc.', 'Tomball Regional'], 91, 69.4, 'Charming small town northwest of Houston with historic downtown and growing residential areas. Known for its annual German festival and community spirit.', 'Charming Houston area town with historic downtown and festivals.', 'https://images.pexels.com/photos/1043457/pexels-photo-1043457.jpeg', false, true, 'Tomball TX - Charming Houston Area Town | TexasCommunities', 'Explore Tomball, a charming Houston area town with historic downtown, community festivals, and growing residential areas.'),

('Kingwood', 'kingwood', 'Houston', 'Harris', 30.0533, -95.1691, ARRAY['77339', '77345', '77346'], 71394, 43.2, 98765, 385000, 355000, 1520, 'stable', 'Humble ISD', 8.8, 18, 6, 3, 14.9, 38, 25, 31, 93, 52, 49.8, 2.5, 7.4, ARRAY['ExxonMobil', 'Aecom', 'Kingwood Medical'], 97, 71.8, 'Forest-filled master-planned community northeast of Houston known for its natural beauty, good schools, and family-friendly atmosphere.', 'Forest community northeast of Houston with natural beauty.', 'https://images.pexels.com/photos/1029611/pexels-photo-1029611.jpeg', false, true, 'Kingwood Houston - Forest Master-Planned Community | TexasCommunities', 'Discover Kingwood, a forest-filled Houston community with natural beauty, good schools, and family-friendly living.'),

('New Braunfels', 'new-braunfels', 'New Braunfels', 'Comal', 29.7030, -98.1245, ARRAY['78130', '78132'], 90403, 36.8, 72456, 365000, 335000, 1420, 'rising', 'New Braunfels ISD', 8.6, 20, 6, 4, 20.1, 47, 15, 28, 94, 50, 33.8, 2.9, 14.7, ARRAY['Schlitterbahn', 'McKenna Children''s Museum', 'Comal ISD'], 88, 67.9, 'Historic German town between Austin and San Antonio known for river recreation, Schlitterbahn waterpark, and charming downtown. Popular weekend destination.', 'Historic German town with rivers and Schlitterbahn waterpark.', 'https://images.pexels.com/photos/1029607/pexels-photo-1029607.jpeg', false, true, 'New Braunfels TX - German Heritage River Town | TexasCommunities', 'Explore New Braunfels, a historic German town with river recreation, Schlitterbahn waterpark, and charming downtown between Austin and San Antonio.'),

('Pearland', 'pearland', 'Pearland', 'Brazoria', 29.5636, -95.2861, ARRAY['77581', '77584'], 131448, 35.7, 89234, 385000, 355000, 1520, 'rising', 'Pearland ISD', 9.2, 28, 9, 5, 16.8, 36, 24, 29, 93, 52, 49.8, 2.7, 12.3, ARRAY['Schlumberger', 'Memorial Hermann', 'MD Anderson'], 99, 78.9, 'Fast-growing suburb south of Houston with excellent schools and family amenities. Known for its proximity to medical center and diverse community.', 'Fast-growing Houston suburb with medical center proximity.', 'https://images.pexels.com/photos/1029609/pexels-photo-1029609.jpeg', false, true, 'Pearland TX - Growing Houston Medical Area Suburb | TexasCommunities', 'Discover Pearland, a fast-growing Houston suburb near the medical center with excellent schools and diverse family community.');

-- Insert sample amenities for a few communities
INSERT INTO amenities (community_id, category, name, type, address, distance_miles, rating) VALUES
-- West Lake Hills amenities
(1, 'shopping', 'Barton Creek Square', 'mall', '2901 Capital of Texas Hwy, Austin, TX 78746', 2.1, 4.2),
(1, 'dining', 'The Oasis on Lake Travis', 'restaurant', '6550 Comanche Trail, Austin, TX 78732', 3.5, 4.4),
(1, 'recreation', 'Zilker Park', 'park', '2100 Barton Springs Rd, Austin, TX 78746', 4.2, 4.7),
(1, 'healthcare', 'Austin Heart Hospital', 'hospital', '3801 N Lamar Blvd, Austin, TX 78756', 5.8, 4.3),

-- Cedar Park amenities
(2, 'shopping', 'Lakeline Mall', 'mall', '11200 Lakeline Mall Dr, Cedar Park, TX 78613', 1.2, 4.1),
(2, 'recreation', 'Brushy Creek Regional Trail', 'trail', 'Cedar Park, TX 78613', 0.5, 4.6),
(2, 'dining', 'Salt Traders Coastal Cooking', 'restaurant', '11500 Rock Rose Ave, Austin, TX 78758', 8.2, 4.5),

-- Plano amenities
(5, 'shopping', 'Legacy West', 'shopping_center', '7001 Bishop Rd, Plano, TX 75024', 2.1, 4.5),
(5, 'recreation', 'Arbor Hills Nature Preserve', 'nature_preserve', '6701 W Parker Rd, Plano, TX 75023', 3.2, 4.8),
(5, 'dining', 'The Star in Frisco', 'entertainment_complex', '1 Cowboys Way, Frisco, TX 75034', 8.5, 4.6);

-- Insert sample neighborhoods
INSERT INTO neighborhoods (community_id, name, description, average_home_price, home_price_range_min, home_price_range_max, characteristics) VALUES
(1, 'Westbank', 'Luxury lakefront homes with private boat docks', 1850000, 1200000, 3500000, ARRAY['luxury', 'lakefront', 'gated']),
(1, 'Rob Roy', 'Historic area with mid-century modern homes', 995000, 750000, 1800000, ARRAY['historic', 'mid-century', 'established']),

(2, 'Avery Ranch', 'Master-planned community with golf course', 475000, 350000, 750000, ARRAY['master-planned', 'golf', 'family-friendly']),
(2, 'Anderson Mill', 'Established neighborhood with mature trees', 395000, 280000, 650000, ARRAY['established', 'mature-trees', 'family-friendly']),

(5, 'West Plano', 'Prestigious area with custom homes', 685000, 450000, 1200000, ARRAY['prestigious', 'custom-homes', 'top-schools']),
(5, 'Legacy West', 'New urban development with high-rises', 425000, 300000, 800000, ARRAY['urban', 'walkable', 'modern']);

-- Insert sample reviews
INSERT INTO reviews (community_id, user_name, rating, title, content, pros, cons, years_lived, family_type, approved) VALUES
(1, 'Sarah M.', 5, 'Perfect for families with school-age kids', 'We moved here 3 years ago and absolutely love it. The schools are incredible and the lake access is amazing for weekend activities.', ARRAY['Top schools', 'Beautiful scenery', 'Safe neighborhood'], ARRAY['Expensive', 'Limited shopping nearby'], 3, 'family', true),

(2, 'Mike R.', 4, 'Great value for Austin area', 'Cedar Park offers excellent value compared to other Austin suburbs. Good schools, nice parks, and reasonable home prices.', ARRAY['Good value', 'Family-friendly', 'Growing amenities'], ARRAY['Traffic during rush hour', 'Limited nightlife'], 5, 'family', true),

(5, 'Jennifer L.', 5, 'Outstanding community', 'Plano has everything - great schools, safe neighborhoods, excellent shopping and dining. Worth every penny.', ARRAY['Top schools', 'Very safe', 'Excellent amenities'], ARRAY['Higher cost of living', 'Can feel suburban'], 7, 'family', true);

-- Insert sample market trends (last 12 months)
INSERT INTO market_trends (community_id, date, average_price, median_price, homes_sold, days_on_market, price_per_sqft) VALUES
-- West Lake Hills trends
(1, '2024-01-01', 1180000, 1100000, 15, 45, 425.50),
(1, '2024-06-01', 1215000, 1130000, 18, 38, 438.75),
(1, '2024-12-01', 1250000, 1150000, 12, 42, 448.25),

-- Cedar Park trends
(2, '2024-01-01', 395000, 375000, 125, 28, 165.25),
(2, '2024-06-01', 410000, 385000, 142, 22, 172.50),
(2, '2024-12-01', 425000, 398000, 118, 25, 178.75);

-- Insert sample transportation options
INSERT INTO transportation (community_id, type, name, distance_miles, travel_time_minutes, description) VALUES
(1, 'highway', 'MoPac Expressway', 1.2, 5, 'Direct access to downtown Austin'),
(1, 'airport', 'Austin-Bergstrom International', 12.8, 25, 'Major international airport'),

(2, 'highway', 'US 183', 0.8, 3, 'Main north-south highway'),
(2, 'public_transit', 'Capital Metro', 2.1, 8, 'Bus service to Austin'),

(5, 'highway', 'Dallas North Tollway', 1.5, 5, 'Major north-south tollway'),
(5, 'public_transit', 'DART Red Line', 3.2, 12, 'Light rail to downtown Dallas');

-- Insert sample events
INSERT INTO events (community_id, title, description, event_date, location, category) VALUES
(2, 'Cedar Park Farmers Market', 'Weekly farmers market with local vendors', '2025-08-09 08:00:00-05', 'Cedar Park City Hall', 'market'),
(2, 'Music in the Park Series', 'Free outdoor concert series', '2025-08-15 19:00:00-05', 'Elizabeth Milburn Park', 'cultural'),

(5, 'Plano Balloon Festival', 'Annual hot air balloon festival', '2025-09-20 06:00:00-05', 'Oak Point Park', 'festival'),
(5, 'International Festival', 'Celebrating Planos diversity', '2025-09-28 10:00:00-05', 'Haggard Park', 'cultural');
