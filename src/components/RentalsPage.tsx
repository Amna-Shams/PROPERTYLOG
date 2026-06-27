import React, { useState, useMemo, useEffect } from "react";
import { 
  Search, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Car, 
  SlidersHorizontal, 
  ChevronRight, 
  Heart, 
  Sparkles, 
  Building,
  RotateCcw,
  Tag,
  Clock,
  Eye,
  CheckCircle2
} from "lucide-react";
import { RentalProperty } from "../data/rentalProperties";
import { formatPKR } from "../utils/currency";
import { motion, AnimatePresence } from "motion/react";
import { useApp } from "../context/AppContext";

interface RentalsPageProps {
  setCurrentPath: (path: string) => void;
}

export const RentalsPage: React.FC<RentalsPageProps> = ({ setCurrentPath }) => {
  const { rentalProperties } = useApp();

  // Search and Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [selectedBeds, setSelectedBeds] = useState("All");
  const [selectedFurnished, setSelectedFurnished] = useState("All");
  const [sortBy, setSortBy] = useState("featured");
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Favorites tracking (using localStorage for persistence without logging in)
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("discovery_favorites");
    return saved ? JSON.parse(saved) : [];
  });

  // Track page views locally to simulate engagement
  const [viewedProperties, setViewedProperties] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("discovery_views");
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem("discovery_favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(favId => favId !== id) : [...prev, id]
    );
  };

  // Extract cities and types dynamically
  const citiesList = useMemo(() => {
    const cities = rentalProperties.map(p => p.city);
    return ["All", ...Array.from(new Set(cities))];
  }, [rentalProperties]);

  const typesList = useMemo(() => {
    const types = rentalProperties.map(p => p.property_type);
    return ["All", ...Array.from(new Set(types))];
  }, [rentalProperties]);

  // Filter and Sort properties
  const filteredProperties = useMemo(() => {
    return rentalProperties.filter(property => {
      // Keyword search (title, description, area, city, landmarks)
      const matchesSearch = searchQuery === "" || 
        property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
        property.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (property.landmark && property.landmark.toLowerCase().includes(searchQuery.toLowerCase()));

      // City filter
      const matchesCity = selectedCity === "All" || property.city === selectedCity;

      // Property Type filter
      const matchesType = selectedType === "All" || property.property_type === selectedType;

      // Price filter
      const matchesPrice = property.price >= priceRange[0] && property.price <= priceRange[1];

      // Bedrooms filter
      const matchesBeds = selectedBeds === "All" || 
        (selectedBeds === "4+" ? property.bedrooms >= 4 : property.bedrooms === parseInt(selectedBeds));

      // Furnished filter
      const matchesFurnished = selectedFurnished === "All" || property.furnished === selectedFurnished;

      return matchesSearch && matchesCity && matchesType && matchesPrice && matchesBeds && matchesFurnished;
    }).sort((a, b) => {
      if (sortBy === "price-low") return a.price - b.price;
      if (sortBy === "price-high") return b.price - a.price;
      if (sortBy === "views") return (b.views + (viewedProperties[b.id] || 0)) - (a.views + (viewedProperties[a.id] || 0));
      return b.favorites_count - a.favorites_count; // Featured default
    });
  }, [rentalProperties, searchQuery, selectedCity, selectedType, priceRange, selectedBeds, selectedFurnished, sortBy, viewedProperties]);

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCity("All");
    setSelectedType("All");
    setPriceRange([0, 500000]);
    setSelectedBeds("All");
    setSelectedFurnished("All");
    setSortBy("featured");
  };

  const handleCardClick = (id: string) => {
    // Record view locally
    const currentViews = { ...viewedProperties, [id]: (viewedProperties[id] || 0) + 1 };
    setViewedProperties(currentViews);
    localStorage.setItem("discovery_views", JSON.stringify(currentViews));
    
    // Route to detail page
    setCurrentPath(`/property-detail/${id}`);
  };

  return (
    <div id="rentals-discovery" className="min-h-screen bg-slate-50/50 pb-16">
      
      {/* Banner / Hero Header */}
      <section className="relative bg-slate-900 py-16 md:py-20 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/60 to-transparent" />
        
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold rounded-full"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Discover Premium Rentals in Pakistan
          </motion.div>
          <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight">
            Find Your Next Perfect Address
          </h1>
          <p className="text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            Browse freely without credentials. Filter, search, and inspect stunning verified homes, executive villas, and high-rise apartments in Karachi, Lahore, and Islamabad.
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-2xl mx-auto relative mt-4">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city, area, landmark, or features (e.g. Clifton, garden, 4 bed)..."
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white focus:text-slate-900 transition-all shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Main Browse Grid & Filters */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar Filters (Desktop) */}
          <div className="hidden lg:block space-y-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm sticky top-24">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <span className="font-display font-bold text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-blue-600" /> Filters
                </span>
                <button 
                  onClick={resetFilters}
                  className="text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1"
                >
                  <RotateCcw className="h-3 w-3" /> Reset
                </button>
              </div>

              {/* City Filter */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">City</label>
                <div className="flex flex-wrap gap-1.5">
                  {citiesList.map(city => (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-xl border transition-all ${
                        selectedCity === city
                          ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-600/15"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {city}
                    </button>
                  ))}
                </div>
              </div>

              {/* Property Type Filter */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Property Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full text-xs font-semibold text-slate-700 border border-slate-200 bg-white rounded-xl p-2.5 outline-none focus:border-blue-500 transition-colors"
                >
                  {typesList.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              {/* Bedrooms Filter */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Bedrooms</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {["All", "2", "3", "4+"].map(bed => (
                    <button
                      key={bed}
                      onClick={() => setSelectedBeds(bed)}
                      className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                        selectedBeds === bed
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {bed}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2 mb-5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Monthly Rent (PKR)</label>
                </div>
                <div className="space-y-3 pt-1">
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between items-center gap-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px] font-mono text-slate-600 flex-1 text-center">
                      Min: {formatPKR(priceRange[0])}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[11px] font-mono text-slate-600 flex-1 text-center">
                      Max: {formatPKR(priceRange[1])}
                    </div>
                  </div>
                </div>
              </div>

              {/* Furnished Status */}
              <div className="space-y-2 mb-5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Furnishing</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {[
                    { label: "All", value: "All" },
                    { label: "Fully", value: "fully" },
                    { label: "Semi", value: "semi" },
                    { label: "Unfurnished", value: "unfurnished" }
                  ].map(opt => (
                    <button
                      key={opt.value}
                      onClick={() => setSelectedFurnished(opt.value)}
                      className={`py-1.5 px-1 text-[11px] font-semibold rounded-xl border transition-all capitalize ${
                        selectedFurnished === opt.value
                          ? "bg-blue-600 border-blue-600 text-white"
                          : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Listings Container */}
          <div className="lg:col-span-3 space-y-6">
            
            {/* Search stats and sort controls */}
            <div className="bg-white border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
              <div className="text-slate-600 text-xs sm:text-sm font-medium">
                We found <span className="text-blue-600 font-bold font-display text-base">{filteredProperties.length}</span> verified premium properties for you
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                {/* Mobile Filter Button */}
                <button
                  onClick={() => setShowFiltersMobile(true)}
                  className="flex lg:hidden items-center justify-center gap-1.5 px-4 py-2 border border-slate-200 text-slate-600 text-xs font-bold rounded-xl bg-slate-50/50 hover:bg-slate-50 flex-1"
                >
                  <SlidersHorizontal className="h-4 w-4" /> Filters
                </button>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 text-xs font-semibold text-slate-700 border border-slate-200 bg-white rounded-xl outline-none focus:border-blue-500 min-w-[130px]"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-low">Rent: Low to High</option>
                  <option value="price-high">Rent: High to Low</option>
                  <option value="views">Most Viewed</option>
                </select>
              </div>
            </div>

            {/* Properties Grid */}
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property, idx) => {
                  const isFav = favorites.includes(property.id);
                  const viewCount = property.views + (viewedProperties[property.id] || 0);
                  
                  return (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      onClick={() => handleCardClick(property.id)}
                      className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:shadow-slate-100/50 hover:border-slate-200/60 transition-all duration-300 group cursor-pointer flex flex-col justify-between"
                    >
                      {/* Image Frame */}
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100 shrink-0">
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />

                        {/* Top floating badges */}
                        <div className="absolute top-4 left-4 right-4 flex justify-between items-center pointer-events-none">
                          <span className="px-3 py-1.5 bg-slate-900/85 backdrop-blur-md text-white font-bold text-[10px] uppercase tracking-wider rounded-xl flex items-center gap-1 shadow">
                            <Building className="h-3 w-3 text-blue-400" />
                            {property.property_type}
                          </span>
                          
                          {/* Heart Icon Button */}
                          <button
                            onClick={(e) => toggleFavorite(property.id, e)}
                            className="pointer-events-auto h-8 w-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-slate-600 hover:text-rose-500 flex items-center justify-center transition-all shadow active:scale-95"
                          >
                            <Heart className={`h-4.5 w-4.5 ${isFav ? "fill-rose-500 text-rose-500" : ""}`} />
                          </button>
                        </div>

                        {/* Bottom floating details */}
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
                          <div className="space-y-1">
                            <div className="text-[10px] font-extrabold uppercase tracking-widest text-blue-300 flex items-center gap-1">
                              <MapPin className="h-3 w-3 text-blue-300" />
                              {property.area}
                            </div>
                            <h3 className="font-display font-bold text-sm sm:text-base line-clamp-1">
                              {property.title}
                            </h3>
                          </div>
                          
                          {/* Viewed badge if simulated locally */}
                          {viewedProperties[property.id] > 0 && (
                            <span className="px-2 py-0.5 bg-emerald-500/95 backdrop-blur-md text-white font-bold text-[9px] uppercase tracking-wider rounded flex items-center gap-0.5">
                              <CheckCircle2 className="h-2.5 w-2.5" /> Viewed
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Content Details */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        {/* Specs row */}
                        <div className="grid grid-cols-4 gap-2 py-3 border-y border-slate-50 text-slate-500">
                          <div className="flex flex-col items-center justify-center text-center">
                            <BedDouble className="h-4 w-4 text-slate-400 mb-1" />
                            <span className="text-xs font-bold text-slate-800">{property.bedrooms} Beds</span>
                          </div>
                          <div className="flex flex-col items-center justify-center text-center border-l border-slate-100">
                            <Bath className="h-4 w-4 text-slate-400 mb-1" />
                            <span className="text-xs font-bold text-slate-800">{property.bathrooms} Baths</span>
                          </div>
                          <div className="flex flex-col items-center justify-center text-center border-l border-slate-100">
                            <Maximize2 className="h-4 w-4 text-slate-400 mb-1" />
                            <span className="text-xs font-bold text-slate-800 truncate max-w-full">{property.area_sqft} SqFt</span>
                          </div>
                          <div className="flex flex-col items-center justify-center text-center border-l border-slate-100">
                            <Car className="h-4 w-4 text-slate-400 mb-1" />
                            <span className="text-xs font-bold text-slate-800">{property.parking} Park</span>
                          </div>
                        </div>

                        {/* Description snippet */}
                        <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                          {property.description}
                        </p>

                        {/* Footer Price & Navigation */}
                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">
                              Monthly Rent
                            </span>
                            <span className="font-display font-black text-blue-600 text-lg">
                              {formatPKR(property.price)}
                            </span>
                          </div>

                          <button
                            onClick={() => handleCardClick(property.id)}
                            className="inline-flex items-center gap-1 px-4 py-2 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md group-hover:shadow-blue-600/10"
                          >
                            View Details <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              // Empty search state
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white border border-slate-100 rounded-3xl p-12 text-center space-y-4 shadow-sm"
              >
                <div className="h-14 w-14 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center mx-auto">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="font-display font-bold text-slate-800 text-lg">No Rentals Found</h3>
                <p className="text-slate-500 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
                  We couldn't find any listings matching your search parameters. Try expanding your filters or search keywords.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/10 transition-colors"
                >
                  Reset All Filters
                </button>
              </motion.div>
            )}

          </div>

        </div>
      </div>

      {/* Slide-out Drawer for Mobile Filters */}
      <AnimatePresence>
        {showFiltersMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFiltersMobile(false)}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            />
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white shadow-2xl p-6 overflow-y-auto flex flex-col justify-between lg:hidden"
            >
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                  <span className="font-display font-bold text-slate-900 flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-blue-600" /> Mobile Filters
                  </span>
                  <button
                    onClick={() => setShowFiltersMobile(false)}
                    className="h-8 w-8 rounded-full bg-slate-50 text-slate-500 hover:bg-slate-100 flex items-center justify-center font-bold text-sm"
                  >
                    ✕
                  </button>
                </div>

                {/* City Filter */}
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">City</label>
                  <div className="flex flex-wrap gap-1.5">
                    {citiesList.map(city => (
                      <button
                        key={city}
                        onClick={() => setSelectedCity(city)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                          selectedCity === city
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Property Type</label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full text-xs font-semibold text-slate-700 border border-slate-200 bg-white rounded-xl p-2.5 outline-none focus:border-blue-500"
                  >
                    {typesList.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Bedrooms */}
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Bedrooms</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["All", "2", "3", "4+"].map(bed => (
                      <button
                        key={bed}
                        onClick={() => setSelectedBeds(bed)}
                        className={`py-1.5 text-xs font-semibold rounded-xl border transition-all ${
                          selectedBeds === bed
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {bed}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Monthly Rent (PKR)</label>
                  <input
                    type="range"
                    min="50000"
                    max="500000"
                    step="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-blue-600 cursor-pointer"
                  />
                  <div className="flex justify-between items-center gap-2 mt-2">
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-mono text-slate-600 flex-1 text-center">
                      Min: {formatPKR(priceRange[0])}
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-1.5 text-[10px] font-mono text-slate-600 flex-1 text-center">
                      Max: {formatPKR(priceRange[1])}
                    </div>
                  </div>
                </div>

                {/* Furnished */}
                <div className="space-y-2 mb-6">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Furnishing</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {["All", "fully", "semi", "unfurnished"].map(opt => (
                      <button
                        key={opt}
                        onClick={() => setSelectedFurnished(opt)}
                        className={`py-1.5 text-[10px] font-semibold rounded-xl border capitalize transition-all ${
                          selectedFurnished === opt
                            ? "bg-blue-600 border-blue-600 text-white"
                            : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => {
                    resetFilters();
                    setShowFiltersMobile(false);
                  }}
                  className="flex-1 py-3 text-xs font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50"
                >
                  Reset All
                </button>
                <button
                  onClick={() => setShowFiltersMobile(false)}
                  className="flex-1 py-3 text-xs font-bold text-white bg-blue-600 rounded-xl hover:bg-blue-500 shadow-lg shadow-blue-600/10"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

    </div>
  );
};
