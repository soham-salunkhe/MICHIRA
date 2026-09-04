import { pool } from './db.js';

export interface DestinationSeed {
  name: string;
  slug: string;
  state: string;
  description: string;
}

export const ALL_INDIA_DESTINATIONS: DestinationSeed[] = [
  // Andhra Pradesh
  { name: 'Visakhapatnam', slug: 'visakhapatnam', state: 'Andhra Pradesh', description: 'The Jewel of the East Coast known for pristine beaches, submarine museum, and scenic Araku Valley approach.' },
  { name: 'Tirupati', slug: 'tirupati', state: 'Andhra Pradesh', description: 'Sacred abode of Lord Venkateswara at Tirumala, one of the worlds most revered pilgrimage destinations.' },
  { name: 'Vijayawada', slug: 'vijayawada', state: 'Andhra Pradesh', description: 'Cultural city on Krishna river home to Kanaka Durga Temple, Undavalli Caves, and Prakasam Barrage.' },
  { name: 'Amaravati', slug: 'amaravati', state: 'Andhra Pradesh', description: 'Ancient Buddhist site and modern green capital with the sacred Amaralingeswara temple and stupas.' },
  { name: 'Araku Valley', slug: 'araku-valley', state: 'Andhra Pradesh', description: 'Enchanting hill station with coffee plantations, tribal culture, Borra Caves, and misty waterfalls.' },

  // Arunachal Pradesh
  { name: 'Tawang', slug: 'tawang', state: 'Arunachal Pradesh', description: 'Sacred Himalayan gem home to Indias largest monastery, Sela Pass, and glacial alpine lakes.' },
  { name: 'Itanagar', slug: 'itanagar', state: 'Arunachal Pradesh', description: 'Capital city nestled in the Eastern Himalayas featuring Ita Fort, Gompa, and Ganga Lake.' },
  { name: 'Ziro', slug: 'ziro', state: 'Arunachal Pradesh', description: 'UNESCO heritage tentative valley famed for the Apatani tribe, rice-fish culture, and music festival.' },
  { name: 'Bomdila', slug: 'bomdila', state: 'Arunachal Pradesh', description: 'Picturesque Himalayan town offering snow-capped views of Kangto and Gorichen peaks.' },

  // Assam
  { name: 'Guwahati', slug: 'guwahati', state: 'Assam', description: 'Gateway to Northeast India situated on the Brahmaputra, sacred for Kamakhya and Umananda temples.' },
  { name: 'Kaziranga', slug: 'kaziranga', state: 'Assam', description: 'World Heritage Sanctuary home to two-thirds of the worlds great one-horned rhinoceroses.' },
  { name: 'Majuli', slug: 'majuli', state: 'Assam', description: 'The worlds largest inhabited river island, cradle of Neo-Vaishnavite Satra culture and pottery.' },
  { name: 'Sivasagar', slug: 'sivasagar', state: 'Assam', description: 'Historic capital of the Ahom Kingdom featuring massive tanks, palaces, and ancient amphitheaters.' },

  // Bihar
  { name: 'Bodh Gaya', slug: 'bodh-gaya', state: 'Bihar', description: 'The supreme Buddhist pilgrimage site where Lord Buddha attained Enlightenment under the Bodhi Tree.' },
  { name: 'Patna', slug: 'patna', state: 'Bihar', description: 'Ancient Pataliputra on the Ganges, home to Takht Sri Patna Sahib, Golghar, and heritage museums.' },
  { name: 'Nalanda', slug: 'nalanda', state: 'Bihar', description: 'Ancient seat of learning and UNESCO World Heritage monastic university dating back to 5th century CE.' },
  { name: 'Rajgir', slug: 'rajgir', state: 'Bihar', description: 'Historic valley of spiritual significance to Buddhism and Jainism, featuring hot springs and Vishwa Shanti Stupa.' },

  // Chhattisgarh
  { name: 'Raipur', slug: 'raipur', state: 'Chhattisgarh', description: 'Vibrant capital city showcasing ancient temples, tribal museums, and proximity to wildlife sanctuaries.' },
  { name: 'Bastar', slug: 'bastar', state: 'Chhattisgarh', description: 'Cultural heartland famed for Dhokra bell-metal art, vibrant Dussehra, and dense Sal forests.' },
  { name: 'Chitrakote', slug: 'chitrakote', state: 'Chhattisgarh', description: 'The Niagara Falls of India, a spectacular horseshoe waterfall on the Indravati river.' },
  { name: 'Sirpur', slug: 'sirpur', state: 'Chhattisgarh', description: 'Remarkable archaeological site with 7th-century Laxman Temple, Buddhist monasteries, and riverfront ghats.' },

  // Goa
  { name: 'Goa', slug: 'goa', state: 'Goa', description: 'Indias beloved coastal paradise, known for stunning beaches, Portuguese heritage, and vibrant nightlife.' },
  { name: 'Panaji', slug: 'panaji', state: 'Goa', description: 'Charming riverside capital famous for Latin Quarter Fontainhas, churches, and river cruises.' },
  { name: 'Calangute', slug: 'calangute', state: 'Goa', description: 'The Queen of Beaches known for vibrant shacks, water sports, and bustling seaside atmosphere.' },
  { name: 'Baga', slug: 'baga', state: 'Goa', description: 'Famous coastal hub offering lively nightlife, beach shacks, and water adventure sports.' },
  { name: 'Palolem', slug: 'palolem', state: 'Goa', description: 'Crescent-shaped serene paradise in South Goa known for dolphin spotting and tranquil waters.' },
  { name: 'Old Goa', slug: 'old-goa', state: 'Goa', description: 'UNESCO World Heritage city with Basilica of Bom Jesus, Se Cathedral, and Portuguese baroque architecture.' },

  // Gujarat
  { name: 'Ahmedabad', slug: 'ahmedabad', state: 'Gujarat', description: 'Indias first UNESCO World Heritage City, home to Sabarmati Ashram, stepwells, and pols.' },
  { name: 'Dwarka', slug: 'dwarka', state: 'Gujarat', description: 'Ancient kingdom of Lord Krishna and one of the Char Dham sites on the western Arabian coast.' },
  { name: 'Somnath', slug: 'somnath', state: 'Gujarat', description: 'The first of the twelve sacred Jyotirlinga shrines standing majestically on the shore of the ocean.' },
  { name: 'Gir', slug: 'gir', state: 'Gujarat', description: 'The only natural habitat of the majestic Asiatic Lion in the rugged dry deciduous forests.' },
  { name: 'Rann of Kutch', slug: 'rann-of-kutch', state: 'Gujarat', description: 'Vast shimmering white salt desert coming alive during the vibrant Rann Utsav under full moon.' },
  { name: 'Vadodara', slug: 'vadodara', state: 'Gujarat', description: 'Cultural capital of Gujarat featuring the grand Laxmi Vilas Palace and rich arts heritage.' },

  // Haryana
  { name: 'Gurugram', slug: 'gurugram', state: 'Haryana', description: 'Modern millennium city blending corporate skylines with cultural hubs and Sultanpur Bird Sanctuary.' },
  { name: 'Kurukshetra', slug: 'kurukshetra', state: 'Haryana', description: 'The historic land of the Mahabharata and birthplace of the Bhagavad Gita beside Brahma Sarovar.' },
  { name: 'Panchkula', slug: 'panchkula', state: 'Haryana', description: 'Picturesque city nestled at the foothills of the Shivalik range near Morni Hills.' },
  { name: 'Pinjore', slug: 'pinjore', state: 'Haryana', description: 'Historic 17th-century Mughal Gardens with terraced fountains and mountain views.' },

  // Himachal Pradesh
  { name: 'Shimla', slug: 'shimla', state: 'Himachal Pradesh', description: 'Queen of the Hills with colonial architecture, heritage toy train, and snow-capped Himalayan vistas.' },
  { name: 'Manali', slug: 'manali', state: 'Himachal Pradesh', description: 'Valley of the Gods with cedar forests, adventure sports at Solang, and gateway to Rohtang Pass.' },
  { name: 'Dharamshala', slug: 'dharamshala', state: 'Himachal Pradesh', description: 'Spiritual haven and home of His Holiness the Dalai Lama surrounded by deodar forests and Dhauladhar.' },
  { name: 'Dalhousie', slug: 'dalhousie', state: 'Himachal Pradesh', description: 'Tranquil colonial hill retreat surrounded by pine-clad valleys and Khajjiar meadows.' },
  { name: 'Spiti Valley', slug: 'spiti-valley', state: 'Himachal Pradesh', description: 'Cold mountain desert with ancient Buddhist monasteries like Key and Tabo, and high-altitude lakes.' },
  { name: 'Kasol', slug: 'kasol', state: 'Himachal Pradesh', description: 'Scenic village along the Parvati River, base for Kheerganga and Tosh Himalayan treks.' },

  // Jharkhand
  { name: 'Ranchi', slug: 'ranchi', state: 'Jharkhand', description: 'City of Waterfalls surrounded by Hundru, Jonha, and Dassam falls, and sacred Jagannath temple.' },
  { name: 'Deoghar', slug: 'deoghar', state: 'Jharkhand', description: 'Sacred pilgrimage town home to the ancient Baba Baidyanath Jyotirlinga temple.' },
  { name: 'Netarhat', slug: 'netarhat', state: 'Jharkhand', description: 'Queen of Chotanagpur, a serene hill station famous for sunrises and pine forests.' },
  { name: 'Jamshedpur', slug: 'jamshedpur', state: 'Jharkhand', description: 'The Steel City nestled between the Subarnarekha river, Dalma Hills, and Jubilee Park.' },

  // Karnataka
  { name: 'Bengaluru', slug: 'bengaluru', state: 'Karnataka', description: 'Indias vibrant Garden City and tech capital filled with botanical gardens, craft breweries, and palaces.' },
  { name: 'Mysuru', slug: 'mysuru', state: 'Karnataka', description: 'City of Palaces, silk, and sandalwood, renowned for the illuminated Mysore Palace and Chamundi Hills.' },
  { name: 'Hampi', slug: 'hampi', state: 'Karnataka', description: 'UNESCO World Heritage boulder-strewn capital of the Vijayanagara Empire with Virupaksha and Vitthala temples.' },
  { name: 'Coorg', slug: 'coorg', state: 'Karnataka', description: 'Scotland of India draped in misty coffee plantations, spice gardens, and Abbey Falls.' },
  { name: 'Gokarna', slug: 'gokarna', state: 'Karnataka', description: 'Sacred Mahabaleshwar coastal town meeting pristine Om Beach and Half Moon Beach.' },
  { name: 'Udupi', slug: 'udupi', state: 'Karnataka', description: 'Coastal spiritual center renowned for Sri Krishna Matha, pristine Malpe beach, and St Marys Island.' },
  { name: 'Chikmagalur', slug: 'chikmagalur', state: 'Karnataka', description: 'Birthplace of Indian coffee nestled in the Baba Budan Giri hills with Mullayanagiri peak.' },

  // Kerala
  { name: 'Kerala', slug: 'kerala', state: 'Kerala', description: 'Gods Own Country, lush backwaters, ayurvedic sanctuaries, and misty mountain ranges.' },
  { name: 'Kochi', slug: 'kochi', state: 'Kerala', description: 'Queen of the Arabian Sea with Chinese fishing nets, Fort Kochi heritage, and spice trading lanes.' },
  { name: 'Munnar', slug: 'munnar', state: 'Kerala', description: 'Rolling emerald tea gardens, Anamudi peak, and cool mountain air in the Western Ghats.' },
  { name: 'Alleppey', slug: 'alleppey', state: 'Kerala', description: 'Venice of the East renowned for serene backwaters, traditional houseboats, and paddy fields.' },
  { name: 'Thiruvananthapuram', slug: 'thiruvananthapuram', state: 'Kerala', description: 'Capital city home to the magnificent Sree Padmanabhaswamy Temple and Kovalam beaches.' },
  { name: 'Wayanad', slug: 'wayanad', state: 'Kerala', description: 'Pristine hills with Edakkal prehistoric caves, spice plantations, and Chembra Peak.' },
  { name: 'Thekkady', slug: 'thekkady', state: 'Kerala', description: 'Home to Periyar National Park, spice plantations, and serene elephant sanctuaries.' },
  { name: 'Varkala', slug: 'varkala', state: 'Kerala', description: 'Stunning red cliff beach overlooking the Arabian Sea with natural mineral springs and Janardanaswamy temple.' },
  { name: 'Kozhikode', slug: 'kozhikode', state: 'Kerala', description: 'Historic spice port where Vasco da Gama landed, celebrated for Malabar cuisine and boatbuilding.' },

  // Madhya Pradesh
  { name: 'Bhopal', slug: 'bhopal', state: 'Madhya Pradesh', description: 'City of Lakes boasting Upper Lake, tribal museums, and proximity to Sanchi Stupa and Bhimbetka.' },
  { name: 'Indore', slug: 'indore', state: 'Madhya Pradesh', description: 'Cleanest city of India famed for Rajwada Palace, Sarafa night food bazaar, and heritage.' },
  { name: 'Khajuraho', slug: 'khajuraho', state: 'Madhya Pradesh', description: 'UNESCO World Heritage masterpieces of medieval temple art, stone carvings, and Nagara architecture.' },
  { name: 'Ujjain', slug: 'ujjain', state: 'Madhya Pradesh', description: 'Ancient sacred city on the Shipra River, home to Mahakaleshwar Jyotirlinga and Kumbh Mela.' },
  { name: 'Gwalior', slug: 'gwalior', state: 'Madhya Pradesh', description: 'Majestic hill fortress, Jai Vilas Palace, and the cradle of classical Hindustani music.' },
  { name: 'Orchha', slug: 'orchha', state: 'Madhya Pradesh', description: 'Timeless Bundela medieval town along the Betwa River with Raja Mahal, Jahangir Mahal, and Ram Raja Temple.' },
  { name: 'Pachmarhi', slug: 'pachmarhi', state: 'Madhya Pradesh', description: 'Queen of Satpura, a lush biosphere reserve with waterfalls, prehistoric rock caves, and ravines.' },

  // Maharashtra
  { name: 'Mumbai', slug: 'mumbai', state: 'Maharashtra', description: 'The vibrant City of Dreams, financial capital, Gateway of India, and UNESCO Victorian Gothic architecture.' },
  { name: 'Pune', slug: 'pune', state: 'Maharashtra', description: 'Cultural capital of Maharashtra with Shaniwar Wada, Aga Khan Palace, and Sinhagad Fort.' },
  { name: 'Nashik', slug: 'nashik', state: 'Maharashtra', description: 'Wine capital and sacred Kumbh Mela city on the Godavari, near Trimbakeshwar Jyotirlinga.' },
  { name: 'Mahabaleshwar', slug: 'mahabaleshwar', state: 'Maharashtra', description: 'Western Ghats hill station famous for strawberry farms, Arthur Seat, and Venna Lake.' },
  { name: 'Lonavala', slug: 'lonavala', state: 'Maharashtra', description: 'Popular monsoon hill getaway with Karla Caves, Bhaja Caves, and mist-covered valleys.' },
  { name: 'Chhatrapati Sambhajinagar', slug: 'chhatrapati-sambhajinagar', state: 'Maharashtra', description: 'Historical hub featuring Bibi Ka Maqbara, Daulatabad Fort, and gateway to Ajanta and Ellora.' },
  { name: 'Ajanta', slug: 'ajanta', state: 'Maharashtra', description: 'UNESCO World Heritage rock-cut Buddhist cave monuments dating from 2nd century BCE with exquisite murals.' },
  { name: 'Ellora', slug: 'ellora', state: 'Maharashtra', description: 'Monumental rock-cut cave temples featuring the awe-inspiring monolithic Kailash Temple.' },
  { name: 'Alibaug', slug: 'alibaug', state: 'Maharashtra', description: 'Coastal getaway with Kolaba sea fort, coconut groves, and tranquil beaches.' },
  { name: 'Shirdi', slug: 'shirdi', state: 'Maharashtra', description: 'Sacred pilgrimage center dedicated to revered spiritual master Sai Baba.' },

  // Manipur
  { name: 'Imphal', slug: 'imphal', state: 'Manipur', description: 'Historical valley capital featuring Kangla Fort, Ima Keithel women market, and polo grounds.' },
  { name: 'Loktak Lake', slug: 'loktak-lake', state: 'Manipur', description: 'The only floating lake in the world, home to the endangered Sangai deer at Keibul Lamjao.' },
  { name: 'Ukhrul', slug: 'ukhrul', state: 'Manipur', description: 'Scenic hill town famous for the rare Shirui Lily and Tangkhul Naga heritage.' },

  // Meghalaya
  { name: 'Shillong', slug: 'shillong', state: 'Meghalaya', description: 'Scotland of the East with pine-scented hills, Umiam Lake, Elephant Falls, and vibrant music.' },
  { name: 'Cherrapunji', slug: 'cherrapunji', state: 'Meghalaya', description: 'High-altitude wettest land with living root bridges, Nohkalikai Falls, and limestone caves.' },
  { name: 'Mawlynnong', slug: 'mawlynnong', state: 'Meghalaya', description: 'Acclaimed as Asias cleanest village, celebrated for community eco-living and root bridges.' },
  { name: 'Dawki', slug: 'dawki', state: 'Meghalaya', description: 'Famed for the crystal-clear emerald waters of the Umngot River along the Bangladesh border.' },

  // Mizoram
  { name: 'Aizawl', slug: 'aizawl', state: 'Mizoram', description: 'Peaceful ridge capital overlooking mountain valleys, rich in Mizo culture and handlooms.' },
  { name: 'Champhai', slug: 'champhai', state: 'Mizoram', description: 'Rice bowl of Mizoram offering panoramic views of the blue hills of Myanmar.' },
  { name: 'Reiek', slug: 'reiek', state: 'Mizoram', description: 'Scenic mountain peak and heritage village surrounded by lush subtropical forests.' },

  // Nagaland
  { name: 'Kohima', slug: 'kohima', state: 'Nagaland', description: 'Capital city celebrated for the Hornbill Festival, World War II Cemetery, and Naga heritage.' },
  { name: 'Dimapur', slug: 'dimapur', state: 'Nagaland', description: 'Commercial gateway with medieval Kachari ruins, crafts centers, and lush green hills.' },
  { name: 'Dzukou Valley', slug: 'dzukou-valley', state: 'Nagaland', description: 'Breathtaking valley of flowers and rolling bamboo hills on the Nagaland-Manipur border.' },

  // Odisha
  { name: 'Bhubaneswar', slug: 'bhubaneswar', state: 'Odisha', description: 'Temple City of India renowned for Lingaraj, Mukteshwar, and ancient Kalinga architecture.' },
  { name: 'Puri', slug: 'puri', state: 'Odisha', description: 'Sacred Char Dham coastal city home to the Jagannath Temple and grand Rath Yatra.' },
  { name: 'Konark', slug: 'konark', state: 'Odisha', description: 'UNESCO World Heritage Sun Temple sculpted like a colossal stone chariot of the Sun God.' },
  { name: 'Chilika Lake', slug: 'chilika-lake', state: 'Odisha', description: 'Asias largest brackish water lagoon, haven for migratory birds and Irrawaddy dolphins.' },
  { name: 'Cuttack', slug: 'cuttack', state: 'Odisha', description: 'The Millennium City famous for exquisite silver filigree (Tarakasi) and historic Barabati Fort.' },

  // Punjab
  { name: 'Amritsar', slug: 'amritsar', state: 'Punjab', description: 'Spiritual heart of Sikhism, home to the Golden Temple (Sri Harmandir Sahib) and Wagah Border.' },
  { name: 'Ludhiana', slug: 'ludhiana', state: 'Punjab', description: 'Industrial hub with rich Punjabi heritage, Lodhi Fort ruins, and rural heritage museums.' },
  { name: 'Patiala', slug: 'patiala', state: 'Punjab', description: 'Royal city renowned for Qila Mubarak, Sheesh Mahal, classical music, and rich traditions.' },
  { name: 'Anandpur Sahib', slug: 'anandpur-sahib', state: 'Punjab', description: 'The Holy City of Bliss where the Khalsa was founded, home to Takht Sri Kesgarh Sahib.' },

  // Rajasthan
  { name: 'Jaipur', slug: 'jaipur', state: 'Rajasthan', description: 'The Pink City, UNESCO World Heritage capital with Amber Fort, Hawa Mahal, and City Palace.' },
  { name: 'Udaipur', slug: 'udaipur', state: 'Rajasthan', description: 'City of Lakes and romance featuring the City Palace, Lake Pichola, and royal heritage.' },
  { name: 'Jodhpur', slug: 'jodhpur', state: 'Rajasthan', description: 'The Blue City crowned by the impregnable Mehrangarh Fort and Umaid Bhawan Palace.' },
  { name: 'Jaisalmer', slug: 'jaisalmer', state: 'Rajasthan', description: 'The Golden City in the Thar Desert with living sandstone fort, Jain temples, and dunes.' },
  { name: 'Pushkar', slug: 'pushkar', state: 'Rajasthan', description: 'Sacred lake town home to the rare Lord Brahma Temple and the colorful annual Camel Fair.' },
  { name: 'Ajmer', slug: 'ajmer', state: 'Rajasthan', description: 'Spiritual center home to the revered Sufi shrine of Khwaja Moinuddin Chishti.' },
  { name: 'Mount Abu', slug: 'mount-abu', state: 'Rajasthan', description: 'Rajasthans only hill station, celebrated for the intricately carved marble Dilwara Jain Temples.' },
  { name: 'Bikaner', slug: 'bikaner', state: 'Rajasthan', description: 'Desert outpost famous for Junagarh Fort, Karni Mata Temple, and camel breeding farm.' },

  // Sikkim
  { name: 'Gangtok', slug: 'gangtok', state: 'Sikkim', description: 'Charming capital city with views of Mt Kanchenjunga, Rumtek Monastery, and MG Marg.' },
  { name: 'Pelling', slug: 'pelling', state: 'Sikkim', description: 'Peaceful hill town with Pemayangtse Monastery, Rabdentse ruins, and glass skywalk.' },
  { name: 'Lachung', slug: 'lachung', state: 'Sikkim', description: 'Picturesque North Sikkim mountain village, gateway to the snow-covered Yumthang Valley.' },
  { name: 'Yumthang Valley', slug: 'yumthang-valley', state: 'Sikkim', description: 'The Valley of Flowers of Sikkim with rhododendron sanctuaries and hot springs.' },

  // Tamil Nadu
  { name: 'Chennai', slug: 'chennai', state: 'Tamil Nadu', description: 'Cultural gateway of South India famous for Marina Beach, Kapaleeshwarar Temple, and Carnatic music.' },
  { name: 'Madurai', slug: 'madurai', state: 'Tamil Nadu', description: 'The Soul of Tamil Nadu centered around the historic and colorful Meenakshi Amman Temple.' },
  { name: 'Ooty', slug: 'ooty', state: 'Tamil Nadu', description: 'Queen of Hill Stations in the Nilgiris with tea gardens, Nilgiri Mountain Railway, and botanical parks.' },
  { name: 'Kodaikanal', slug: 'kodaikanal', state: 'Tamil Nadu', description: 'Princess of Hill Stations with star-shaped lake, Coakers Walk, and mist-covered pine forests.' },
  { name: 'Rameswaram', slug: 'rameswaram', state: 'Tamil Nadu', description: 'Sacred Char Dham island temple town with the Ramanathaswamy corridor and Dhanushkodi ruins.' },
  { name: 'Thanjavur', slug: 'thanjavur', state: 'Tamil Nadu', description: 'Cradle of Chola architecture home to the magnificent 11th-century Brihadeeswarar Temple.' },
  { name: 'Mahabalipuram', slug: 'mahabalipuram', state: 'Tamil Nadu', description: 'UNESCO World Heritage coastal town with 7th-century Shore Temple and monolithic rock reliefs.' },
  { name: 'Kanyakumari', slug: 'kanyakumari', state: 'Tamil Nadu', description: 'The southern tip of mainland India where three seas converge, with Vivekananda Rock Memorial.' },

  // Telangana
  { name: 'Hyderabad', slug: 'hyderabad', state: 'Telangana', description: 'City of Pearls and Nizam heritage featuring Charminar, Golconda Fort, and Ramoji Film City.' },
  { name: 'Warangal', slug: 'warangal', state: 'Telangana', description: 'Historic Kakatiya capital with the Thousand Pillar Temple, Warangal Fort, and Ramappa Temple.' },
  { name: 'Karimnagar', slug: 'karimnagar', state: 'Telangana', description: 'Historic center known for silver filigree art and ancient temples along the Godavari.' },
  { name: 'Nagarjuna Sagar', slug: 'nagarjuna-sagar', state: 'Telangana', description: 'Massive masonry dam and island museum housing priceless Buddhist antiquities.' },

  // Tripura
  { name: 'Agartala', slug: 'agartala', state: 'Tripura', description: 'Capital city home to the opulent Ujjayanta Palace, Neermahal water palace, and temples.' },
  { name: 'Udaipur', slug: 'udaipur-tripura', state: 'Tripura', description: 'City of Lakes in Tripura, sacred for the 500-year-old Tripura Sundari Temple.' },
  { name: 'Unakoti', slug: 'unakoti', state: 'Tripura', description: 'Ancient Shaivite pilgrimage site with colossal rock-carved reliefs nestled in forest hills.' },

  // Uttar Pradesh
  { name: 'Agra', slug: 'agra', state: 'Uttar Pradesh', description: 'Home to the sublime Taj Mahal, Agra Fort, and Mughal architectural masterworks.' },
  { name: 'Varanasi', slug: 'varanasi', state: 'Uttar Pradesh', description: 'The oldest living city in the world, sacred for Kashi Vishwanath, Ganga Aarti, and sacred ghats.' },
  { name: 'Ayodhya', slug: 'ayodhya', state: 'Uttar Pradesh', description: 'Ancient city on the Saryu River, sacred birthplace of Lord Rama with grand temples.' },
  { name: 'Lucknow', slug: 'lucknow', state: 'Uttar Pradesh', description: 'City of Nawabs celebrated for Bara Imambara, Chikankari embroidery, and Awadhi culinary culture.' },
  { name: 'Mathura', slug: 'mathura', state: 'Uttar Pradesh', description: 'Sacred birthplace of Lord Krishna on the Yamuna River, filled with ancient ghats and temples.' },
  { name: 'Vrindavan', slug: 'vrindavan', state: 'Uttar Pradesh', description: 'The holy forest town of Krishna with Banke Bihari, Prem Mandir, and ISKCON temples.' },
  { name: 'Prayagraj', slug: 'prayagraj', state: 'Uttar Pradesh', description: 'Sacred confluence (Triveni Sangam) of Ganga, Yamuna, and Saraswati, host to the Maha Kumbh.' },
  { name: 'Sarnath', slug: 'sarnath', state: 'Uttar Pradesh', description: 'Sacred deer park where Lord Buddha delivered his first sermon, marked by Dhamek Stupa.' },
  { name: 'Jhansi', slug: 'jhansi', state: 'Uttar Pradesh', description: 'Historic fort city associated with Rani Laxmibai, the legendary warrior queen of 1857.' },

  // Uttarakhand
  { name: 'Dehradun', slug: 'dehradun', state: 'Uttarakhand', description: 'Valley capital nestled between the Himalayas and Shivaliks, gateway to Mussoorie and Garhwal.' },
  { name: 'Rishikesh', slug: 'rishikesh', state: 'Uttarakhand', description: 'Yoga Capital of the World along the emerald Ganges with iconic suspension bridges and river rafting.' },
  { name: 'Haridwar', slug: 'haridwar', state: 'Uttarakhand', description: 'Gateway to the Gods where the holy Ganga enters the plains, renowned for Har Ki Pauri Ganga Aarti.' },
  { name: 'Nainital', slug: 'nainital', state: 'Uttarakhand', description: 'Charming lake resort surrounded by seven hills with the emerald Naini Lake and Naina Devi temple.' },
  { name: 'Mussoorie', slug: 'mussoorie', state: 'Uttarakhand', description: 'Queen of the Hills with Kempty Falls, Gun Hill, and panoramic Doon Valley views.' },
  { name: 'Kedarnath', slug: 'kedarnath', state: 'Uttarakhand', description: 'Sacred Himalayan Jyotirlinga and Char Dham temple situated at 3,583m in the Garhwal peaks.' },
  { name: 'Badrinath', slug: 'badrinath', state: 'Uttarakhand', description: 'Sacred abode of Lord Vishnu in the Himalayas between the Nar and Narayana mountain ranges.' },
  { name: 'Auli', slug: 'auli', state: 'Uttarakhand', description: 'Premier Himalayan ski destination offering unobstructed views of Nanda Devi and Trishul.' },
  { name: 'Valley of Flowers', slug: 'valley-of-flowers', state: 'Uttarakhand', description: 'UNESCO World Heritage alpine valley blanketed with endemic flora and glacial streams.' },

  // West Bengal
  { name: 'Kolkata', slug: 'kolkata', state: 'West Bengal', description: 'Cultural Capital of India famous for Victoria Memorial, Howrah Bridge, Durga Puja, and arts.' },
  { name: 'Darjeeling', slug: 'darjeeling', state: 'West Bengal', description: 'Queen of the Hills renowned for Darjeeling tea gardens, heritage toy train, and Kanchenjunga sunrise.' },
  { name: 'Kalimpong', slug: 'kalimpong', state: 'West Bengal', description: 'Peaceful hill retreat known for Buddhist monasteries, orchid nurseries, and Teesta river views.' },
  { name: 'Sundarbans', slug: 'sundarbans', state: 'West Bengal', description: 'Worlds largest mangrove forest and UNESCO Biosphere Reserve, home to the Royal Bengal Tiger.' },
  { name: 'Digha', slug: 'digha', state: 'West Bengal', description: 'Popular coastal destination on the Bay of Bengal with flat shallow beaches and casuarina groves.' },
  { name: 'Siliguri', slug: 'siliguri', state: 'West Bengal', description: 'Gateway to Northeast India, Darjeeling, and Sikkim, nestled in the foothills.' },

  // Union Territories
  // Andaman and Nicobar Islands
  { name: 'Port Blair', slug: 'port-blair', state: 'Andaman and Nicobar Islands', description: 'Island capital home to historic Cellular Jail, Corbys Cove, and marine museums.' },
  { name: 'Havelock Island', slug: 'havelock-island', state: 'Andaman and Nicobar Islands', description: 'Swaraj Dweep famed for Radhanagar Beach, scuba diving, and turquoise waters.' },
  { name: 'Neil Island', slug: 'neil-island', state: 'Andaman and Nicobar Islands', description: 'Shaheed Dweep known for relaxed vibes, natural coral bridge, and Bharatpur beach.' },

  // Chandigarh
  { name: 'Chandigarh', slug: 'chandigarh', state: 'Chandigarh', description: 'The City Beautiful planned by Le Corbusier, famous for Rock Garden, Sukhna Lake, and Rose Garden.' },

  // Dadra and Nagar Haveli and Daman and Diu
  { name: 'Daman', slug: 'daman', state: 'Dadra and Nagar Haveli and Daman and Diu', description: 'Colonial coastal town with Moti Daman Fort, Nani Daman, and palm-fringed beaches.' },
  { name: 'Diu', slug: 'diu', state: 'Dadra and Nagar Haveli and Daman and Diu', description: 'Peaceful island off Gujarat coast featuring Diu Fort, St Pauls Church, and Nagoa Beach.' },
  { name: 'Silvassa', slug: 'silvassa', state: 'Dadra and Nagar Haveli and Daman and Diu', description: 'Capital of Dadra and Nagar Haveli surrounded by tribal art, gardens, and reservoirs.' },

  // Delhi
  { name: 'Delhi', slug: 'delhi', state: 'Delhi', description: 'National capital territory steeped in centuries of history, monuments, and culinary delights.' },
  { name: 'New Delhi', slug: 'new-delhi', state: 'Delhi', description: 'National capital with India Gate, Rashtrapati Bhavan, Humayuns Tomb, and Qutub Minar.' },
  { name: 'Old Delhi', slug: 'old-delhi', state: 'Delhi', description: 'Mughal heart of Shahjahanabad with Red Fort, Jama Masjid, and Chandni Chowk lanes.' },

  // Jammu and Kashmir
  { name: 'Srinagar', slug: 'srinagar', state: 'Jammu and Kashmir', description: 'Paradise on Earth with Dal Lake houseboats, Mughal gardens, and shikara rides.' },
  { name: 'Gulmarg', slug: 'gulmarg', state: 'Jammu and Kashmir', description: 'Meadow of Flowers famous for world-class skiing, gondola ride, and pine valleys.' },
  { name: 'Pahalgam', slug: 'pahalgam', state: 'Jammu and Kashmir', description: 'Valley of Shepherds along the Lidder River, starting point for the Amarnath Yatra.' },
  { name: 'Sonamarg', slug: 'sonamarg', state: 'Jammu and Kashmir', description: 'Meadow of Gold surrounded by Thajiwas Glacier and gateway to Ladakh.' },
  { name: 'Jammu', slug: 'jammu', state: 'Jammu and Kashmir', description: 'City of Temples and winter capital, base for the sacred Vaishno Devi pilgrimage.' },

  // Ladakh
  { name: 'Leh', slug: 'leh', state: 'Ladakh', description: 'High-altitude capital with Leh Palace, Shanti Stupa, Thiksey Monastery, and Khardung La.' },
  { name: 'Nubra Valley', slug: 'nubra-valley', state: 'Ladakh', description: 'Valley of Flowers in cold desert with double-humped Bactrian camels and Diskit Monastery.' },
  { name: 'Pangong Lake', slug: 'pangong-lake', state: 'Ladakh', description: 'Breathtaking endorheic high-altitude lake shifting shades of blue across the Himalayas.' },
  { name: 'Tso Moriri', slug: 'tso-moriri', state: 'Ladakh', description: 'Serene high-altitude wetland sanctuary surrounded by snow-clad peaks.' },

  // Lakshadweep
  { name: 'Kavaratti', slug: 'kavaratti', state: 'Lakshadweep', description: 'Island capital with coral reefs, coconut canopies, and marine aquarium.' },
  { name: 'Agatti', slug: 'agatti', state: 'Lakshadweep', description: 'Gateway island with stunning airstrip surrounded by turquoise lagoons and diving.' },
  { name: 'Bangaram', slug: 'bangaram', state: 'Lakshadweep', description: 'Uninhabited teardrop atoll renowned for bioluminescent beaches and coral atolls.' },

  // Puducherry
  { name: 'Puducherry', slug: 'puducherry', state: 'Puducherry', description: 'French colonial town with Promenade Beach, French Quarter villas, and Sri Aurobindo Ashram.' },
  { name: 'Auroville', slug: 'auroville', state: 'Puducherry', description: 'Universal experimental township dedicated to human unity featuring the golden Matrimandir.' }
];

export async function seedAllDestinations() {
  for (const d of ALL_INDIA_DESTINATIONS) {
    const existing = await pool.query('SELECT id FROM destinations WHERE slug = $1', [d.slug]);
    if (existing.rows.length === 0) {
      await pool.query(`
        INSERT INTO destinations (
          name, slug, state, country, description, latitude, longitude,
          image_url, total_reviews, avg_rating, positive_pct, neutral_pct, negative_pct, intelligence_score
        )
        VALUES ($1, $2, $3, 'India', $4, 20.0, 78.0, '/images/default.jpg', 0, 0, 0, 0, 0, 0)
      `, [d.name, d.slug, d.state, d.description]);
    }
  }
}
