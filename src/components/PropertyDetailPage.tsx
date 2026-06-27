import React, { useState, useMemo, useEffect } from "react";
import { 
  ArrowLeft, 
  MapPin, 
  BedDouble, 
  Bath, 
  Maximize2, 
  Car, 
  Calendar, 
  User, 
  Phone, 
  Mail, 
  Compass, 
  ShieldAlert, 
  Sparkles, 
  Check, 
  Flame, 
  Heart, 
  Share2, 
  MessageSquare,
  School,
  Activity,
  ShoppingBag,
  Clock,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Send,
  Lock,
  ChevronDown,
  Building,
  CheckCircle2
} from "lucide-react";
import { RENTAL_PROPERTIES, RentalProperty } from "../data/rentalProperties";
import { formatPKR } from "../utils/currency";
import { useApp } from "../context/AppContext";
import { motion, AnimatePresence } from "motion/react";

interface PropertyDetailPageProps {
  propertyId: string;
  setCurrentPath: (path: string) => void;
}

export const PropertyDetailPage: React.FC<PropertyDetailPageProps> = ({ propertyId, setCurrentPath }) => {
  const { addContactInquiry, showToast } = useApp();
  
  // Find active property
  const property = useMemo(() => {
    return RENTAL_PROPERTIES.find(p => p.id === propertyId) || RENTAL_PROPERTIES[0];
  }, [propertyId]);

  // Gallery Active Image
  const [activeImageIdx, setActiveImageIdx] = useState(0);

  // Reset active image on property change
  useEffect(() => {
    setActiveImageIdx(0);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [propertyId]);

  // Favorites state (local state synced to localStorage)
  const [isFavorited, setIsFavorited] = useState(() => {
    const saved = localStorage.getItem("discovery_favorites");
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.includes(property.id);
    }
    return false;
  });

  const handleFavoriteToggle = () => {
    const saved = localStorage.getItem("discovery_favorites");
    let favoritesList: string[] = saved ? JSON.parse(saved) : [];
    
    if (isFavorited) {
      favoritesList = favoritesList.filter(id => id !== property.id);
      setIsFavorited(false);
      showToast("Removed from saved favorites", "info");
    } else {
      favoritesList.push(property.id);
      setIsFavorited(true);
      showToast("Added to saved favorites", "success");
    }
    localStorage.setItem("discovery_favorites", JSON.stringify(favoritesList));
  };

  // Neighborhood map tab category
  const [activeMapTab, setActiveMapTab] = useState<'schools' | 'hospitals' | 'markets' | 'mosques'>('schools');

  // Similar listings (same city or same property type)
  const similarListings = useMemo(() => {
    return RENTAL_PROPERTIES
      .filter(p => p.id !== property.id && (p.city === property.city || p.property_type === property.property_type))
      .slice(0, 3);
  }, [property]);

  // Inquiry Form state
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMsg, setInquiryMsg] = useState(`Hi, I'm interested in renting "${property.title}". Please get back to me as soon as possible.`);
  const [isSubmittingInquiry, setIsSubmittingInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Booking tour states
  const [tourType, setTourType] = useState<"in-person" | "video">("in-person");
  const [tourDate, setTourDate] = useState("");
  const [tourTime, setTourTime] = useState("");
  const [isBookingTour, setIsBookingTour] = useState(false);
  const [tourBooked, setTourBooked] = useState(false);

  // Login prompt overlay state for premium actions
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone) {
      showToast("Please fill in all contact details", "error");
      return;
    }
    setIsSubmittingInquiry(true);
    
    // Simulate API request
    await new Promise(r => setTimeout(r, 1200));
    
    const success = await addContactInquiry({
      name: inquiryName,
      email: inquiryEmail,
      phone: inquiryPhone,
      message: inquiryMsg,
    });

    setIsSubmittingInquiry(false);
    if (success) {
      setInquirySubmitted(true);
      showToast("Inquiry sent to property manager!", "success");
    }
  };

  const handleTourBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tourDate || !tourTime) {
      showToast("Please pick a date and time slot", "error");
      return;
    }
    setIsBookingTour(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsBookingTour(false);
    setTourBooked(true);
    showToast("Viewing request submitted successfully!", "success");
  };

  // Copy shareable link
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast("Shareable page link copied to clipboard!", "success");
  };

  // Helper for map icons
  const getNearbyIcon = (type: string) => {
    switch (type) {
      case "schools": return <School className="h-4 w-4 text-amber-500" />;
      case "hospitals": return <Activity className="h-4 w-4 text-emerald-500" />;
      case "markets": return <ShoppingBag className="h-4 w-4 text-blue-500" />;
      case "mosques": return <Compass className="h-4 w-4 text-indigo-500" />;
      default: return <MapPin className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      
      {/* Top Floating Actions / Navigation bar */}
      <div className="bg-white border-b border-slate-100 py-3.5 sticky top-16 z-30 shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <button
            onClick={() => setCurrentPath("/rentals")}
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 text-xs font-bold transition-colors group px-2 py-1.5 rounded-lg hover:bg-slate-50"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Discovery Portal
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleFavoriteToggle}
              className={`h-9 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center gap-1.5 text-xs font-bold transition-all ${
                isFavorited ? "bg-rose-50 border-rose-100 text-rose-600 hover:bg-rose-100" : ""
              }`}
            >
              <Heart className={`h-4.5 w-4.5 ${isFavorited ? "fill-rose-500 text-rose-500" : ""}`} />
              {isFavorited ? "Saved" : "Save Property"}
            </button>
            <button
              onClick={handleShare}
              className="h-9 w-9 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all"
              title="Copy link"
            >
              <Share2 className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mt-6">
        {/* Title and Address Header */}
        <div className="mb-6 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 bg-blue-50 text-blue-700 font-bold text-[10px] uppercase tracking-wider rounded-lg border border-blue-100 flex items-center gap-1">
              <Building className="h-3.5 w-3.5" />
              {property.property_type}
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase tracking-wider rounded-lg border border-emerald-100 capitalize">
              ● Active Listing
            </span>
            <span className="px-2.5 py-1 bg-slate-100 text-slate-700 font-bold text-[10px] uppercase tracking-wider rounded-lg border border-slate-200 capitalize">
              Furnishing: {property.furnished}
            </span>
          </div>
          <h1 className="font-display font-black text-slate-900 text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight">
            {property.title}
          </h1>
          <p className="text-slate-500 text-xs sm:text-sm flex items-center gap-1.5 font-medium">
            <MapPin className="h-4.5 w-4.5 text-blue-500 shrink-0" />
            {property.street_address}, {property.area}, {property.city}, {property.province}
          </p>
        </div>

        {/* 1. Hero Image Gallery */}
        <section id="gallery-carousel" className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8 bg-white border border-slate-100 rounded-3xl p-3 shadow-sm overflow-hidden">
          {/* Main big display */}
          <div className="md:col-span-8 relative aspect-[16/10] rounded-2xl overflow-hidden bg-slate-100">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeImageIdx}
                src={property.images[activeImageIdx]}
                alt={`${property.title} View ${activeImageIdx + 1}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {/* Nav Arrows */}
            <button
              onClick={() => setActiveImageIdx(prev => prev === 0 ? property.images.length - 1 : prev - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors active:scale-95"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setActiveImageIdx(prev => prev === property.images.length - 1 ? 0 : prev + 1)}
              className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md text-white flex items-center justify-center hover:bg-black/60 transition-colors active:scale-95"
            >
              <ChevronRight className="h-5 w-5" />
            </button>

            {/* Photo Counter Indicator */}
            <span className="absolute bottom-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white font-mono text-xs rounded-full">
              {activeImageIdx + 1} / {property.images.length} Photos
            </span>
          </div>

          {/* Thumbnails grid */}
          <div className="md:col-span-4 flex md:flex-col gap-3 overflow-x-auto md:overflow-x-visible md:overflow-y-auto max-h-full aspect-auto md:aspect-square md:max-h-[500px]">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative flex-1 md:flex-initial aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 shrink-0 border-2 transition-all ${
                  idx === activeImageIdx ? "border-blue-600 scale-[0.98] shadow-md" : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  alt="Thumbnail"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </button>
            ))}
          </div>
        </section>

        {/* Outer Split Layout below Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column (Descriptions, features, map, table) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Quick specifications strip */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-slate-50 rounded-2xl flex flex-col items-center justify-center">
                <BedDouble className="h-5 w-5 text-blue-600 mb-1.5" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Bedrooms</span>
                <span className="text-sm font-black text-slate-800 mt-0.5">{property.bedrooms} Beds</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex flex-col items-center justify-center">
                <Bath className="h-5 w-5 text-blue-600 mb-1.5" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Bathrooms</span>
                <span className="text-sm font-black text-slate-800 mt-0.5">{property.bathrooms} Baths</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex flex-col items-center justify-center">
                <Maximize2 className="h-5 w-5 text-blue-600 mb-1.5" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Total Area</span>
                <span className="text-sm font-black text-slate-800 mt-0.5">{property.area_sqft} Sq. Ft.</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl flex flex-col items-center justify-center">
                <Car className="h-5 w-5 text-blue-600 mb-1.5" />
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Parking Spots</span>
                <span className="text-sm font-black text-slate-800 mt-0.5">{property.parking} Spots</span>
              </div>
            </div>

            {/* 3. Property Description */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="font-display font-extrabold text-slate-900 text-lg md:text-xl tracking-tight border-b border-slate-50 pb-3">
                About this Property Listing
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line font-light">
                {property.description}
              </p>
            </div>

            {/* 4. Features & Amenities Categorized */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="font-display font-extrabold text-slate-900 text-lg md:text-xl tracking-tight border-b border-slate-50 pb-3 flex items-center gap-1.5">
                <Sparkles className="h-5 w-5 text-blue-600" /> Features &amp; Amenities
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Basic Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-500" /> Indoor Spaces &amp; Rooms
                  </h3>
                  <div className="grid grid-cols-1 gap-2 pl-3">
                    {property.amenities.basic.map(item => (
                      <span key={item} className="text-xs text-slate-600 flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" /> {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Utilities Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Utilities &amp; Infrastructure
                  </h3>
                  <div className="grid grid-cols-1 gap-2 pl-3">
                    {property.amenities.utilities.map(item => (
                      <span key={item} className="text-xs text-slate-600 flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" /> {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Security Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500" /> Security &amp; Fire Safety
                  </h3>
                  <div className="grid grid-cols-1 gap-2 pl-3">
                    {property.amenities.security.map(item => (
                      <span key={item} className="text-xs text-slate-600 flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" /> {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Community Section */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" /> Leisure &amp; Community
                  </h3>
                  <div className="grid grid-cols-1 gap-2 pl-3">
                    {property.amenities.community.map(item => (
                      <span key={item} className="text-xs text-slate-600 flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0" /> {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Interactive Map & Nearby Places */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-50 pb-3">
                <h2 className="font-display font-extrabold text-slate-900 text-lg md:text-xl tracking-tight">
                  Neighborhood Location &amp; Landmarks
                </h2>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 font-bold"
                >
                  Open in Google Maps <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {/* Custom High-fidelity Interactive SVG Neighborhood Map */}
              <div className="relative w-full aspect-[2/1] min-h-[220px] rounded-2xl bg-slate-900 overflow-hidden border border-slate-800 flex items-center justify-center text-white">
                {/* Radial glowing network lines */}
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />
                
                {/* Visual streets drawing */}
                <svg className="absolute inset-0 w-full h-full text-slate-800 opacity-60" fill="none">
                  <line x1="10%" y1="0%" x2="10%" y2="100%" stroke="currentColor" strokeWidth="4" />
                  <line x1="50%" y1="0%" x2="50%" y2="100%" stroke="currentColor" strokeWidth="4" />
                  <line x1="85%" y1="0%" x2="85%" y2="100%" stroke="currentColor" strokeWidth="4" />
                  <line x1="0%" y1="30%" x2="100%" y2="30%" stroke="currentColor" strokeWidth="4" />
                  <line x1="0%" y1="75%" x2="100%" y2="75%" stroke="currentColor" strokeWidth="4" />
                  <circle cx="50%" cy="50%" r="90" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
                </svg>

                {/* Target Property Central Pin */}
                <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10">
                  <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center animate-bounce shadow-lg shadow-blue-500/50 border border-white">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div className="mt-1 px-2.5 py-1 bg-blue-900/90 backdrop-blur-md rounded-lg text-[9px] font-bold text-white uppercase tracking-wider text-center border border-blue-700 max-w-[120px] truncate shadow">
                    {property.title}
                  </div>
                </div>

                {/* Interactive Dynamic Nearby Pins depending on selected Map tab */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeMapTab}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute inset-0 pointer-events-none"
                  >
                    {activeMapTab === "schools" && (
                      <>
                        {/* School 1 */}
                        <div className="absolute top-[18%] left-[24%] flex items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow"><School className="h-3.5 w-3.5" /></div>
                          <span className="bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">The City School</span>
                        </div>
                        {/* School 2 */}
                        <div className="absolute top-[65%] left-[78%] flex items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-amber-500 text-white flex items-center justify-center shadow"><School className="h-3.5 w-3.5" /></div>
                          <span className="bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">Grammar School</span>
                        </div>
                      </>
                    )}
                    
                    {activeMapTab === "hospitals" && (
                      <>
                        <div className="absolute top-[24%] left-[68%] flex items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow"><Activity className="h-3.5 w-3.5" /></div>
                          <span className="bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">Central Hospital</span>
                        </div>
                        <div className="absolute top-[80%] left-[20%] flex items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow"><Activity className="h-3.5 w-3.5" /></div>
                          <span className="bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">Medical Clinic</span>
                        </div>
                      </>
                    )}

                    {activeMapTab === "markets" && (
                      <>
                        <div className="absolute top-[42%] left-[15%] flex items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow"><ShoppingBag className="h-3.5 w-3.5" /></div>
                          <span className="bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">Dolmen Mall / Markaz</span>
                        </div>
                        <div className="absolute top-[70%] left-[62%] flex items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-blue-500 text-white flex items-center justify-center shadow"><ShoppingBag className="h-3.5 w-3.5" /></div>
                          <span className="bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">Supermarket</span>
                        </div>
                      </>
                    )}

                    {activeMapTab === "mosques" && (
                      <>
                        <div className="absolute top-[15%] left-[45%] flex items-center gap-1">
                          <div className="h-6 w-6 rounded-full bg-indigo-500 text-white flex items-center justify-center shadow"><Compass className="h-3.5 w-3.5" /></div>
                          <span className="bg-slate-950/80 px-2 py-0.5 rounded text-[9px] font-bold text-white">Central Mosque</span>
                        </div>
                      </>
                    )}
                  </motion.div>
                </AnimatePresence>

                {/* Subtitle details */}
                <div className="absolute bottom-3 left-3 bg-slate-950/70 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-[10px] text-slate-400">
                  Coordinates: {property.latitude}, {property.longitude}
                </div>
              </div>

              {/* Tab Selector & Nearby place descriptions list */}
              <div className="space-y-4">
                <div className="flex border-b border-slate-100 overflow-x-auto gap-2">
                  {(['schools', 'hospitals', 'markets', 'mosques'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveMapTab(tab)}
                      className={`pb-2.5 px-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all shrink-0 flex items-center gap-1.5 ${
                        activeMapTab === tab
                          ? "border-blue-600 text-blue-600"
                          : "border-transparent text-slate-400 hover:text-slate-600"
                      }`}
                    >
                      {getNearbyIcon(tab)}
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {property.nearby_places[activeMapTab]?.map((place, index) => (
                    <div key={index} className="flex items-start gap-2 text-xs text-slate-700">
                      <div className="mt-0.5 shrink-0">{getNearbyIcon(activeMapTab)}</div>
                      <span className="font-medium leading-tight">{place}</span>
                    </div>
                  ))}
                  {(!property.nearby_places[activeMapTab] || property.nearby_places[activeMapTab].length === 0) && (
                    <div className="text-xs text-slate-400 italic col-span-2 text-center py-2">
                      No matching landmarks specified nearby.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 6. Property Details Table (Structured Info) */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <h2 className="font-display font-extrabold text-slate-900 text-lg md:text-xl tracking-tight border-b border-slate-50 pb-3">
                Technical Property Details Table
              </h2>
              <div className="overflow-hidden border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <tbody>
                    <tr className="border-b border-slate-100 bg-slate-50/40">
                      <th className="px-4 py-3 font-bold text-slate-800 w-1/3">Property Reference ID</th>
                      <td className="px-4 py-3 font-mono text-slate-600 select-all">{property.id.toUpperCase()}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-3 font-bold text-slate-800">Property Category</th>
                      <td className="px-4 py-3 font-semibold text-slate-600">{property.property_type}</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/40">
                      <th className="px-4 py-3 font-bold text-slate-800">Unit Floor Level</th>
                      <td className="px-4 py-3 font-semibold text-slate-600">{property.floor ? `${property.floor} of ${property.total_floors}` : "Ground Ground"}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-3 font-bold text-slate-800">Covered Area Size</th>
                      <td className="px-4 py-3 font-semibold text-slate-600">{property.area_sqft} Sq. Ft.</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/40">
                      <th className="px-4 py-3 font-bold text-slate-800">Bedrooms &amp; Bathrooms</th>
                      <td className="px-4 py-3 font-semibold text-slate-600">{property.bedrooms} Beds / {property.bathrooms} Baths</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-3 font-bold text-slate-800">Furnishing Setup</th>
                      <td className="px-4 py-3 font-semibold text-slate-600 capitalize">{property.furnished}</td>
                    </tr>
                    <tr className="border-b border-slate-100 bg-slate-50/40">
                      <th className="px-4 py-3 font-bold text-slate-800">Available Moving Date</th>
                      <td className="px-4 py-3 font-semibold text-slate-600">{property.available_from}</td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <th className="px-4 py-3 font-bold text-slate-800">Lease Terms Minimum</th>
                      <td className="px-4 py-3 font-semibold text-slate-600">{property.lease_duration}</td>
                    </tr>
                    <tr className="bg-slate-50/40">
                      <th className="px-4 py-3 font-bold text-slate-800">Year of Construction</th>
                      <td className="px-4 py-3 font-semibold text-slate-600">{property.year_built || "2022"}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right Column - 2. Sticky Summary & Inquiry Action Section */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            
            {/* Quick Sticky Summary Card */}
            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-md shadow-slate-100/50 space-y-6">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase text-slate-400 block tracking-wider">Monthly Lease Rent</span>
                <div className="flex items-baseline gap-1.5">
                  <span className="font-display font-black text-blue-600 text-3xl sm:text-4xl">{formatPKR(property.price)}</span>
                  <span className="text-slate-500 font-bold text-xs uppercase tracking-wider">/ Month</span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium pt-1">
                  Security Deposit Required: <span className="font-mono text-slate-700 font-semibold">{formatPKR(property.price * 2)}</span> (Refundable)
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              {/* Inquiry Submission Panel */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-slate-900 text-sm">Send Inquiry to Agent</h3>
                
                {inquirySubmitted ? (
                  <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center space-y-2">
                    <div className="h-10 w-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-bold text-emerald-900">Message Sent Successfully!</h4>
                    <p className="text-[11px] text-emerald-700 leading-normal">
                      The property manager, <strong>{property.manager_name}</strong>, will review your details and contact you via phone or email soon.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleInquirySubmit} className="space-y-3">
                    <input
                      type="text"
                      required
                      placeholder="Your Full Name"
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      className="w-full text-xs border border-slate-200 bg-slate-50/50 rounded-xl p-3 focus:bg-white focus:border-blue-500 outline-none"
                    />
                    <input
                      type="email"
                      required
                      placeholder="Your Email Address"
                      value={inquiryEmail}
                      onChange={(e) => setInquiryEmail(e.target.value)}
                      className="w-full text-xs border border-slate-200 bg-slate-50/50 rounded-xl p-3 focus:bg-white focus:border-blue-500 outline-none"
                    />
                    <input
                      type="tel"
                      required
                      placeholder="Your Active Phone Number"
                      value={inquiryPhone}
                      onChange={(e) => setInquiryPhone(e.target.value)}
                      className="w-full text-xs border border-slate-200 bg-slate-50/50 rounded-xl p-3 focus:bg-white focus:border-blue-500 outline-none"
                    />
                    <textarea
                      required
                      rows={3}
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      className="w-full text-xs border border-slate-200 bg-slate-50/50 rounded-xl p-3 focus:bg-white focus:border-blue-500 outline-none resize-none"
                    />
                    <button
                      type="submit"
                      disabled={isSubmittingInquiry}
                      className="w-full min-h-[44px] bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/15 flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isSubmittingInquiry ? "Sending Message..." : "Send Listing Inquiry"}
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </form>
                )}
              </div>

              <div className="h-px bg-slate-100" />

              {/* Book viewing Tour Schedule Form */}
              <div className="space-y-4">
                <h3 className="font-display font-bold text-slate-900 text-sm">Schedule a Viewing Tour</h3>
                {tourBooked ? (
                  <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 text-center space-y-2">
                    <div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                      <Check className="h-5 w-5" />
                    </div>
                    <h4 className="text-xs font-bold text-blue-900">Viewing Tour Requested!</h4>
                    <p className="text-[11px] text-blue-700 leading-normal">
                      We have requested a {tourType} viewing for <strong>{tourDate}</strong> at <strong>{tourTime}</strong>. Wait for agent confirmation.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleTourBook} className="space-y-3">
                    <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl text-center">
                      <button
                        type="button"
                        onClick={() => setTourType("in-person")}
                        className={`py-1.5 text-[10px] font-bold rounded-lg transition-colors ${
                          tourType === "in-person" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                        }`}
                      >
                        In-Person
                      </button>
                      <button
                        type="button"
                        onClick={() => setTourType("video")}
                        className={`py-1.5 text-[10px] font-bold rounded-lg transition-colors ${
                          tourType === "video" ? "bg-white text-slate-800 shadow-sm" : "text-slate-500"
                        }`}
                      >
                        Video Chat
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="date"
                        required
                        value={tourDate}
                        onChange={(e) => setTourDate(e.target.value)}
                        className="text-xs border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 outline-none focus:bg-white"
                      />
                      <select
                        required
                        value={tourTime}
                        onChange={(e) => setTourTime(e.target.value)}
                        className="text-xs border border-slate-200 bg-slate-50/50 rounded-xl p-2.5 outline-none focus:bg-white"
                      >
                        <option value="">Select Time</option>
                        <option value="10:00 AM">10:00 AM</option>
                        <option value="12:00 PM">12:00 PM</option>
                        <option value="02:00 PM">02:00 PM</option>
                        <option value="04:00 PM">04:00 PM</option>
                        <option value="06:00 PM">06:00 PM</option>
                      </select>
                    </div>
                    <button
                      type="submit"
                      disabled={isBookingTour}
                      className="w-full min-h-[44px] bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-md flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
                    >
                      {isBookingTour ? "Requesting Tour..." : "Request Viewing Slot"}
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Property Manager info Card */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-lg border border-blue-500/30">
                  {property.manager_name.split(" ").map(w => w[0]).join("")}
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-white">{property.manager_name}</h4>
                  <p className="text-[10px] text-slate-400 font-medium">{property.manager_company}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 text-xs text-slate-300">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="font-mono">{property.manager_phone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-blue-400 shrink-0" />
                  <span className="truncate">{property.manager_email}</span>
                </div>
              </div>

              {/* Login / Actions Lock Prompts */}
              <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <Lock className="h-4.5 w-4.5 text-blue-400 shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <h5 className="text-[11px] font-bold text-white">Landlord Workspace Actions</h5>
                    <p className="text-[10px] text-slate-400 leading-normal">
                      Login as Owner or Tenant to file digital lease contracts, pay rent online, or submit maintenance requests directly inside our dashboard.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentPath("/login")}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-xl transition-all shadow shadow-blue-600/10"
                >
                  Sign In to System Portal
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* 7. Similar Properties Carousel (Bottom) */}
        {similarListings.length > 0 && (
          <section id="similar-listings" className="mt-16 space-y-6">
            <h2 className="font-display font-black text-slate-900 text-xl sm:text-2xl tracking-tight">
              Similar Properties You Might Like
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarListings.map(listing => (
                <div
                  key={listing.id}
                  onClick={() => setCurrentPath(`/property-detail/${listing.id}`)}
                  className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 group cursor-pointer"
                >
                  <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                    <img
                      src={listing.images[0]}
                      alt={listing.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                      referrerPolicy="no-referrer"
                    />
                    <span className="absolute top-3 left-3 px-2 py-1 bg-slate-900/80 backdrop-blur-md text-white font-bold text-[9px] uppercase tracking-wider rounded-lg">
                      {listing.city}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2 py-1 bg-blue-600 text-white font-display font-black text-xs rounded-lg">
                      {formatPKR(listing.price)}
                    </span>
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-display font-bold text-sm text-slate-900 line-clamp-1">
                      {listing.title}
                    </h3>
                    <div className="flex items-center gap-3 text-slate-500 text-[11px] font-medium">
                      <span className="flex items-center gap-1"><BedDouble className="h-3.5 w-3.5" /> {listing.bedrooms} Beds</span>
                      <span className="flex items-center gap-1 border-l border-slate-200 pl-3"><Bath className="h-3.5 w-3.5" /> {listing.bathrooms} Baths</span>
                      <span className="flex items-center gap-1 border-l border-slate-200 pl-3"><Maximize2 className="h-3.5 w-3.5" /> {listing.area_sqft} SqFt</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
};
