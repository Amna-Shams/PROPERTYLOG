export interface NearbyPlaces {
  schools: string[];
  hospitals: string[];
  markets: string[];
  mosques: string[];
}

export interface AmenityCategories {
  basic: string[];
  utilities: string[];
  security: string[];
  community: string[];
}

export interface RentalProperty {
  id: string;
  title: string;
  description: string;
  property_type: string;
  status: 'available' | 'rented' | 'maintenance';
  price: number;
  currency: string;
  period: string;
  
  // Location
  area: string;
  city: string;
  province: string;
  latitude: number;
  longitude: number;
  landmark?: string;
  street_address: string;
  nearby_places: NearbyPlaces;
  
  // Features
  bedrooms: number;
  bathrooms: number;
  area_sqft: number;
  parking: number;
  floor?: number;
  total_floors?: number;
  year_built?: number;
  
  // Amenities
  amenities: AmenityCategories;
  
  // Media
  images: string[];
  video_url?: string;
  virtual_tour_url?: string;
  floor_plan_url?: string;
  
  // Additional
  furnished: 'fully' | 'semi' | 'unfurnished';
  available_from: string;
  lease_duration: string;
  views: number;
  favorites_count: number;
  
  // Property Manager
  manager_name: string;
  manager_phone: string;
  manager_email: string;
  manager_company: string;
  
  // Timestamps
  created_at: string;
  listed_date: string;
}

export const RENTAL_PROPERTIES: RentalProperty[] = [
  {
    id: "rent-1",
    title: "Oakridge Premium Family Villa",
    description: "Nestled in the prime area of Model Town, this breathtaking 5-bedroom luxury villa offers a flawless lifestyle for families seeking executive comfort. Featuring state-of-the-art marble flooring, high ceiling architecture, smart home automation, and a lush green private garden. The spacious drawing and dining rooms are perfect for hosting gatherings, while the dual modular kitchens cater to all culinary needs with built-in European appliances. A separate servant quarter and extensive basement storage are included.",
    property_type: "House",
    status: "available",
    price: 320000,
    currency: "PKR",
    period: "month",
    area: "Model Town Block C",
    city: "Lahore",
    province: "Punjab",
    latitude: 31.4822,
    longitude: 74.3211,
    landmark: "Near Model Town Park",
    street_address: "House 45-C, Street 12, Block C, Model Town",
    nearby_places: {
      schools: ["The City School Model Town Campus (0.6 km)", "Lahore Grammar School (1.2 km)"],
      hospitals: ["Model Town Hospital (0.4 km)", "Ittefaq Hospital (2.1 km)"],
      markets: ["C-Block Central Market (0.3 km)", "Link Road Shopping Area (1.5 km)"],
      mosques: ["Jamia Masjid Al-Fatah (0.2 km)"]
    },
    bedrooms: 5,
    bathrooms: 6,
    area_sqft: 4500,
    parking: 3,
    floor: 1,
    total_floors: 2,
    year_built: 2023,
    amenities: {
      basic: ["Drawing Room", "Servant Quarters", "Lawn/Garden", "Store Room", "Built-in Wardrobes"],
      utilities: ["Solar Energy System (15KW)", "WASA Water Supply", "Sui Gas Supply", "UPS/Inverter Backup"],
      security: ["24/7 Gated Community Guard", "CCTV Surveillance System", "Boundary Wall Fence", "Intercom System"],
      community: ["Walking/Jogging Track", "Near Central Park", "Children's Playground"]
    },
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1000&auto=format&fit=crop&q=80"
    ],
    video_url: "https://www.youtube.com/watch?v=mock-video-1",
    virtual_tour_url: "https://my.matterport.com/show/?m=mock-tour-1",
    floor_plan_url: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800&auto=format&fit=crop&q=80",
    furnished: "fully",
    available_from: "2026-07-01",
    lease_duration: "1 Year Minimum",
    views: 1420,
    favorites_count: 58,
    manager_name: "Muhammad Ali",
    manager_phone: "+92 300 1234567",
    manager_email: "ali@proptech.pk",
    manager_company: "PropTech Premium Listings",
    created_at: "2026-05-15T08:00:00Z",
    listed_date: "2026-05-15"
  },
  {
    id: "rent-2",
    title: "Ocean Breeze Luxury Heights",
    description: "Experience world-class coastal living in the heart of Clifton, Karachi. This spectacular 3-bedroom luxury apartment offers unobstructed panoramic views of the Arabian Sea. Designed for discerning professionals and modern families, it includes premium travertine flooring, floor-to-ceiling double-glazed glass windows, and a generous sea-facing balcony. Residents enjoy secure basement parking, high-speed passenger and cargo elevators, robust 24/7 power backup, and access to a rooftop infinity gym and pool deck.",
    property_type: "Apartment",
    status: "available",
    price: 185000,
    currency: "PKR",
    period: "month",
    area: "Clifton Block 4",
    city: "Karachi",
    province: "Sindh",
    latitude: 24.8138,
    longitude: 67.0284,
    landmark: "Opposite Clifton Beach",
    street_address: "Tower B, Apartment 802, Ocean Breeze Heights, Clifton Block 4",
    nearby_places: {
      schools: ["Karachi Grammar School Clifton (1.1 km)", "St. Michael's Convent School (1.5 km)"],
      hospitals: ["South City Hospital (0.8 km)", "Medwin Hospital (2.3 km)"],
      markets: ["Dolmen Mall Clifton (1.2 km)", "Clifton Block 4 Local Market (0.5 km)"],
      mosques: ["Masjid-e-Tooba (3.0 km)", "Clifton Mosque (0.3 km)"]
    },
    bedrooms: 3,
    bathrooms: 3,
    area_sqft: 2200,
    parking: 2,
    floor: 8,
    total_floors: 15,
    year_built: 2021,
    amenities: {
      basic: ["Sea View Balcony", "Central Heating/Cooling Ready", "High Ceilings", "Store/Pantry Room", "Fitted Kitchen Cabinets"],
      utilities: ["24/7 Standby Generator Backup", "K-Electric Grid", "Sub-soil Reverse Osmosis Water Plant", "Gas Cylinder Line"],
      security: ["Biometric Lift Access", "Armed Security Guard Force", "Fire Escape & Detection System", "CCTV Monitoring"],
      community: ["Rooftop Shared Gym", "Swimming Pool Access", "Executive Waiting Lounge"]
    },
    images: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1000&auto=format&fit=crop&q=80"
    ],
    video_url: "https://www.youtube.com/watch?v=mock-video-2",
    virtual_tour_url: "",
    floor_plan_url: "",
    furnished: "semi",
    available_from: "2026-07-15",
    lease_duration: "1 Year Minimum",
    views: 2450,
    favorites_count: 112,
    manager_name: "Kamran Shah",
    manager_phone: "+92 321 9876543",
    manager_email: "kamran@cliftonrentals.pk",
    manager_company: "Clifton Estate & Rental Group",
    created_at: "2026-06-01T11:30:00Z",
    listed_date: "2026-06-01"
  },
  {
    id: "rent-3",
    title: "Margalla Hills Scenic Townhouse",
    description: "A masterfully crafted modern townhouse offering scenic, serene views of the Margalla Hills. Located in the ultra-prestigious Sector F-7, this 4-bedroom property features contemporary architecture with tall pane glass, Spanish tile floors, a fully equipped gourmet kitchen with quartz countertops, and dedicated climate zoning. The property also boasts an eco-friendly solar water heating system, premium fiberglass window shutters, a cozy private patio, and 2-car covered garage space.",
    property_type: "House",
    status: "available",
    price: 280000,
    currency: "PKR",
    period: "month",
    area: "Sector F-7/2",
    city: "Islamabad",
    province: "Islamabad Capital Territory",
    latitude: 33.7294,
    longitude: 73.0511,
    landmark: "Near Jinnah Super Market",
    street_address: "House 122-A, Street 44, Sector F-7/2",
    nearby_places: {
      schools: ["Headstart School F-7 Campus (0.9 km)", "Froebel's International (1.8 km)"],
      hospitals: ["Kulsum International Hospital (2.5 km)", "Ali Medical Centre (1.1 km)"],
      markets: ["Jinnah Super Market (F-7 Markaz) (0.5 km)", "Safa Gold Mall (0.8 km)"],
      mosques: ["F-7/2 Sector Mosque (0.2 km)", "Faisal Mosque (2.9 km)"]
    },
    bedrooms: 4,
    bathrooms: 5,
    area_sqft: 3400,
    parking: 2,
    floor: 1,
    total_floors: 2,
    year_built: 2022,
    amenities: {
      basic: ["Margalla View Patio", "Drawing & Dining Room", "Open-plan Family Lounge", "Powder Room", "Servant Room"],
      utilities: ["10KW Hybrid Solar Inverter", "Capital WASA Water Supply", "Sui Gas Pipe Connection", "Fiber Optic Internet Connection"],
      security: ["Security Guard Cabin", "Smart Keyless Lock Entry", "High Boundary Walls with Razor Wire", "CCTV DVR Setup"],
      community: ["Close to F-7 Playground", "Near Margalla Hiking Trail 3", "Quiet Tree-lined Street"]
    },
    images: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1000&auto=format&fit=crop&q=80"
    ],
    video_url: "",
    virtual_tour_url: "",
    floor_plan_url: "",
    furnished: "unfurnished",
    available_from: "2026-06-30",
    lease_duration: "1 to 2 Years",
    views: 890,
    favorites_count: 42,
    manager_name: "Zainab Malik",
    manager_phone: "+92 333 4567890",
    manager_email: "zainab@islamabadrealestate.pk",
    manager_company: "Capital Choice Associates",
    created_at: "2026-06-10T14:15:00Z",
    listed_date: "2026-06-10"
  },
  {
    id: "rent-4",
    title: "DHA Phase 6 Executive Penthouse",
    description: "A pinnacle of luxury in Pakistan's premium community. This newly listed 4-bedroom executive penthouse spans the entire top floor of the prestigious Al-Ghurair Boulevard. Featuring grand entrance vestibules, high-grade hardwood flooring, customized Italian wardrobes, ambient cove lighting, and automated curtain tracks. The master bath is fitted with a luxury walk-in jacuzzi shower. Outside, enjoy a massive private open terrace space ideal for rooftop barbeques while taking in the sunset over Karachi's skyline.",
    property_type: "Condo",
    status: "available",
    price: 450000,
    currency: "PKR",
    period: "month",
    area: "DHA Phase 6",
    city: "Karachi",
    province: "Sindh",
    latitude: 24.7952,
    longitude: 67.0621,
    landmark: "Near Bukhari Commercial",
    street_address: "Penthouse A, Al-Ghurair Boulevard, Main Khyaban-e-Ittehad, DHA Phase 6",
    nearby_places: {
      schools: ["CBM University (2.2 km)", "Beaconhouse School System DHA (1.1 km)"],
      hospitals: ["DHA Medical Centre (1.3 km)", "South City Hospital (4.5 km)"],
      markets: ["Bukhari Commercial Area (0.4 km)", "Ittehad Commercial Shops (0.2 km)"],
      mosques: ["Masjid-e-Ayesha (0.6 km)"]
    },
    bedrooms: 4,
    bathrooms: 5,
    area_sqft: 5200,
    parking: 3,
    floor: 6,
    total_floors: 6,
    year_built: 2024,
    amenities: {
      basic: ["Massive Private Rooftop", "Drawing & Dining Areas", "Luxury Oakwood Dry Kitchen", "Wet Prep Kitchen", "Storage Lockers"],
      utilities: ["25KW Silent Power Generator", "K-Electric Triple Phase Grid", "Water Tanker Service Desk", "Central Water Filtration Plant"],
      security: ["Biometric Private Elevator In-Suite", "24/7 CCTV Monitoring Room", "Intercom to Reception Desk", "Panic Button Alarm"],
      community: ["Basement Health Club Gym", "Private Resident Lounge", "Indoor Kids Play Zone"]
    },
    images: [
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1000&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=1000&auto=format&fit=crop&q=80"
    ],
    video_url: "",
    virtual_tour_url: "",
    floor_plan_url: "",
    furnished: "fully",
    available_from: "2026-08-01",
    lease_duration: "2 Years Minimum",
    views: 3100,
    favorites_count: 145,
    manager_name: "Yousuf Khan",
    manager_phone: "+92 345 5551234",
    manager_email: "yousuf@gloriousestates.pk",
    manager_company: "Glorious Realtors Pakistan",
    created_at: "2026-05-20T16:45:00Z",
    listed_date: "2026-05-20"
  },
  {
    id: "rent-5",
    title: "Bahria Town Elegant Corner Portion",
    description: "Fabulous opportunity to rent a modern, spacious 3-bedroom corner ground portion in Bahria Town Sector C, Lahore. Known for its perfect infrastructure, load-shedding free power grids, and wide green avenues. This ground portion boasts an open layout, a stunning American kitchen with granite countertops, premium tile baths with high-grade fixtures, a private rear lawn, and dedicated parking. Ideal for families looking for peaceful living in Lahore's most secure and fully-featured gated community.",
    property_type: "Apartment",
    status: "available",
    price: 135000,
    currency: "PKR",
    period: "month",
    area: "Bahria Town Sector C",
    city: "Lahore",
    province: "Punjab",
    latitude: 31.3741,
    longitude: 74.1852,
    landmark: "Near Grand Jamia Mosque",
    street_address: "House 245, Street 8, Sector C, Bahria Town",
    nearby_places: {
      schools: ["Bahria Town School & College (0.8 km)", "Beaconhouse Bahria Campus (1.5 km)"],
      hospitals: ["Bahria International Hospital (1.1 km)"],
      markets: ["Safari Mall Bahria Town (0.9 km)", "Sector C Commercial Area (0.4 km)"],
      mosques: ["Grand Jamia Mosque Bahria Town (1.2 km)", "Sector C Mosque (0.3 km)"]
    },
    bedrooms: 3,
    bathrooms: 4,
    area_sqft: 2400,
    parking: 1,
    floor: 1,
    total_floors: 2,
    year_built: 2022,
    amenities: {
      basic: ["Private Backyard Lawn", "Spacious TV Lounge", "Fitted Wardrobes", "Corner Street Frontage", "Store Closet"],
      utilities: ["Uninterrupted Gated Power Grid", "Bahria Water Supply System", "Sui Gas Supply Connection", "High-speed Wi-Fi Access"],
      security: ["Bahria Patrol Guards", "CCTV Perimeter Cameras", "Intercom Console", "Secured Entry Point Gate"],
      community: ["Bahria Sector C Park", "Near Theme Park & Zoo", "Near Cineplex Cinema"]
    },
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=1000&auto=format&fit=crop&q=80"
    ],
    video_url: "",
    virtual_tour_url: "",
    floor_plan_url: "",
    furnished: "unfurnished",
    available_from: "2026-07-01",
    lease_duration: "1 Year",
    views: 650,
    favorites_count: 29,
    manager_name: "Bilal Butt",
    manager_phone: "+92 301 8887766",
    manager_email: "bilal@bahriahomes.pk",
    manager_company: "Bahria Homes Real Estate",
    created_at: "2026-06-18T10:00:00Z",
    listed_date: "2026-06-18"
  },
  {
    id: "rent-6",
    title: "Cozy Garden Cottage E-11",
    description: "Tucked away in a quiet residential cul-de-sac of Sector E-11, Islamabad, this beautiful 2-bedroom garden cottage represents the ultimate cozy retreat. The property features a gorgeous private garden blooming with local flora, high ceilings with rustic wooden beams, premium tile bathrooms, and an open brick fireplace. Fitted with a solid water bore system and automated UPS power inverters to ensure absolute peace of mind regardless of weather.",
    property_type: "House",
    status: "available",
    price: 115000,
    currency: "PKR",
    period: "month",
    area: "Sector E-11/4",
    city: "Islamabad",
    province: "Islamabad Capital Territory",
    latitude: 33.7011,
    longitude: 72.9811,
    landmark: "Near Markaz Sector E-11",
    street_address: "Cottage 5-B, Street 18-A, Sector E-11/4",
    nearby_places: {
      schools: ["The Smart School E-11 (1.0 km)", "OPF Boys College (2.2 km)"],
      hospitals: ["NIRM Hospital (3.5 km)", "Local E-11 Clinic (0.4 km)"],
      markets: ["E-11 Markaz Markets (0.6 km)", "Golra Mor Shopping Hub (2.5 km)"],
      mosques: ["E-11 Sector Mosque (0.3 km)"]
    },
    bedrooms: 2,
    bathrooms: 2,
    area_sqft: 1500,
    parking: 1,
    floor: 1,
    total_floors: 1,
    year_built: 2019,
    amenities: {
      basic: ["Private Floral Garden", "Open Brick Fireplace", "Cozy Attic Storage", "Dry Kitchen with Pantry"],
      utilities: ["Dedicated Private Water Bore", "WAPDA Grid Connection", "LPG Cylinder Setup", "1.5KVA Smart UPS Inverter System"],
      security: ["High Boundary Walls", "Double Entry Secure Gates", "Street Security Patrols"],
      community: ["Quiet Walking Trails", "Near Margalla Foothills", "Community Sports Ground"]
    },
    images: [
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=1200&auto=format&fit=crop&q=80",
      "https://images.unsplash.com/photo-1598228723793-52759bba2457?w=1000&auto=format&fit=crop&q=80"
    ],
    video_url: "",
    virtual_tour_url: "",
    floor_plan_url: "",
    furnished: "semi",
    available_from: "2026-07-01",
    lease_duration: "1 Year Minimum",
    views: 1200,
    favorites_count: 73,
    manager_name: "Fatima Noor",
    manager_phone: "+92 312 3456789",
    manager_email: "fatima@capitalcottages.pk",
    manager_company: "Capital Cozy Cottages",
    created_at: "2026-06-22T08:30:00Z",
    listed_date: "2026-06-22"
  }
];
