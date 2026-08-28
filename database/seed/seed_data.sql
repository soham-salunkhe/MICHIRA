-- YatraAI Seed Data
-- Realistic tourism data for 6 Indian destinations

-- ============================================================
-- DESTINATIONS
-- ============================================================
INSERT INTO destinations (id, name, slug, state, description, latitude, longitude, image_url, total_reviews, avg_rating, positive_pct, neutral_pct, negative_pct, intelligence_score) VALUES
('d1000000-0000-0000-0000-000000000001', 'Goa', 'goa', 'Goa', 'India''s beloved coastal paradise, known for stunning beaches, Portuguese heritage, vibrant nightlife, and incredible seafood. A perfect blend of relaxation and adventure.', 15.2993, 74.1240, '/images/goa.jpg', 12483, 4.20, 82, 11, 7, 82),
('d1000000-0000-0000-0000-000000000002', 'Mumbai', 'mumbai', 'Maharashtra', 'The city of dreams — India''s financial capital blending colonial architecture, Bollywood glamour, street food culture, and a pulsating urban energy unlike anywhere else.', 19.0760, 72.8777, '/images/mumbai.jpg', 8934, 4.05, 76, 14, 10, 75),
('d1000000-0000-0000-0000-000000000003', 'Jaipur', 'jaipur', 'Rajasthan', 'The Pink City — a royal tapestry of majestic forts, ornate palaces, colorful bazaars, and rich Rajasthani culture that transports you to an era of maharajas.', 26.9124, 75.7873, '/images/jaipur.jpg', 9241, 4.35, 85, 9, 6, 86),
('d1000000-0000-0000-0000-000000000004', 'Kerala', 'kerala', 'Kerala', 'God''s Own Country — serene backwaters, lush tea plantations, pristine beaches, Ayurvedic wellness, and a unique cultural heritage that enchants every visitor.', 10.8505, 76.2711, '/images/kerala.jpg', 7856, 4.50, 88, 8, 4, 89),
('d1000000-0000-0000-0000-000000000005', 'Delhi', 'delhi', 'Delhi', 'India''s capital — a living museum where Mughal grandeur meets modern India. From Red Fort to India Gate, street food to fine dining, history breathes in every corner.', 28.6139, 77.2090, '/images/delhi.jpg', 10234, 3.95, 72, 15, 13, 71),
('d1000000-0000-0000-0000-000000000006', 'Agra', 'agra', 'Uttar Pradesh', 'Home of the Taj Mahal — one of the world''s greatest monuments to love. Agra''s Mughal heritage, intricate marble work, and rich history make it an unmissable destination.', 27.1767, 78.0081, '/images/agra.jpg', 6742, 4.10, 78, 12, 10, 74);

-- ============================================================
-- ATTRACTIONS — GOA (primary demo destination)
-- ============================================================
INSERT INTO attractions (id, destination_id, name, slug, type, description, latitude, longitude, avg_rating, total_reviews, positive_pct, opening_hours, entry_fee, is_emerging, emergence_score) VALUES
('a1000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000001', 'Baga Beach', 'baga-beach', 'beach', 'One of Goa''s most popular beaches, known for its vibrant nightlife, water sports, shacks, and lively atmosphere.', 15.5551, 73.7514, 4.10, 3241, 79, '24 hours', 'Free', false, 0),
('a1000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000001', 'Calangute Beach', 'calangute-beach', 'beach', 'The Queen of Beaches — Goa''s largest and most popular beach, buzzing with tourists, shops, and restaurants.', 15.5439, 73.7553, 3.90, 2876, 74, '24 hours', 'Free', false, 0),
('a1000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000001', 'Basilica of Bom Jesus', 'basilica-bom-jesus', 'heritage', 'UNESCO World Heritage Site housing the mortal remains of St. Francis Xavier. A masterpiece of baroque architecture.', 15.5009, 73.9116, 4.60, 1543, 92, '9:00 AM - 6:30 PM', 'Free', false, 0),
('a1000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000001', 'Dudhsagar Falls', 'dudhsagar-falls', 'nature', 'One of India''s tallest waterfalls, a spectacular four-tiered cascade amidst lush forest on the Goa-Karnataka border.', 15.3144, 74.3143, 4.55, 987, 90, '6:00 AM - 5:00 PM (seasonal)', '₹400', false, 0),
('a1000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000001', 'Fort Aguada', 'fort-aguada', 'heritage', '17th-century Portuguese fort offering panoramic views of the Arabian Sea and Sinquerim Beach.', 15.4920, 73.7737, 4.30, 1124, 85, '9:30 AM - 6:00 PM', '₹25', false, 0),
('a1000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000001', 'Anjuna Flea Market', 'anjuna-flea-market', 'market', 'Iconic Wednesday flea market selling everything from handicrafts to clothing, with live music and a hippie vibe.', 15.5736, 73.7413, 4.15, 876, 81, 'Wednesdays 8:00 AM - 6:00 PM', 'Free', false, 0),
('a1000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000001', 'Palolem Beach', 'palolem-beach', 'beach', 'A crescent-shaped beach in South Goa, famous for its calm waters, silent noise parties, and laid-back atmosphere.', 15.0100, 74.0232, 4.45, 654, 89, '24 hours', 'Free', false, 0),
('a1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000001', 'Divar Island', 'divar-island', 'nature', 'A hidden gem accessible by ferry — a tranquil island with Portuguese-era churches, paddy fields, and zero commercialization.', 15.5126, 73.8869, 4.65, 189, 93, '24 hours', 'Free (ferry ₹10)', true, 87.5),
('a1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000001', 'Arambol Sweet Water Lake', 'arambol-sweet-water-lake', 'nature', 'A freshwater lagoon hidden behind Arambol Beach, surrounded by jungle. A serene, lesser-known paradise.', 15.6876, 73.7033, 4.50, 234, 91, '24 hours', 'Free', true, 78.2),
('a1000000-0000-0000-0000-000000000010', 'd1000000-0000-0000-0000-000000000001', 'Spice Plantation Tour', 'spice-plantation', 'experience', 'Explore Goa''s aromatic spice plantations — see cardamom, pepper, vanilla growing. Includes traditional lunch.', 15.4200, 74.0100, 4.40, 432, 87, '9:30 AM - 4:00 PM', '₹400-600', false, 0),
('a1000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000001', 'Chorao Island Mangroves', 'chorao-mangroves', 'nature', 'Dr. Salim Ali Bird Sanctuary on Chorao Island — pristine mangrove ecosystem, kayaking, and bird watching.', 15.5200, 73.8700, 4.55, 145, 92, '6:00 AM - 6:00 PM', '₹20', true, 82.3),
('a1000000-0000-0000-0000-000000000012', 'd1000000-0000-0000-0000-000000000001', 'Fontainhas Latin Quarter', 'fontainhas', 'heritage', 'A charming old Portuguese quarter in Panaji with colorful houses, art galleries, cafes, and colonial architecture.', 15.4975, 73.8310, 4.50, 567, 90, '24 hours', 'Free', false, 0);

-- ============================================================
-- ATTRACTIONS — MUMBAI
-- ============================================================
INSERT INTO attractions (id, destination_id, name, slug, type, description, latitude, longitude, avg_rating, total_reviews, positive_pct, opening_hours, entry_fee) VALUES
('a2000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000002', 'Gateway of India', 'gateway-of-india', 'heritage', 'Iconic arch monument overlooking the Arabian Sea, built during the British Raj. Mumbai''s most famous landmark.', 18.9220, 72.8347, 4.30, 2341, 83, '24 hours', 'Free'),
('a2000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000002', 'Marine Drive', 'marine-drive', 'landmark', 'The Queen''s Necklace — a sweeping boulevard along the coast, perfect for evening walks and sunset views.', 18.9432, 72.8235, 4.50, 1987, 88, '24 hours', 'Free'),
('a2000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000002', 'Elephanta Caves', 'elephanta-caves', 'heritage', 'UNESCO World Heritage rock-cut cave temples on Elephanta Island, featuring stunning sculptures of Lord Shiva.', 18.9633, 72.9315, 4.35, 1243, 82, '9:00 AM - 5:30 PM (closed Mon)', '₹40'),
('a2000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000002', 'Chhatrapati Shivaji Terminus', 'cst', 'heritage', 'UNESCO World Heritage Victorian Gothic railway station — an architectural marvel that''s still a functioning train station.', 18.9398, 72.8355, 4.45, 876, 86, '24 hours', 'Free'),
('a2000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000002', 'Juhu Beach', 'juhu-beach', 'beach', 'Mumbai''s most famous beach, known for street food, celebrity spotting, and stunning sunsets.', 19.0988, 72.8268, 3.85, 1654, 71, '24 hours', 'Free'),
('a2000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000002', 'Crawford Market', 'crawford-market', 'market', 'Historic marketplace with Victorian architecture, selling everything from exotic fruits to pets.', 18.9476, 72.8337, 4.00, 543, 77, '11:00 AM - 8:00 PM', 'Free'),
('a2000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000002', 'Dharavi Art District', 'dharavi-art', 'cultural', 'Community-led art and pottery tours in Dharavi, showcasing incredible local craftsmanship and entrepreneurship.', 19.0424, 72.8547, 4.55, 234, 91, '10:00 AM - 5:00 PM', '₹600-1000');

-- ============================================================
-- ATTRACTIONS — JAIPUR
-- ============================================================
INSERT INTO attractions (id, destination_id, name, slug, type, description, latitude, longitude, avg_rating, total_reviews, positive_pct, opening_hours, entry_fee) VALUES
('a3000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000003', 'Amber Fort', 'amber-fort', 'heritage', 'Majestic hilltop fort combining Rajput and Mughal architecture, with stunning mirror work and panoramic views.', 26.9855, 75.8513, 4.60, 2876, 89, '8:00 AM - 5:30 PM', '₹200'),
('a3000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000003', 'Hawa Mahal', 'hawa-mahal', 'heritage', 'The Palace of Winds — iconic pink sandstone facade with 953 small windows, designed for royal women to observe street life.', 26.9239, 75.8267, 4.45, 2134, 86, '9:00 AM - 5:00 PM', '₹200'),
('a3000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000003', 'City Palace', 'city-palace-jaipur', 'heritage', 'A stunning blend of Rajput and Mughal architecture, still partially occupied by the royal family.', 26.9258, 75.8237, 4.40, 1876, 84, '9:30 AM - 5:00 PM', '₹500'),
('a3000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000003', 'Jantar Mantar', 'jantar-mantar-jaipur', 'heritage', 'UNESCO World Heritage astronomical observation site with the world''s largest stone sundial.', 26.9249, 75.8245, 4.25, 987, 80, '9:00 AM - 4:30 PM', '₹200'),
('a3000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000003', 'Nahargarh Fort', 'nahargarh-fort', 'heritage', 'Hill fort offering breathtaking panoramic views of Jaipur, especially magical at sunset.', 26.9373, 75.8152, 4.35, 1243, 83, '10:00 AM - 5:30 PM', '₹200'),
('a3000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000003', 'Johari Bazaar', 'johari-bazaar', 'market', 'Jaipur''s famous jewelry market — vibrant lanes filled with gems, silver, textiles, and traditional Rajasthani crafts.', 26.9220, 75.8230, 4.20, 654, 79, '10:00 AM - 8:00 PM', 'Free'),
('a3000000-0000-0000-0000-000000000007', 'd1000000-0000-0000-0000-000000000003', 'Patrika Gate', 'patrika-gate', 'landmark', 'A stunning modern monument showcasing the architecture of all Rajasthani regions. Instagrammer''s paradise.', 26.8557, 75.8087, 4.50, 432, 90, '24 hours', 'Free');

-- ============================================================
-- ATTRACTIONS — KERALA
-- ============================================================
INSERT INTO attractions (id, destination_id, name, slug, type, description, latitude, longitude, avg_rating, total_reviews, positive_pct, opening_hours, entry_fee) VALUES
('a4000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000004', 'Alleppey Backwaters', 'alleppey-backwaters', 'nature', 'The Venice of the East — a mesmerizing network of canals, lagoons, and lakes. Houseboat cruises are unforgettable.', 9.4981, 76.3388, 4.65, 2341, 91, '6:00 AM - 6:00 PM', '₹1500-8000 (houseboat)'),
('a4000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000004', 'Munnar Tea Gardens', 'munnar-tea-gardens', 'nature', 'Endless rolling hills carpeted with tea plantations. The cool mountain air and misty mornings are pure bliss.', 10.0889, 77.0595, 4.60, 1876, 90, '9:00 AM - 4:00 PM', '₹25-75'),
('a4000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000004', 'Fort Kochi', 'fort-kochi', 'heritage', 'A charming historic quarter with Chinese fishing nets, colonial architecture, art cafes, and multicultural heritage.', 9.9639, 76.2437, 4.45, 1234, 87, '24 hours', 'Free'),
('a4000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000004', 'Periyar Wildlife Sanctuary', 'periyar-wildlife', 'nature', 'A tiger reserve around an artificial lake — boat safaris, bamboo rafting, and incredible biodiversity.', 9.4585, 77.1652, 4.40, 876, 85, '6:00 AM - 6:00 PM', '₹300'),
('a4000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000004', 'Varkala Beach', 'varkala-beach', 'beach', 'Dramatic cliffs overlooking the Arabian Sea. Natural springs, laid-back vibe, and stunning cliff-top cafes.', 8.7336, 76.7109, 4.50, 654, 88, '24 hours', 'Free'),
('a4000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000004', 'Kumarakom Bird Sanctuary', 'kumarakom-birds', 'nature', 'A paradise for bird watchers on the banks of Vembanad Lake. Migratory birds flock here between November and February.', 9.5979, 76.4262, 4.35, 345, 86, '6:00 AM - 6:00 PM', '₹50');

-- ============================================================
-- ATTRACTIONS — DELHI
-- ============================================================
INSERT INTO attractions (id, destination_id, name, slug, type, description, latitude, longitude, avg_rating, total_reviews, positive_pct, opening_hours, entry_fee) VALUES
('a5000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000005', 'Red Fort', 'red-fort', 'heritage', 'UNESCO World Heritage Mughal fort — the seat of Mughal emperors for nearly 200 years. An icon of Indian history.', 28.6562, 77.2410, 4.20, 2543, 78, '9:30 AM - 4:30 PM (closed Mon)', '₹35'),
('a5000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000005', 'Qutub Minar', 'qutub-minar', 'heritage', 'UNESCO World Heritage — the tallest brick minaret in the world. A stunning example of Indo-Islamic architecture.', 28.5245, 77.1855, 4.35, 1987, 82, '7:00 AM - 5:00 PM', '₹35'),
('a5000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000005', 'India Gate', 'india-gate', 'landmark', 'War memorial arch standing 42 meters tall. The surrounding lawns and fountains are perfect for evening visits.', 28.6129, 77.2295, 4.15, 2134, 76, '24 hours', 'Free'),
('a5000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000005', 'Humayun''s Tomb', 'humayuns-tomb', 'heritage', 'The inspiration for the Taj Mahal — a gorgeous Mughal garden tomb and UNESCO World Heritage Site.', 28.5933, 77.2507, 4.50, 1234, 87, '6:00 AM - 6:00 PM', '₹35'),
('a5000000-0000-0000-0000-000000000005', 'd1000000-0000-0000-0000-000000000005', 'Chandni Chowk', 'chandni-chowk', 'market', 'Old Delhi''s legendary market — a sensory overload of street food, spices, textiles, and 400 years of history.', 28.6506, 77.2306, 4.00, 1543, 73, '9:30 AM - 8:00 PM', 'Free'),
('a5000000-0000-0000-0000-000000000006', 'd1000000-0000-0000-0000-000000000005', 'Lodhi Art District', 'lodhi-art', 'cultural', 'India''s first public art district — colorful murals transforming an entire neighborhood into an open-air gallery.', 28.5900, 77.2200, 4.40, 432, 88, '24 hours', 'Free');

-- ============================================================
-- ATTRACTIONS — AGRA
-- ============================================================
INSERT INTO attractions (id, destination_id, name, slug, type, description, latitude, longitude, avg_rating, total_reviews, positive_pct, opening_hours, entry_fee) VALUES
('a6000000-0000-0000-0000-000000000001', 'd1000000-0000-0000-0000-000000000006', 'Taj Mahal', 'taj-mahal', 'heritage', 'One of the Seven Wonders of the World — an eternal monument of love built in white marble by Shah Jahan.', 27.1751, 78.0421, 4.70, 3456, 90, '6:00 AM - 6:30 PM (closed Fri)', '₹50 (Indian), ₹1100 (Foreign)'),
('a6000000-0000-0000-0000-000000000002', 'd1000000-0000-0000-0000-000000000006', 'Agra Fort', 'agra-fort', 'heritage', 'UNESCO World Heritage Mughal fortress — a city within a city, with palaces, audience halls, and gardens.', 27.1795, 78.0211, 4.40, 1876, 83, '6:00 AM - 6:00 PM', '₹40'),
('a6000000-0000-0000-0000-000000000003', 'd1000000-0000-0000-0000-000000000006', 'Fatehpur Sikri', 'fatehpur-sikri', 'heritage', 'The ghost city — Akbar''s abandoned capital, a stunning UNESCO site 40 km from Agra.', 27.0940, 77.6600, 4.35, 876, 81, '6:00 AM - 6:00 PM', '₹40'),
('a6000000-0000-0000-0000-000000000004', 'd1000000-0000-0000-0000-000000000006', 'Mehtab Bagh', 'mehtab-bagh', 'garden', 'Moon Garden — offering the most photogenic sunset views of the Taj Mahal from across the Yamuna river.', 27.1800, 78.0435, 4.25, 543, 85, '6:00 AM - 6:00 PM', '₹25');

-- ============================================================
-- REVIEWS — GOA (comprehensive multilingual reviews)
-- ============================================================

-- Baga Beach Reviews
INSERT INTO reviews (destination_id, attraction_id, original_text, detected_language, rating, review_date, sentiment, sentiment_score, confidence) VALUES
-- English positive
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Baga Beach is absolutely stunning! The water sports are fantastic, the shacks serve amazing seafood, and the sunset views are breathtaking. Had the best time of our trip here.', 'en', 5.0, '2026-07-15', 'positive', 0.92, 0.95),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Great beach for water sports and nightlife. The parasailing experience was incredible. Food at the beach shacks is delicious and reasonably priced.', 'en', 4.0, '2026-07-20', 'positive', 0.78, 0.91),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Beautiful beach with lots of activities. We loved the jet skiing and banana boat rides. The vibe in the evening is amazing with music and lights.', 'en', 4.5, '2026-06-28', 'positive', 0.85, 0.93),
-- English negative
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Way too crowded especially on weekends. Finding parking was impossible. The beach is dirty in some areas with plastic waste. Very disappointing compared to what I expected.', 'en', 2.0, '2026-08-02', 'negative', -0.75, 0.89),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Overrated beach. Extremely crowded, hawkers are very aggressive, and the parking situation is terrible. There is absolutely nowhere to park your vehicle. Had to walk 2km.', 'en', 2.0, '2026-08-10', 'negative', -0.82, 0.92),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'The beach itself is nice but the cleanliness is a major issue. Plastic bottles and food wrappers everywhere. Parking facilities are terrible and touts are annoying.', 'en', 2.5, '2026-07-05', 'negative', -0.65, 0.88),
-- English neutral
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'Average beach experience. Its fine for a day visit. Water sports prices are standard. Beach shacks are okay. Nothing extraordinary but not bad either.', 'en', 3.0, '2026-06-15', 'neutral', 0.05, 0.85),
-- Hindi reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'बागा बीच बहुत सुंदर है! यहां का खाना बहुत स्वादिष्ट है और वाटर स्पोर्ट्स का मजा ही कुछ और है। हमने बहुत एंजॉय किया। परिवार के साथ आने लायक जगह है।', 'hi', 5.0, '2026-07-12', 'positive', 0.88, 0.90),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'बीच पर बहुत भीड़ थी। पार्किंग की जगह ही नहीं मिली। गंदगी भी काफी थी। टूरिस्ट को परेशान करने वाले लोग बहुत हैं। निराशा हुई।', 'hi', 2.0, '2026-08-05', 'negative', -0.78, 0.88),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'बागा बीच में सूर्यास्त देखना अद्भुत अनुभव है। शाम को यहां का माहौल बहुत अच्छा होता है। खाना भी ठीक-ठाक है।', 'hi', 4.0, '2026-06-30', 'positive', 0.72, 0.86),
-- Marathi reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'बागा बीच खूपच छान आहे! इथलं सी फूड अप्रतिम आहे. वॉटर स्पोर्ट्स खूप मजेशीर आहेत. पुन्हा नक्की येणार!', 'mr', 5.0, '2026-07-18', 'positive', 0.90, 0.88),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'खूप गर्दी आहे इथे. पार्किंग ची सोय अजिबात नाही. स्वच्छता पण ठीक नाही. पण समुद्र सुंदर आहे.', 'mr', 3.0, '2026-08-08', 'neutral', -0.15, 0.84),
-- Tamil review
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'பாகா கடற்கரை மிகவும் அழகாக உள்ளது. உணவு சுவையாக இருந்தது. ஆனால் கூட்டம் அதிகமாக இருந்தது.', 'ta', 3.5, '2026-07-22', 'positive', 0.45, 0.82),
-- Telugu review
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000001', 'బాగా బీచ్ చాలా బాగుంది. వాటర్ స్పోర్ట్స్ చాలా ఆనందంగా ఉన్నాయి. తిండి కూడా రుచిగా ఉంది. కానీ పార్కింగ్ సమస్య ఉంది.', 'te', 4.0, '2026-07-25', 'positive', 0.62, 0.83),

-- Calangute Beach Reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Calangute is way too commercial now. Overcrowded, noisy, and the beach is not clean. The hawkers won''t leave you alone for even 5 minutes. Very stressful experience.', 'en', 2.0, '2026-08-01', 'negative', -0.80, 0.91),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Still a decent beach if you go early morning. The crowd after 11 AM is unbearable. Food options are plenty but overpriced. Would recommend Palolem instead.', 'en', 3.0, '2026-07-28', 'neutral', -0.10, 0.87),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'कलंगुट बीच पर इतनी भीड़ थी कि चलना भी मुश्किल हो गया। कचरा बहुत फैला हुआ था। पार्किंग के लिए ₹200 चार्ज किया।', 'hi', 2.0, '2026-08-03', 'negative', -0.72, 0.88),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000002', 'Nice beach for families. Kids enjoyed playing in the shallow water. Lots of restaurants nearby. But yes, its crowded.', 'en', 3.5, '2026-06-20', 'positive', 0.42, 0.85),

-- Basilica of Bom Jesus Reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'An absolutely magnificent piece of architecture. The history is incredible and the interiors are breathtaking. Well-maintained and very peaceful. A must-visit in Goa.', 'en', 5.0, '2026-07-10', 'positive', 0.95, 0.96),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'बेसिलिका ऑफ बॉम जीसस गोवा में जरूर देखना चाहिए। पुर्तगाली वास्तुकला अद्भुत है। बहुत शांत और आध्यात्मिक जगह।', 'hi', 5.0, '2026-06-25', 'positive', 0.90, 0.92),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000003', 'Beautiful heritage site. Photography restrictions inside are reasonable. Good guides available outside. Parking can be challenging during peak hours.', 'en', 4.5, '2026-07-30', 'positive', 0.82, 0.90),

-- Dudhsagar Falls Reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 'Dudhsagar Falls is absolutely majestic! The jeep ride through the forest is an adventure itself. The waterfall is massive and the swimming pool at the base is refreshing.', 'en', 5.0, '2026-07-08', 'positive', 0.93, 0.94),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 'Amazing waterfall but the road to get there is terrible. The jeep ride is very bumpy and uncomfortable. Also very crowded at the falls. Needs better infrastructure.', 'en', 3.5, '2026-08-12', 'neutral', 0.20, 0.87),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000004', 'दूधसागर जलप्रपात अविश्वसनीय रूप से सुंदर है! बारिश के मौसम में यहां आना सबसे अच्छा है। जीप सफारी रोमांचक है।', 'hi', 5.0, '2026-07-15', 'positive', 0.91, 0.91),

-- Divar Island (EMERGING) Reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'What a hidden gem! Divar Island is everything Goa used to be — peaceful, unspoiled, authentic. The ferry ride is charming. The old Portuguese churches are beautiful. No tourists, no noise.', 'en', 5.0, '2026-08-05', 'positive', 0.96, 0.94),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'Discovered this island by accident and it became the highlight of our trip! Absolutely no commercialization. Quiet lanes, beautiful views, friendly locals. This is the real Goa.', 'en', 5.0, '2026-08-10', 'positive', 0.94, 0.93),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'दिवार आयलंड गोव्यातलं एक अनमोल रत्न आहे. इथली शांतता अनुभवण्यासारखी आहे. पोर्तुगीज चर्च खूप सुंदर आहेत. पर्यटकांची गर्दी अजिबात नाही.', 'mr', 5.0, '2026-08-08', 'positive', 0.92, 0.89),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'दिवार द्वीप वाकई अद्भुत है! यहां का शांत वातावरण, पुराने चर्च, हरे-भरे खेत — सब कुछ बहुत सुंदर। कम लोगों को पता है इसलिए भीड़ नहीं है।', 'hi', 5.0, '2026-08-12', 'positive', 0.93, 0.90),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'Best kept secret in Goa. We rented bicycles and explored the entire island. The paddy fields, old mansions, and churches make it feel like stepping back in time. Highly recommended.', 'en', 5.0, '2026-07-28', 'positive', 0.91, 0.93),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000008', 'Ferry to Divar Island costs just ₹10. The island is untouched and beautiful. Perfect for cycling. No restaurants but local homes sometimes sell food. Carry water.', 'en', 4.5, '2026-07-20', 'positive', 0.80, 0.88),

-- Arambol Sweet Water Lake (EMERGING) Reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000009', 'Found this magical freshwater lake behind Arambol Beach. You have to hike through the jungle to reach it. So worth the effort! The water is crystal clear and surrounded by cliffs.', 'en', 5.0, '2026-08-01', 'positive', 0.93, 0.92),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000009', 'A beautiful surprise! The sweet water lake at Arambol is perfect for a refreshing swim after the beach. Fewer crowds and a very hippie, peaceful atmosphere.', 'en', 4.5, '2026-07-25', 'positive', 0.86, 0.90),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000009', 'अरम्बोल में यह मीठे पानी की झील बहुत शांत और सुंदर है। जंगल से होकर चलना पड़ता है लेकिन वहां पहुंचकर मन प्रसन्न हो जाता है।', 'hi', 5.0, '2026-08-06', 'positive', 0.88, 0.87),

-- Palolem Beach Reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 'Palolem is absolutely gorgeous. The crescent-shaped beach, calm turquoise water, and relaxed vibe make it the best beach in Goa. Way better than Baga or Calangute.', 'en', 5.0, '2026-07-12', 'positive', 0.94, 0.95),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 'South Goa is magical and Palolem is its crown jewel. The silent noise party concept is genius. Great food, great people, great vibes. Will definitely come back.', 'en', 5.0, '2026-06-30', 'positive', 0.90, 0.93),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000007', 'पालोलेम बीच गोव्यातला सर्वात सुंदर बीच आहे. शांत पाणी, कमी गर्दी, आणि सुंदर निसर्ग. साउथ गोवा नक्की बघा.', 'mr', 5.0, '2026-07-18', 'positive', 0.91, 0.88),

-- Fontainhas Reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000012', 'Fontainhas is a photographer''s dream! The colorful Portuguese-era houses, narrow lanes, art galleries — it''s like a little piece of Portugal in India.', 'en', 5.0, '2026-07-22', 'positive', 0.92, 0.94),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000012', 'Loved walking through this old quarter. Amazing street art, cute cafes, and beautiful architecture. A side of Goa most tourists miss completely.', 'en', 4.5, '2026-08-01', 'positive', 0.85, 0.91),

-- Spice Plantation Reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000010', 'The spice plantation tour was incredibly informative and fun! We learned about so many spices. The traditional Goan lunch included in the tour was absolutely delicious.', 'en', 4.5, '2026-07-05', 'positive', 0.87, 0.92),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000010', 'मसालों की बागवानी का दौरा बहुत ज्ञानवर्धक था। इलायची, काली मिर्च, वैनिला के पेड़ देखे। पारंपरिक दोपहर का भोजन लाजवाब था।', 'hi', 4.5, '2026-07-10', 'positive', 0.84, 0.88),

-- Fort Aguada Reviews
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', 'Fort Aguada offers incredible panoramic views. The lighthouse is beautiful and well-preserved. Great place for sunset photography. Parking is limited though.', 'en', 4.5, '2026-07-15', 'positive', 0.82, 0.90),
('d1000000-0000-0000-0000-000000000001', 'a1000000-0000-0000-0000-000000000005', 'Historical fort with amazing views. But the walk up in the afternoon heat is brutal. Carry water and go early morning or late afternoon. Transport access could be better.', 'en', 3.5, '2026-08-05', 'neutral', 0.25, 0.86),

-- ============================================================
-- REVIEWS — MUMBAI
-- ============================================================
('d1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000001', 'Gateway of India is iconic! The architecture is beautiful and the location overlooking the harbor is perfect. Evening time is best for visiting. Lots of street food nearby.', 'en', 4.5, '2026-07-10', 'positive', 0.85, 0.92),
('d1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000001', 'गेटवे ऑफ इंडिया मुंबई का गौरव है। शाम को यहां आना सबसे अच्छा है। लेकिन भीड़ बहुत होती है और सुरक्षा चेकिंग में समय लगता है।', 'hi', 4.0, '2026-07-15', 'positive', 0.68, 0.87),
('d1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000001', 'Very crowded and touristy. The touts and photographers are very aggressive. The area is not very clean. Still worth visiting once for the architecture.', 'en', 3.0, '2026-08-02', 'neutral', -0.15, 0.85),
('d1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'Marine Drive at sunset is pure magic. The best free experience in Mumbai. Walking along the promenade with the sea breeze is therapeutic.', 'en', 5.0, '2026-07-20', 'positive', 0.93, 0.95),
('d1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000002', 'मरीन ड्राइव मुंबई की जान है। यहां बैठकर समुद्र देखना बहुत सुकून देता है। शाम को नेकलेस जैसी लाइट्स का नजारा अद्भुत है।', 'hi', 5.0, '2026-06-28', 'positive', 0.91, 0.93),
('d1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000005', 'Juhu Beach is not great for swimming but the street food scene is incredible. Pav bhaji, bhel puri, and vada pav from the beach stalls are amazing. Very crowded on weekends.', 'en', 3.5, '2026-07-25', 'positive', 0.55, 0.87),
('d1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000005', 'जुहू बीच पर गंदगी बहुत है। पानी में जाना ठीक नहीं है। लेकिन यहां का स्ट्रीट फूड लाजवाब है। शाम को घूमने लायक जगह।', 'hi', 3.0, '2026-08-08', 'neutral', -0.10, 0.84),
('d1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000007', 'The Dharavi art and pottery tour was eye-opening. The craftsmanship is incredible. Our guide was knowledgeable and respectful. The tour directly benefits the community. Highly recommended.', 'en', 5.0, '2026-08-05', 'positive', 0.95, 0.94),
('d1000000-0000-0000-0000-000000000002', 'a2000000-0000-0000-0000-000000000003', 'Elephanta Caves are stunning. The boat ride from Gateway of India is enjoyable. The cave sculptures are magnificent. But the stairs to reach the caves are steep and tiring.', 'en', 4.0, '2026-07-18', 'positive', 0.72, 0.89),

-- ============================================================
-- REVIEWS — JAIPUR
-- ============================================================
('d1000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000001', 'Amber Fort is one of the most magnificent forts I have ever seen. The Sheesh Mahal (mirror palace) is jaw-dropping. The elephant ride up is controversial but the view is spectacular.', 'en', 5.0, '2026-07-08', 'positive', 0.92, 0.94),
('d1000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000001', 'आमेर किला राजस्थान की शान है। यहां की शीश महल अद्भुत है। गाइड लेना जरूरी है क्योंकि इतिहास बहुत समृद्ध है।', 'hi', 5.0, '2026-07-12', 'positive', 0.89, 0.91),
('d1000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000001', 'Beautiful fort but very crowded. The ticket counter has extremely long queues. No proper shade while waiting. Summer heat makes it quite challenging.', 'en', 3.5, '2026-06-25', 'neutral', 0.18, 0.86),
('d1000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000002', 'Hawa Mahal is an Instagram dream! The facade is incredible. Inside is a bit underwhelming but the rooftop view is worth it. Visit early morning for best photos.', 'en', 4.0, '2026-07-20', 'positive', 0.75, 0.90),
('d1000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000002', 'हवा महल खूबसूरत है लेकिन बाहर ट्रैफिक बहुत है। अंदर से ज्यादा कुछ देखने लायक नहीं है। फोटो के लिए सुबह जाएं।', 'hi', 3.5, '2026-08-01', 'neutral', 0.22, 0.85),
('d1000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000005', 'Nahargarh Fort sunset is absolutely magical. The panoramic view of Jaipur city from the top is breathtaking. The café at the fort serves decent food. Worth the drive up.', 'en', 4.5, '2026-07-28', 'positive', 0.88, 0.92),
('d1000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000006', 'Johari Bazaar is paradise for jewelry lovers! The silver and gemstone work is exquisite. Bargaining is essential. Watch out for imitation stones though.', 'en', 4.0, '2026-08-05', 'positive', 0.72, 0.88),
('d1000000-0000-0000-0000-000000000003', 'a3000000-0000-0000-0000-000000000007', 'Patrika Gate is stunning and a great photo spot. The architecture represents all of Rajasthan. Completely free and less crowded than other monuments. New favorite spot in Jaipur!', 'en', 5.0, '2026-08-10', 'positive', 0.91, 0.93),

-- ============================================================
-- REVIEWS — KERALA
-- ============================================================
('d1000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000001', 'The Alleppey houseboat experience is simply magical. Floating through the backwaters, watching village life, eating fresh Kerala fish curry on the boat — unforgettable!', 'en', 5.0, '2026-07-05', 'positive', 0.96, 0.96),
('d1000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000001', 'Backwaters are beautiful but some houseboats are poorly maintained. Water quality in certain areas is concerning. The premium houseboats are worth the extra cost.', 'en', 3.5, '2026-07-20', 'neutral', 0.28, 0.87),
('d1000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000001', 'केरल के बैकवाटर्स पर हाउसबोट का अनुभव जीवन में एक बार जरूर लेना चाहिए। प्रकृति का सौंदर्य अद्भुत है। केरल का खाना भी लाजवाब।', 'hi', 5.0, '2026-06-28', 'positive', 0.93, 0.91),
('d1000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000002', 'Munnar tea gardens are heaven on earth. The rolling green hills, the cool weather, the misty mornings — paradise. Tea tasting is a must-do. The drive to Munnar is also scenic.', 'en', 5.0, '2026-07-15', 'positive', 0.94, 0.95),
('d1000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000002', 'मुन्नार चहा बागान खूपच सुंदर आहेत. थंड हवामान, धुक्याने वेढलेले डोंगर — स्वर्गच आहे. चहा चाखणे नक्की करा.', 'mr', 5.0, '2026-07-22', 'positive', 0.92, 0.88),
('d1000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000003', 'Fort Kochi is charming. The Chinese fishing nets at sunset, the art cafes, the colonial streets — it has a unique character. The Kochi Biennale arts festival is world-class.', 'en', 4.5, '2026-08-01', 'positive', 0.87, 0.92),
('d1000000-0000-0000-0000-000000000004', 'a4000000-0000-0000-0000-000000000005', 'Varkala is the most beautiful beach in Kerala. The cliff-top view is spectacular. Much quieter than beaches in Goa. Great yoga retreats and Ayurvedic centers nearby.', 'en', 5.0, '2026-07-10', 'positive', 0.92, 0.93),

-- ============================================================
-- REVIEWS — DELHI
-- ============================================================
('d1000000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000001', 'Red Fort is a must-see but honestly the maintenance could be better. Some areas are in poor condition. The light and sound show in the evening is good. Very crowded on weekends.', 'en', 3.5, '2026-07-10', 'neutral', 0.22, 0.86),
('d1000000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000001', 'लाल किला भारत की शान है। यहां की वास्तुकला अद्भुत है। लेकिन रखरखाव और बेहतर हो सकता है। गाइड लेकर जाएं तो ज्यादा मजा आएगा।', 'hi', 4.0, '2026-07-15', 'positive', 0.65, 0.88),
('d1000000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000002', 'Qutub Minar is stunning! The iron pillar that never rusts is fascinating. The complex is well-maintained and has good facilities. Morning visit recommended to avoid heat and crowds.', 'en', 4.5, '2026-08-05', 'positive', 0.86, 0.92),
('d1000000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000004', 'Humayun''s Tomb is more beautiful than I expected. The gardens are perfectly manicured. Less crowded than Taj Mahal but equally magnificent. The architectural details are incredible.', 'en', 5.0, '2026-07-28', 'positive', 0.94, 0.95),
('d1000000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000005', 'Chandni Chowk is chaos but the best kind! The street food is phenomenal — paranthe wali gali, jalebi, chole bhature. Come with an empty stomach. Very crowded and noisy.', 'en', 4.0, '2026-07-20', 'positive', 0.70, 0.88),
('d1000000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000005', 'चांदनी चौक का खाना लाजवाब है! पराठे वाली गली, जलेबी, कबाब — सब कुछ मिलता है। लेकिन बहुत भीड़भाड़ और गंदगी है।', 'hi', 3.5, '2026-08-01', 'positive', 0.52, 0.85),
('d1000000-0000-0000-0000-000000000005', 'a5000000-0000-0000-0000-000000000006', 'The Lodhi Art District murals are incredible! Free to visit and every wall has a story. Amazing work by Indian and international artists. Great for a morning walk.', 'en', 4.5, '2026-08-10', 'positive', 0.88, 0.92),

-- ============================================================
-- REVIEWS — AGRA
-- ============================================================
('d1000000-0000-0000-0000-000000000006', 'a6000000-0000-0000-0000-000000000001', 'The Taj Mahal is beyond words. No photo can do justice to its beauty. The white marble glows differently at every hour. At sunrise, it is absolutely divine. Worth every minute of the visit.', 'en', 5.0, '2026-07-05', 'positive', 0.97, 0.97),
('d1000000-0000-0000-0000-000000000006', 'a6000000-0000-0000-0000-000000000001', 'ताजमहल दुनिया का सबसे सुंदर स्मारक है। सूर्योदय के समय इसे देखना स्वर्ग जैसा अनुभव है। लेकिन भीड़ बहुत होती है और आसपास का क्षेत्र गंदा है।', 'hi', 4.5, '2026-07-12', 'positive', 0.80, 0.90),
('d1000000-0000-0000-0000-000000000006', 'a6000000-0000-0000-0000-000000000001', 'The Taj Mahal itself is perfect but the surrounding area is terrible. Aggressive touts, overpriced everything, pollution, and terrible traffic. The city of Agra lets the Taj down.', 'en', 3.5, '2026-08-02', 'neutral', 0.12, 0.87),
('d1000000-0000-0000-0000-000000000006', 'a6000000-0000-0000-0000-000000000001', 'ताज महल अप्रतिम आहे. पण आजूबाजूचा परिसर खूप गलिच्छ आहे. ट्रॅफिक, प्रदूषण आणि तिकीट काउंटरवर लांबच लांब रांग. तरीही एकदा भेट द्यायलाच हवी.', 'mr', 4.0, '2026-07-25', 'positive', 0.55, 0.85),
('d1000000-0000-0000-0000-000000000006', 'a6000000-0000-0000-0000-000000000002', 'Agra Fort is massive and impressive. The view of the Taj Mahal from Musamman Burj is beautiful. Good audio guide available. Allow at least 3 hours.', 'en', 4.5, '2026-07-18', 'positive', 0.84, 0.91),
('d1000000-0000-0000-0000-000000000006', 'a6000000-0000-0000-0000-000000000004', 'Mehtab Bagh at sunset — the most beautiful view of the Taj Mahal! Less crowded than the Taj itself. Perfect for photography. A hidden gem that most tourists miss.', 'en', 4.5, '2026-08-08', 'positive', 0.89, 0.93),

-- ============================================================
-- More Goa reviews to bulk up the primary demo destination
-- ============================================================
-- General Goa reviews (not tied to specific attraction)
('d1000000-0000-0000-0000-000000000001', NULL, 'Goa is paradise on earth! Beautiful beaches, amazing food, incredible nightlife, friendly people. We spent 5 days and it was not enough. Coming back next year for sure.', 'en', 5.0, '2026-07-01', 'positive', 0.93, 0.94),
('d1000000-0000-0000-0000-000000000001', NULL, 'Goa disappointed me. Beaches are dirty, too many tourists, overpriced hotels, traffic jams everywhere. Not what it used to be 10 years ago. South Goa is slightly better.', 'en', 2.5, '2026-08-15', 'negative', -0.68, 0.89),
('d1000000-0000-0000-0000-000000000001', NULL, 'गोवा में खाना बहुत बढ़िया है! सीफूड, विंदालू, बेबिंका — सब कुछ लाजवाब। बीच साइड शैक्स में खाने का अलग ही मजा है।', 'hi', 4.5, '2026-07-08', 'positive', 0.86, 0.90),
('d1000000-0000-0000-0000-000000000001', NULL, 'गोव्याचे समुद्रकिनारे खूप सुंदर आहेत पण स्वच्छतेची समस्या आहे. प्लास्टिक कचरा सगळीकडे दिसतो. पार्किंगची व्यवस्था सुधारायला हवी.', 'mr', 3.0, '2026-08-12', 'neutral', -0.20, 0.85),
('d1000000-0000-0000-0000-000000000001', NULL, 'The traffic in North Goa is horrible during peak season. It took us 2 hours to travel 10 km. Roads are narrow and parking is a nightmare. Public transport is almost non-existent.', 'en', 2.0, '2026-08-10', 'negative', -0.78, 0.91),
('d1000000-0000-0000-0000-000000000001', NULL, 'Loved the local Goan culture! The Portuguese heritage, old churches, local markets, traditional Goan breakfast — all amazing. Skip the tourist beaches and explore the real Goa.', 'en', 4.5, '2026-07-20', 'positive', 0.84, 0.91),
('d1000000-0000-0000-0000-000000000001', NULL, 'கோவா மிகவும் அழகான இடம். கடற்கரைகள் அற்புதமானவை. உணவு சுவையானது. ஆனால் விலைகள் அதிகமாக உள்ளன.', 'ta', 4.0, '2026-07-15', 'positive', 0.65, 0.82),
('d1000000-0000-0000-0000-000000000001', NULL, 'గోవా బీచ్‌లు చాలా బాగున్నాయి. సీఫుడ్ అద్భుతంగా ఉంది. కానీ రద్దీ చాలా ఎక్కువ. దక్షిణ గోవా ఉత్తరం కంటే మంచిది.', 'te', 4.0, '2026-07-28', 'positive', 0.60, 0.80);

-- ============================================================
-- REVIEW ASPECTS (aspect-based sentiment for key reviews)
-- ============================================================
-- We'll insert aspects linked to destination/attraction patterns rather than individual review IDs
-- for simplicity in the seed. The backend will query these for aggregate views.

-- Create a function to insert aspects for existing reviews
DO $$
DECLARE
    r RECORD;
BEGIN
    -- For each review with known parking complaints
    FOR r IN SELECT id FROM reviews WHERE original_text ILIKE '%parking%' AND sentiment IN ('negative', 'neutral')
    LOOP
        INSERT INTO review_aspects (review_id, aspect, sentiment, sentiment_score, confidence, snippet)
        VALUES (r.id, 'parking', 'negative', -0.80, 0.90, 'Parking issues mentioned');
    END LOOP;

    -- Cleanliness negative
    FOR r IN SELECT id FROM reviews WHERE (original_text ILIKE '%dirty%' OR original_text ILIKE '%clean%' OR original_text ILIKE '%garbage%' OR original_text ILIKE '%waste%' OR original_text ILIKE '%litter%' OR original_text ILIKE '%गंदगी%' OR original_text ILIKE '%स्वच्छता%' OR original_text ILIKE '%गलिच्छ%' OR original_text ILIKE '%कचरा%') AND sentiment IN ('negative', 'neutral')
    LOOP
        INSERT INTO review_aspects (review_id, aspect, sentiment, sentiment_score, confidence, snippet)
        VALUES (r.id, 'cleanliness', 'negative', -0.70, 0.88, 'Cleanliness issues mentioned');
    END LOOP;

    -- Food positive
    FOR r IN SELECT id FROM reviews WHERE (original_text ILIKE '%food%' OR original_text ILIKE '%seafood%' OR original_text ILIKE '%खाना%' OR original_text ILIKE '%खाद्य%' OR original_text ILIKE '%lunch%' OR original_text ILIKE '%restaurant%' OR original_text ILIKE '%delicious%' OR original_text ILIKE '%स्वादिष्ट%' OR original_text ILIKE '%उणवु%') AND sentiment = 'positive'
    LOOP
        INSERT INTO review_aspects (review_id, aspect, sentiment, sentiment_score, confidence, snippet)
        VALUES (r.id, 'food', 'positive', 0.82, 0.89, 'Positive food mention');
    END LOOP;

    -- Crowd negative
    FOR r IN SELECT id FROM reviews WHERE (original_text ILIKE '%crowd%' OR original_text ILIKE '%overcrowd%' OR original_text ILIKE '%भीड़%' OR original_text ILIKE '%गर्दी%' OR original_text ILIKE '%கூட்டம்%' OR original_text ILIKE '%రద్దీ%') AND sentiment IN ('negative', 'neutral')
    LOOP
        INSERT INTO review_aspects (review_id, aspect, sentiment, sentiment_score, confidence, snippet)
        VALUES (r.id, 'crowd', 'negative', -0.65, 0.87, 'Crowding complaint');
    END LOOP;

    -- Water sports / activities positive
    FOR r IN SELECT id FROM reviews WHERE (original_text ILIKE '%water sport%' OR original_text ILIKE '%parasailing%' OR original_text ILIKE '%jet ski%' OR original_text ILIKE '%वॉटर स्पोर्ट%') AND sentiment = 'positive'
    LOOP
        INSERT INTO review_aspects (review_id, aspect, sentiment, sentiment_score, confidence, snippet)
        VALUES (r.id, 'activities', 'positive', 0.85, 0.90, 'Water sports enjoyed');
    END LOOP;

    -- Transport negative
    FOR r IN SELECT id FROM reviews WHERE (original_text ILIKE '%transport%' OR original_text ILIKE '%traffic%' OR original_text ILIKE '%road%' OR original_text ILIKE '%ट्रैफिक%') AND sentiment IN ('negative', 'neutral')
    LOOP
        INSERT INTO review_aspects (review_id, aspect, sentiment, sentiment_score, confidence, snippet)
        VALUES (r.id, 'transport', 'negative', -0.72, 0.86, 'Transport issues');
    END LOOP;

    -- Architecture / Heritage positive
    FOR r IN SELECT id FROM reviews WHERE (original_text ILIKE '%architecture%' OR original_text ILIKE '%heritage%' OR original_text ILIKE '%fort%' OR original_text ILIKE '%palace%' OR original_text ILIKE '%temple%' OR original_text ILIKE '%वास्तुकला%') AND sentiment = 'positive'
    LOOP
        INSERT INTO review_aspects (review_id, aspect, sentiment, sentiment_score, confidence, snippet)
        VALUES (r.id, 'heritage', 'positive', 0.88, 0.91, 'Heritage appreciation');
    END LOOP;

    -- Nature / Scenery positive
    FOR r IN SELECT id FROM reviews WHERE (original_text ILIKE '%beautiful%' OR original_text ILIKE '%stunning%' OR original_text ILIKE '%gorgeous%' OR original_text ILIKE '%paradise%' OR original_text ILIKE '%सुंदर%' OR original_text ILIKE '%अद्भुत%') AND sentiment = 'positive'
    LOOP
        INSERT INTO review_aspects (review_id, aspect, sentiment, sentiment_score, confidence, snippet)
        VALUES (r.id, 'scenery', 'positive', 0.87, 0.91, 'Natural beauty appreciated');
    END LOOP;

    -- Pricing negative
    FOR r IN SELECT id FROM reviews WHERE (original_text ILIKE '%overpriced%' OR original_text ILIKE '%expensive%' OR original_text ILIKE '%price%' OR original_text ILIKE '%विलैकள்%' OR original_text ILIKE '%महंगा%') AND sentiment IN ('negative', 'neutral')
    LOOP
        INSERT INTO review_aspects (review_id, aspect, sentiment, sentiment_score, confidence, snippet)
        VALUES (r.id, 'pricing', 'negative', -0.60, 0.85, 'Pricing complaint');
    END LOOP;

    -- Staff / Guide positive
    FOR r IN SELECT id FROM reviews WHERE (original_text ILIKE '%guide%' OR original_text ILIKE '%staff%' OR original_text ILIKE '%friendly%' OR original_text ILIKE '%helpful%') AND sentiment = 'positive'
    LOOP
        INSERT INTO review_aspects (review_id, aspect, sentiment, sentiment_score, confidence, snippet)
        VALUES (r.id, 'staff', 'positive', 0.80, 0.88, 'Positive staff mention');
    END LOOP;
END $$;

-- ============================================================
-- PROBLEM CLUSTERS — GOA
-- ============================================================
INSERT INTO problem_clusters (destination_id, name, category, mention_count, mention_pct, severity, trend, trend_pct, representative_reviews, first_detected) VALUES
('d1000000-0000-0000-0000-000000000001', 'Parking Unavailability', 'parking', 342, 2.74, 'high', 'increasing', 23.0, ARRAY['Finding parking was impossible.', 'There is absolutely nowhere to park.', 'Parking facilities are terrible.', 'Had to walk 2km because no parking.', 'Parking ke liye jagah nahi mili.'], '2026-01-15'),
('d1000000-0000-0000-0000-000000000001', 'Beach Overcrowding', 'crowd', 271, 2.17, 'high', 'increasing', 19.0, ARRAY['Way too crowded especially on weekends.', 'The crowd after 11 AM is unbearable.', 'Beach pe itni bheed thi ki chalna mushkil tha.', 'Khup gardi aahe ithe.'], '2026-01-10'),
('d1000000-0000-0000-0000-000000000001', 'Beach Cleanliness', 'cleanliness', 184, 1.47, 'medium', 'stable', 5.0, ARRAY['The beach is dirty in some areas with plastic waste.', 'Plastic bottles and food wrappers everywhere.', 'Gandagi bahut faili hui thi.', 'Swachhatachi samasya aahe.'], '2026-02-01'),
('d1000000-0000-0000-0000-000000000001', 'Traffic Congestion', 'transport', 139, 1.11, 'high', 'increasing', 15.0, ARRAY['Traffic in North Goa is horrible.', 'It took 2 hours to travel 10 km.', 'Roads are narrow and dangerous.', 'Public transport is almost non-existent.'], '2026-01-20'),
('d1000000-0000-0000-0000-000000000001', 'Aggressive Hawkers', 'safety', 92, 0.74, 'medium', 'stable', 3.0, ARRAY['Hawkers are very aggressive.', 'The touts won''t leave you alone.', 'Tourist ko pareshaan karne wale log bahut hain.'], '2026-03-01'),
('d1000000-0000-0000-0000-000000000001', 'Overpriced Services', 'pricing', 78, 0.62, 'medium', 'increasing', 12.0, ARRAY['Everything is overpriced during peak season.', 'Hotels charge double during holidays.', 'Prices are unreasonable for what you get.'], '2026-02-15');

-- PROBLEM CLUSTERS — MUMBAI
INSERT INTO problem_clusters (destination_id, name, category, mention_count, mention_pct, severity, trend, trend_pct, representative_reviews, first_detected) VALUES
('d1000000-0000-0000-0000-000000000002', 'Overcrowding at Landmarks', 'crowd', 312, 3.49, 'high', 'stable', 2.0, ARRAY['Very crowded and touristy.', 'Weekend crowd is unbearable.'], '2026-01-10'),
('d1000000-0000-0000-0000-000000000002', 'Aggressive Touts', 'safety', 187, 2.09, 'medium', 'increasing', 8.0, ARRAY['Touts and photographers are very aggressive.', 'Can''t walk 10 steps without someone selling.'], '2026-02-01'),
('d1000000-0000-0000-0000-000000000002', 'Beach Pollution', 'cleanliness', 156, 1.75, 'high', 'decreasing', -8.0, ARRAY['Juhu Beach is not great for swimming.', 'The water quality is concerning.', 'Pani mein jaana theek nahi hai.'], '2026-01-15');

-- PROBLEM CLUSTERS — DELHI
INSERT INTO problem_clusters (destination_id, name, category, mention_count, mention_pct, severity, trend, trend_pct, representative_reviews, first_detected) VALUES
('d1000000-0000-0000-0000-000000000005', 'Air Pollution', 'environment', 423, 4.13, 'critical', 'stable', 1.0, ARRAY['The pollution is terrible.', 'Could barely breathe some days.', 'Smog was so thick you could not see India Gate.'], '2026-01-01'),
('d1000000-0000-0000-0000-000000000005', 'Monument Maintenance', 'infrastructure', 198, 1.93, 'medium', 'decreasing', -5.0, ARRAY['Maintenance could be better.', 'Some areas are in poor condition.', 'Rakhrakaav aur behtar ho sakta hai.'], '2026-02-01'),
('d1000000-0000-0000-0000-000000000005', 'Traffic & Transport', 'transport', 287, 2.80, 'high', 'increasing', 11.0, ARRAY['Traffic is insane during rush hour.', 'Auto rickshaws refuse to go by meter.', 'Metro is good but last mile connectivity is poor.'], '2026-01-15');

-- PROBLEM CLUSTERS — AGRA
INSERT INTO problem_clusters (destination_id, name, category, mention_count, mention_pct, severity, trend, trend_pct, representative_reviews, first_detected) VALUES
('d1000000-0000-0000-0000-000000000006', 'Surroundings of Taj Mahal', 'cleanliness', 234, 3.47, 'high', 'stable', 2.0, ARRAY['The surrounding area is terrible.', 'City of Agra lets the Taj down.', 'Aas paas ka ilaka ganda hai.'], '2026-01-10'),
('d1000000-0000-0000-0000-000000000006', 'Aggressive Touts & Scams', 'safety', 189, 2.80, 'high', 'increasing', 14.0, ARRAY['Aggressive touts everywhere.', 'Watch out for scammers near monuments.', 'Overpriced everything around Taj.'], '2026-01-15'),
('d1000000-0000-0000-0000-000000000006', 'Long Ticket Queues', 'infrastructure', 156, 2.31, 'medium', 'stable', 0.0, ARRAY['Ticket counter has extremely long queues.', 'Waited 45 minutes just for tickets.'], '2026-02-01');

-- ============================================================
-- SERVICE QUALITY — GOA
-- ============================================================
INSERT INTO service_quality (destination_id, category, score, review_count, trend, trend_pct) VALUES
('d1000000-0000-0000-0000-000000000001', 'staff', 4.20, 1842, 'increasing', 5.0),
('d1000000-0000-0000-0000-000000000001', 'food', 4.35, 3241, 'increasing', 14.0),
('d1000000-0000-0000-0000-000000000001', 'cleanliness', 3.40, 2876, 'stable', 2.0),
('d1000000-0000-0000-0000-000000000001', 'transport', 2.90, 1543, 'decreasing', -8.0),
('d1000000-0000-0000-0000-000000000001', 'accommodation', 3.85, 2134, 'increasing', 6.0),
('d1000000-0000-0000-0000-000000000001', 'value_for_money', 3.60, 1876, 'decreasing', -4.0),
('d1000000-0000-0000-0000-000000000001', 'safety', 3.75, 987, 'stable', 1.0),
('d1000000-0000-0000-0000-000000000001', 'attractions', 4.30, 3456, 'increasing', 8.0),
('d1000000-0000-0000-0000-000000000001', 'nightlife', 4.45, 1234, 'stable', 0.0),
('d1000000-0000-0000-0000-000000000001', 'accessibility', 3.20, 876, 'increasing', 3.0);

-- SERVICE QUALITY — OTHER DESTINATIONS
INSERT INTO service_quality (destination_id, category, score, review_count, trend, trend_pct) VALUES
('d1000000-0000-0000-0000-000000000002', 'staff', 3.90, 1234, 'stable', 1.0),
('d1000000-0000-0000-0000-000000000002', 'food', 4.50, 2876, 'increasing', 10.0),
('d1000000-0000-0000-0000-000000000002', 'cleanliness', 3.20, 1987, 'increasing', 5.0),
('d1000000-0000-0000-0000-000000000002', 'transport', 3.60, 1543, 'stable', 0.0),
('d1000000-0000-0000-0000-000000000003', 'staff', 4.10, 1543, 'increasing', 7.0),
('d1000000-0000-0000-0000-000000000003', 'food', 4.20, 1876, 'stable', 2.0),
('d1000000-0000-0000-0000-000000000003', 'cleanliness', 3.80, 1234, 'increasing', 4.0),
('d1000000-0000-0000-0000-000000000003', 'heritage', 4.60, 2876, 'stable', 1.0),
('d1000000-0000-0000-0000-000000000004', 'staff', 4.40, 1234, 'stable', 2.0),
('d1000000-0000-0000-0000-000000000004', 'food', 4.55, 1876, 'increasing', 8.0),
('d1000000-0000-0000-0000-000000000004', 'cleanliness', 4.20, 1543, 'stable', 0.0),
('d1000000-0000-0000-0000-000000000004', 'nature', 4.70, 2341, 'stable', 1.0),
('d1000000-0000-0000-0000-000000000005', 'staff', 3.50, 1234, 'stable', 0.0),
('d1000000-0000-0000-0000-000000000005', 'food', 4.40, 2134, 'increasing', 6.0),
('d1000000-0000-0000-0000-000000000005', 'cleanliness', 3.00, 1876, 'decreasing', -3.0),
('d1000000-0000-0000-0000-000000000005', 'transport', 3.40, 1543, 'stable', 2.0),
('d1000000-0000-0000-0000-000000000006', 'staff', 3.60, 876, 'stable', 1.0),
('d1000000-0000-0000-0000-000000000006', 'food', 3.80, 1234, 'increasing', 5.0),
('d1000000-0000-0000-0000-000000000006', 'cleanliness', 2.80, 1543, 'stable', -2.0),
('d1000000-0000-0000-0000-000000000006', 'heritage', 4.50, 2876, 'stable', 0.0);

-- ============================================================
-- SERVICE QUALITY HISTORY (monthly trends for Goa)
-- ============================================================
INSERT INTO service_quality_history (destination_id, category, score, month, review_count) VALUES
('d1000000-0000-0000-0000-000000000001', 'food', 4.10, '2026-01-01', 234),
('d1000000-0000-0000-0000-000000000001', 'food', 4.15, '2026-02-01', 287),
('d1000000-0000-0000-0000-000000000001', 'food', 4.20, '2026-03-01', 312),
('d1000000-0000-0000-0000-000000000001', 'food', 4.22, '2026-04-01', 289),
('d1000000-0000-0000-0000-000000000001', 'food', 4.28, '2026-05-01', 345),
('d1000000-0000-0000-0000-000000000001', 'food', 4.30, '2026-06-01', 398),
('d1000000-0000-0000-0000-000000000001', 'food', 4.35, '2026-07-01', 421),
('d1000000-0000-0000-0000-000000000001', 'cleanliness', 3.10, '2026-01-01', 198),
('d1000000-0000-0000-0000-000000000001', 'cleanliness', 3.15, '2026-02-01', 223),
('d1000000-0000-0000-0000-000000000001', 'cleanliness', 3.25, '2026-03-01', 245),
('d1000000-0000-0000-0000-000000000001', 'cleanliness', 3.30, '2026-04-01', 212),
('d1000000-0000-0000-0000-000000000001', 'cleanliness', 3.32, '2026-05-01', 267),
('d1000000-0000-0000-0000-000000000001', 'cleanliness', 3.35, '2026-06-01', 289),
('d1000000-0000-0000-0000-000000000001', 'cleanliness', 3.40, '2026-07-01', 312),
('d1000000-0000-0000-0000-000000000001', 'transport', 3.20, '2026-01-01', 143),
('d1000000-0000-0000-0000-000000000001', 'transport', 3.15, '2026-02-01', 156),
('d1000000-0000-0000-0000-000000000001', 'transport', 3.10, '2026-03-01', 167),
('d1000000-0000-0000-0000-000000000001', 'transport', 3.05, '2026-04-01', 178),
('d1000000-0000-0000-0000-000000000001', 'transport', 3.00, '2026-05-01', 189),
('d1000000-0000-0000-0000-000000000001', 'transport', 2.95, '2026-06-01', 198),
('d1000000-0000-0000-0000-000000000001', 'transport', 2.90, '2026-07-01', 210),
('d1000000-0000-0000-0000-000000000001', 'staff', 4.00, '2026-01-01', 176),
('d1000000-0000-0000-0000-000000000001', 'staff', 4.05, '2026-02-01', 189),
('d1000000-0000-0000-0000-000000000001', 'staff', 4.08, '2026-03-01', 198),
('d1000000-0000-0000-0000-000000000001', 'staff', 4.10, '2026-04-01', 212),
('d1000000-0000-0000-0000-000000000001', 'staff', 4.12, '2026-05-01', 223),
('d1000000-0000-0000-0000-000000000001', 'staff', 4.18, '2026-06-01', 234),
('d1000000-0000-0000-0000-000000000001', 'staff', 4.20, '2026-07-01', 245);

-- ============================================================
-- EMERGING ATTRACTIONS — GOA
-- ============================================================
INSERT INTO emerging_attractions (attraction_id, destination_id, emergence_score, mention_growth_pct, previous_period_mentions, current_period_mentions, positive_sentiment_pct, reasons) VALUES
('a1000000-0000-0000-0000-000000000008', 'd1000000-0000-0000-0000-000000000001', 87.5, 212.0, 41, 128, 93.0, ARRAY['Completely untouched by commercialization', 'Authentic Portuguese heritage', 'No tourist crowds', 'Beautiful paddy fields and old mansions', 'Charming ferry ride experience']),
('a1000000-0000-0000-0000-000000000009', 'd1000000-0000-0000-0000-000000000001', 78.2, 156.0, 32, 82, 91.0, ARRAY['Hidden freshwater lake behind beach', 'Crystal clear water for swimming', 'Peaceful hippie atmosphere', 'Scenic jungle hike to reach', 'Less crowded alternative']),
('a1000000-0000-0000-0000-000000000011', 'd1000000-0000-0000-0000-000000000001', 82.3, 183.0, 24, 68, 92.0, ARRAY['Pristine mangrove ecosystem', 'Excellent bird watching', 'Kayaking through mangroves', 'Dr. Salim Ali Bird Sanctuary', 'Eco-tourism experience']);

-- ============================================================
-- CROWD HISTORICAL DATA — GOA (Baga Beach as primary example)
-- ============================================================
-- Generate crowd data for different times of day
INSERT INTO crowd_historical (attraction_id, date, hour, day_of_week, month, is_holiday, is_weekend, visitor_count, crowd_level, weather, temperature) VALUES
-- Weekday pattern
('a1000000-0000-0000-0000-000000000001', '2026-07-14', 6, 1, 7, false, false, 45, 'low', 'cloudy', 28.5),
('a1000000-0000-0000-0000-000000000001', '2026-07-14', 8, 1, 7, false, false, 120, 'low', 'cloudy', 29.2),
('a1000000-0000-0000-0000-000000000001', '2026-07-14', 10, 1, 7, false, false, 340, 'medium', 'partly_cloudy', 30.1),
('a1000000-0000-0000-0000-000000000001', '2026-07-14', 12, 1, 7, false, false, 520, 'high', 'sunny', 31.5),
('a1000000-0000-0000-0000-000000000001', '2026-07-14', 14, 1, 7, false, false, 680, 'high', 'sunny', 32.0),
('a1000000-0000-0000-0000-000000000001', '2026-07-14', 16, 1, 7, false, false, 890, 'very_high', 'sunny', 31.2),
('a1000000-0000-0000-0000-000000000001', '2026-07-14', 18, 1, 7, false, false, 920, 'very_high', 'clear', 29.8),
('a1000000-0000-0000-0000-000000000001', '2026-07-14', 20, 1, 7, false, false, 750, 'high', 'clear', 28.5),
-- Weekend pattern (higher crowd)
('a1000000-0000-0000-0000-000000000001', '2026-07-19', 6, 6, 7, false, true, 80, 'low', 'clear', 27.8),
('a1000000-0000-0000-0000-000000000001', '2026-07-19', 8, 6, 7, false, true, 220, 'medium', 'clear', 28.5),
('a1000000-0000-0000-0000-000000000001', '2026-07-19', 10, 6, 7, false, true, 560, 'high', 'sunny', 30.5),
('a1000000-0000-0000-0000-000000000001', '2026-07-19', 12, 6, 7, false, true, 780, 'very_high', 'sunny', 32.0),
('a1000000-0000-0000-0000-000000000001', '2026-07-19', 14, 6, 7, false, true, 920, 'very_high', 'sunny', 32.5),
('a1000000-0000-0000-0000-000000000001', '2026-07-19', 16, 6, 7, false, true, 1100, 'very_high', 'sunny', 31.8),
('a1000000-0000-0000-0000-000000000001', '2026-07-19', 18, 6, 7, false, true, 1200, 'very_high', 'clear', 30.2),
('a1000000-0000-0000-0000-000000000001', '2026-07-19', 20, 6, 7, false, true, 980, 'very_high', 'clear', 28.8),
-- More weekday data
('a1000000-0000-0000-0000-000000000001', '2026-07-15', 6, 2, 7, false, false, 50, 'low', 'rainy', 27.0),
('a1000000-0000-0000-0000-000000000001', '2026-07-15', 8, 2, 7, false, false, 95, 'low', 'rainy', 27.5),
('a1000000-0000-0000-0000-000000000001', '2026-07-15', 10, 2, 7, false, false, 280, 'medium', 'cloudy', 29.0),
('a1000000-0000-0000-0000-000000000001', '2026-07-15', 14, 2, 7, false, false, 610, 'high', 'partly_cloudy', 31.0),
('a1000000-0000-0000-0000-000000000001', '2026-07-15', 18, 2, 7, false, false, 850, 'very_high', 'clear', 29.5),

-- Palolem Beach (less crowded pattern)
('a1000000-0000-0000-0000-000000000007', '2026-07-14', 6, 1, 7, false, false, 15, 'low', 'cloudy', 27.5),
('a1000000-0000-0000-0000-000000000007', '2026-07-14', 8, 1, 7, false, false, 45, 'low', 'cloudy', 28.0),
('a1000000-0000-0000-0000-000000000007', '2026-07-14', 10, 1, 7, false, false, 120, 'low', 'partly_cloudy', 29.5),
('a1000000-0000-0000-0000-000000000007', '2026-07-14', 12, 1, 7, false, false, 210, 'medium', 'sunny', 30.5),
('a1000000-0000-0000-0000-000000000007', '2026-07-14', 14, 1, 7, false, false, 280, 'medium', 'sunny', 31.0),
('a1000000-0000-0000-0000-000000000007', '2026-07-14', 16, 1, 7, false, false, 350, 'medium', 'sunny', 30.2),
('a1000000-0000-0000-0000-000000000007', '2026-07-14', 18, 1, 7, false, false, 420, 'high', 'clear', 29.0),

-- Divar Island (emerging - very low crowd)
('a1000000-0000-0000-0000-000000000008', '2026-07-14', 8, 1, 7, false, false, 8, 'low', 'cloudy', 28.0),
('a1000000-0000-0000-0000-000000000008', '2026-07-14', 10, 1, 7, false, false, 15, 'low', 'partly_cloudy', 29.5),
('a1000000-0000-0000-0000-000000000008', '2026-07-14', 14, 1, 7, false, false, 25, 'low', 'sunny', 31.0),
('a1000000-0000-0000-0000-000000000008', '2026-07-14', 18, 1, 7, false, false, 12, 'low', 'clear', 29.0);

-- ============================================================
-- CROWD PREDICTIONS (pre-generated for demo)
-- ============================================================
INSERT INTO crowd_predictions (attraction_id, date, hour, predicted_level, predicted_count, confidence, model_version) VALUES
-- Baga Beach predictions for today+1
('a1000000-0000-0000-0000-000000000001', CURRENT_DATE + 1, 6, 'low', 50, 0.89, 'rf_v1'),
('a1000000-0000-0000-0000-000000000001', CURRENT_DATE + 1, 8, 'low', 130, 0.87, 'rf_v1'),
('a1000000-0000-0000-0000-000000000001', CURRENT_DATE + 1, 10, 'medium', 350, 0.84, 'rf_v1'),
('a1000000-0000-0000-0000-000000000001', CURRENT_DATE + 1, 12, 'high', 540, 0.82, 'rf_v1'),
('a1000000-0000-0000-0000-000000000001', CURRENT_DATE + 1, 14, 'high', 700, 0.80, 'rf_v1'),
('a1000000-0000-0000-0000-000000000001', CURRENT_DATE + 1, 16, 'very_high', 900, 0.78, 'rf_v1'),
('a1000000-0000-0000-0000-000000000001', CURRENT_DATE + 1, 18, 'very_high', 950, 0.76, 'rf_v1'),
('a1000000-0000-0000-0000-000000000001', CURRENT_DATE + 1, 20, 'high', 720, 0.79, 'rf_v1'),
-- Palolem predictions
('a1000000-0000-0000-0000-000000000007', CURRENT_DATE + 1, 6, 'low', 20, 0.91, 'rf_v1'),
('a1000000-0000-0000-0000-000000000007', CURRENT_DATE + 1, 8, 'low', 50, 0.89, 'rf_v1'),
('a1000000-0000-0000-0000-000000000007', CURRENT_DATE + 1, 10, 'low', 130, 0.86, 'rf_v1'),
('a1000000-0000-0000-0000-000000000007', CURRENT_DATE + 1, 12, 'medium', 220, 0.84, 'rf_v1'),
('a1000000-0000-0000-0000-000000000007', CURRENT_DATE + 1, 14, 'medium', 290, 0.82, 'rf_v1'),
('a1000000-0000-0000-0000-000000000007', CURRENT_DATE + 1, 16, 'medium', 360, 0.80, 'rf_v1'),
('a1000000-0000-0000-0000-000000000007', CURRENT_DATE + 1, 18, 'high', 430, 0.78, 'rf_v1'),
-- Divar Island predictions (always low)
('a1000000-0000-0000-0000-000000000008', CURRENT_DATE + 1, 8, 'low', 10, 0.93, 'rf_v1'),
('a1000000-0000-0000-0000-000000000008', CURRENT_DATE + 1, 10, 'low', 18, 0.91, 'rf_v1'),
('a1000000-0000-0000-0000-000000000008', CURRENT_DATE + 1, 14, 'low', 28, 0.89, 'rf_v1'),
('a1000000-0000-0000-0000-000000000008', CURRENT_DATE + 1, 18, 'low', 15, 0.90, 'rf_v1');

-- ============================================================
-- LOCAL EXPERIENCES
-- ============================================================
INSERT INTO local_experiences (destination_id, name, category, description, location, latitude, longitude, price_range, avg_rating, review_count, positive_sentiment_pct, popularity, sustainability_badge) VALUES
-- Goa
('d1000000-0000-0000-0000-000000000001', 'Traditional Goan Fish Thali Tour', 'food', 'Experience authentic Goan fish curry, sol kadhi, and prawn balchão at local family-run restaurants in Panjim.', 'Panaji, Goa', 15.4989, 73.8278, '₹₹', 4.80, 342, 94, 'trending', true),
('d1000000-0000-0000-0000-000000000001', 'Pottery Workshop in Bicholim', 'crafts', 'Learn traditional Goan pottery making from local artisans. Create your own clay pot and take it home.', 'Bicholim, Goa', 15.5915, 73.9541, '₹', 4.70, 87, 92, 'moderate', true),
('d1000000-0000-0000-0000-000000000001', 'Cashew Feni Distillery Visit', 'food', 'Visit a local feni distillery and learn about the traditional cashew spirit of Goa. Includes tasting session.', 'Colvale, Goa', 15.5800, 73.8200, '₹₹', 4.50, 156, 88, 'high', false),
('d1000000-0000-0000-0000-000000000001', 'Goan Cooking Class', 'food', 'Cook traditional Goan dishes with a local family. Learn to make vindaloo, xacuti, bebinca from scratch.', 'Assagao, Goa', 15.5600, 73.7800, '₹₹', 4.85, 234, 96, 'trending', true),
('d1000000-0000-0000-0000-000000000001', 'Backwater Kayaking in Zuari', 'experience', 'Kayak through the peaceful Zuari river mangroves. Spot kingfishers, herons, and local village life.', 'Cortalim, Goa', 15.4000, 73.9100, '₹₹', 4.60, 123, 90, 'high', true),
('d1000000-0000-0000-0000-000000000001', 'Village Heritage Walk', 'cultural', 'Guided walk through a traditional Goan village — visit temples, churches, old houses, and meet local families.', 'Loutolim, Goa', 15.3300, 73.9700, '₹', 4.65, 98, 93, 'moderate', true),
-- Mumbai
('d1000000-0000-0000-0000-000000000002', 'Mumbai Street Food Walk', 'food', 'Guided tour through Mumbai''s legendary street food scene — vada pav, pav bhaji, bhel puri, and more.', 'Girgaon, Mumbai', 18.9537, 72.8138, '₹', 4.75, 456, 92, 'trending', false),
('d1000000-0000-0000-0000-000000000002', 'Dharavi Pottery Workshop', 'crafts', 'Create pottery with master artisans in Dharavi''s Kumbharwada. All proceeds support the community.', 'Dharavi, Mumbai', 19.0424, 72.8547, '₹₹', 4.65, 178, 91, 'high', true),
('d1000000-0000-0000-0000-000000000002', 'Bollywood Studio Tour', 'cultural', 'Behind-the-scenes tour of Film City, including live shoots, sets, and Bollywood history.', 'Goregaon, Mumbai', 19.1648, 72.8470, '₹₹₹', 4.30, 234, 82, 'high', false),
-- Jaipur
('d1000000-0000-0000-0000-000000000003', 'Block Printing Workshop', 'crafts', 'Learn the ancient art of Rajasthani block printing from master craftsmen. Create your own fabric art.', 'Sanganer, Jaipur', 26.8274, 75.7913, '₹₹', 4.70, 189, 93, 'trending', true),
('d1000000-0000-0000-0000-000000000003', 'Rajasthani Cooking Class', 'food', 'Cook authentic dal baati churma, laal maas, and ghevar with a local Jaipur family.', 'Old City, Jaipur', 26.9260, 75.8235, '₹₹', 4.80, 234, 95, 'high', true),
('d1000000-0000-0000-0000-000000000003', 'Gem Cutting Demonstration', 'crafts', 'Watch master gem cutters shape precious stones. Learn about Jaipur''s 500-year gem trade legacy.', 'Johari Bazaar, Jaipur', 26.9220, 75.8230, '₹', 4.40, 123, 86, 'moderate', false),
-- Kerala
('d1000000-0000-0000-0000-000000000004', 'Ayurvedic Wellness Retreat', 'experience', 'Traditional Kerala Ayurvedic massage and wellness session at an authentic riverside center.', 'Varkala, Kerala', 8.7336, 76.7109, '₹₹₹', 4.75, 312, 91, 'high', true),
('d1000000-0000-0000-0000-000000000004', 'Kerala Sadya Experience', 'food', 'Enjoy a full traditional Kerala Sadya meal served on a banana leaf — 26 courses of pure vegetarian bliss.', 'Kochi, Kerala', 9.9816, 76.2999, '₹₹', 4.85, 267, 95, 'trending', true),
('d1000000-0000-0000-0000-000000000004', 'Kathakali Performance', 'cultural', 'Watch a live Kathakali dance-drama performance with traditional makeup and costumes.', 'Fort Kochi, Kerala', 9.9639, 76.2437, '₹₹', 4.60, 198, 88, 'high', false);

-- ============================================================
-- SUSTAINABILITY SCORES
-- ============================================================
INSERT INTO sustainability_scores (destination_id, environmental_impact, public_transport, crowd_pressure, local_benefit, overall_score, recommendations) VALUES
('d1000000-0000-0000-0000-000000000001', 62, 45, 52, 78, 59, ARRAY['Use public buses between beaches', 'Visit during off-peak hours (before 10 AM)', 'Choose local restaurants over chain hotels', 'Avoid single-use plastics on beaches', 'Support local artisan experiences', 'Consider South Goa for less crowd pressure']),
('d1000000-0000-0000-0000-000000000002', 55, 82, 48, 71, 64, ARRAY['Use Mumbai local trains and metro', 'Support community-led tours in Dharavi', 'Walk through heritage precincts', 'Choose locally-owned restaurants']),
('d1000000-0000-0000-0000-000000000003', 68, 52, 62, 85, 67, ARRAY['Use cycle rickshaws in the old city', 'Buy directly from artisan workshops', 'Visit heritage sites early morning', 'Support local block printing artisans']),
('d1000000-0000-0000-0000-000000000004', 82, 65, 75, 90, 78, ARRAY['Choose responsible houseboat operators', 'Support local Ayurvedic practitioners', 'Use public ferries and buses', 'Attend Kathakali at community centers']),
('d1000000-0000-0000-0000-000000000005', 42, 78, 38, 65, 56, ARRAY['Use Delhi Metro extensively', 'Visit monuments on weekdays', 'Choose eco-friendly accommodations', 'Support local artisan markets over malls']),
('d1000000-0000-0000-0000-000000000006', 48, 42, 45, 68, 51, ARRAY['Visit Taj Mahal at sunrise for fewer crowds', 'Use e-rickshaws for local transport', 'Support local marble artisan workshops', 'Avoid plastic water bottles near monuments']);

-- ============================================================
-- SENTIMENT TIMELINE — GOA (monthly data)
-- ============================================================
INSERT INTO sentiment_timeline (destination_id, period, period_type, positive_count, neutral_count, negative_count, total_count, avg_rating) VALUES
('d1000000-0000-0000-0000-000000000001', '2026-01-01', 'month', 1245, 198, 132, 1575, 4.05),
('d1000000-0000-0000-0000-000000000001', '2026-02-01', 'month', 1389, 178, 121, 1688, 4.10),
('d1000000-0000-0000-0000-000000000001', '2026-03-01', 'month', 1523, 187, 108, 1818, 4.15),
('d1000000-0000-0000-0000-000000000001', '2026-04-01', 'month', 1287, 165, 98, 1550, 4.18),
('d1000000-0000-0000-0000-000000000001', '2026-05-01', 'month', 1134, 145, 87, 1366, 4.20),
('d1000000-0000-0000-0000-000000000001', '2026-06-01', 'month', 1456, 178, 102, 1736, 4.22),
('d1000000-0000-0000-0000-000000000001', '2026-07-01', 'month', 1678, 189, 112, 1979, 4.25),
-- Other destinations
('d1000000-0000-0000-0000-000000000002', '2026-05-01', 'month', 876, 167, 123, 1166, 3.95),
('d1000000-0000-0000-0000-000000000002', '2026-06-01', 'month', 923, 178, 134, 1235, 4.00),
('d1000000-0000-0000-0000-000000000002', '2026-07-01', 'month', 987, 156, 112, 1255, 4.05),
('d1000000-0000-0000-0000-000000000003', '2026-05-01', 'month', 1123, 134, 87, 1344, 4.30),
('d1000000-0000-0000-0000-000000000003', '2026-06-01', 'month', 1234, 145, 78, 1457, 4.33),
('d1000000-0000-0000-0000-000000000003', '2026-07-01', 'month', 1345, 123, 67, 1535, 4.35),
('d1000000-0000-0000-0000-000000000004', '2026-05-01', 'month', 987, 98, 45, 1130, 4.45),
('d1000000-0000-0000-0000-000000000004', '2026-06-01', 'month', 1056, 87, 38, 1181, 4.48),
('d1000000-0000-0000-0000-000000000004', '2026-07-01', 'month', 1123, 92, 42, 1257, 4.50);

-- ============================================================
-- ALERTS
-- ============================================================
INSERT INTO alerts (destination_id, type, severity, title, description, data) VALUES
('d1000000-0000-0000-0000-000000000001', 'problem_increase', 'warning', 'Parking complaints increased 23% this month', 'Negative reviews mentioning parking issues have increased significantly compared to last month. Most complaints are concentrated around Baga Beach and Calangute Beach areas.', '{"category": "parking", "change_pct": 23, "current_mentions": 342, "affected_areas": ["Baga Beach", "Calangute Beach"]}'),
('d1000000-0000-0000-0000-000000000001', 'emerging_attraction', 'info', 'Divar Island mentions increased 212%', 'Divar Island has seen a dramatic increase in positive mentions. 93% of reviews are positive, praising its untouched beauty and lack of commercialization.', '{"attraction": "Divar Island", "growth_pct": 212, "sentiment_pct": 93}'),
('d1000000-0000-0000-0000-000000000001', 'sentiment_improvement', 'info', 'Food service sentiment improved 14%', 'Positive reviews about food quality and variety have increased by 14% this month. Beach shacks and local restaurants are receiving particularly strong praise.', '{"category": "food", "change_pct": 14, "current_score": 4.35}'),
('d1000000-0000-0000-0000-000000000001', 'problem_increase', 'warning', 'Weekend crowd complaints increased 19%', 'Tourist complaints about overcrowding specifically on weekends have increased. Saturday and Sunday reviews mention crowding 19% more than last month.', '{"category": "crowd", "change_pct": 19, "peak_day": "Saturday"}'),
('d1000000-0000-0000-0000-000000000001', 'sustainability', 'info', 'Public transport mentions increased 18%', 'Reviews mentioning the need for better public transport have increased by 18%. Tourists are increasingly requesting bus services between popular beaches.', '{"category": "transport", "change_pct": 18}'),
('d1000000-0000-0000-0000-000000000005', 'problem_increase', 'critical', 'Air quality complaints at critical level', 'Negative reviews about Delhi''s air quality continue at critical levels. 4.13% of all reviews mention pollution as a major concern.', '{"category": "environment", "mention_pct": 4.13}'),
('d1000000-0000-0000-0000-000000000006', 'problem_increase', 'warning', 'Tout and scam reports increasing near Taj Mahal', 'Reports of aggressive touts and scam attempts near Taj Mahal have increased 14% this month.', '{"category": "safety", "change_pct": 14, "area": "Taj Mahal surroundings"}');

-- ============================================================
-- DEMO USER (for admin dashboard)
-- ============================================================
INSERT INTO users (email, password_hash, name, role) VALUES
('admin@yatraai.com', '$2b$10$dummyhashfordemopurposes1234567890abcdef', 'YatraAI Admin', 'admin'),
('demo@yatraai.com', '$2b$10$dummyhashfordemopurposes1234567890abcdef', 'Demo User', 'user');
