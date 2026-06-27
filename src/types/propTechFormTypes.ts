export interface UtilityDetail {
  provider: string;
  accountNumber: string;
  status: "Active" | "Inactive";
}

export interface ComparableProperty {
  id: string;
  name: string;
  rent: number;
  size: number; // Sq. Ft.
}

export interface MaintenanceLogItem {
  id: string;
  date: string;
  issue: string;
  actionTaken: string;
  vendor: string;
  cost: number;
  status: "Completed" | "In Progress" | "Pending" | "Cancelled";
}

export interface PlannedMaintenanceTask {
  id: string;
  task: string;
  frequency: "Monthly" | "Quarterly" | "Biannual" | "Annual";
  nextDate: string;
  vendor: string;
  estimatedCost: number;
}

export interface ComplianceItem {
  id: string;
  requirement: string;
  status: "Compliant" | "Not Compliant" | "Pending" | "N/A";
  certificateNumber: string;
  expiryDate: string;
}

export interface PropTechPropertyFormData {
  // Section 1: Property Basic Information
  propertyId: string;
  propertyName: string;
  propertyType: "Residential" | "Commercial" | "Mixed-Use";
  category: "Apartment" | "House" | "Villa" | "Studio" | "Penthouse" | "Office" | "Shop";
  numUnits: number;
  yearBuilt: number;
  propertyStatus: "Available" | "Occupied" | "Under Maintenance" | "Renovation";

  // Section 2: Property Address (Pakistan)
  province: string;
  city: string;
  area: string;
  streetAddress: string;
  landmark: string;
  postalCode: string;
  mapsLink: string;

  // Section 3: Property Specifications
  unitNumber: string;
  floorLevel: "Ground" | "1st" | "2nd" | "3rd" | "4th+";
  totalArea: number;
  carpetArea: number;
  bedrooms: number;
  bathrooms: number;
  livingRooms: number;
  kitchenType: "Open" | "Closed" | "Semi-Open";
  hasBalcony: boolean;
  balconyCount: number;
  parking: "Covered" | "Open" | "Basement" | "None";
  parkingSpaces: number;
  hasStoreRoom: boolean;

  // Interior Features
  flooring: string;
  wallFinishing: string;
  ceiling: string;
  acType: "Split" | "Central" | "Window" | "None";
  hasHeating: boolean;
  waterSupply: "WASA" | "Tubewell" | "Boring" | "Tanker";
  gasSupply: "Sui Gas" | "Cylinder" | "None";
  electricitySource: "WAPDA" | "K-Electric" | "Solar" | "Generator";
  hasSolarSystem: boolean;
  hasUPSInverter: boolean;

  // Exterior & Amenities
  hasGarden: boolean;
  gardenDetails: string;
  hasSwimmingPool: boolean;
  hasGym: boolean;
  securityOptions: string[]; // Guard, Cameras, Gated, None
  hasElevator: boolean;
  hasIntercom: boolean;
  hasGeneratorBackup: boolean;
  internetType: "Fiber" | "Cable" | "Wireless" | "None";
  hasCableSatellite: boolean;
  hasJoggingTrack: boolean;
  hasPlayArea: boolean;
  hasCommunityHall: boolean;
  wasteDisposal: "Municipal" | "Private" | "Self";
  waterTank: "Overhead" | "Underground" | "Both";

  // Section 4: Utilities & Services
  electricityDetails: UtilityDetail;
  gasDetails: UtilityDetail;
  waterDetails: UtilityDetail;
  internetDetails: UtilityDetail;
  securityDetails: UtilityDetail;

  // Section 5: Rent & Financial Information
  monthlyRent: number;
  securityDeposit: number; // Auto 2x monthlyRent
  isUtilityIncluded: boolean;
  utilitiesIncluded: {
    electricity: boolean;
    gas: boolean;
    water: boolean;
    internet: boolean;
  };
  maintenanceCharges: number;
  parkingCharges: number;
  paymentDueDate: "1st" | "5th" | "10th" | "15th" | "20th" | "25th";
  gracePeriod: number; // days
  lateFeeAmount: number;
  lateFeePercentage: number;
  paymentMethods: string[]; // Cash, Bank Transfer, Check, Online
  bankName: string;
  bankAccountNumber: string;
  bankBranchCode: string;

  // Rent Increase Policy
  rentIncreasePolicy: string;
  lastRentIncreaseDate: string;
  nextRentIncreaseDate: string;

  // Annual Financial Metrics
  propertyTaxes: number;
  insuranceCost: number;
  otherExpenses: number;

  // Section 6: Lease & Rental Rules
  leaseType: "Fixed Term" | "Month-to-Month" | "Yearly";
  leaseDuration: number; // months
  leaseStartDate: string;
  leaseEndDate: string;
  hasRenewalOption: boolean;
  noticePeriod: number; // days
  uploadedLeaseAgreementName: string;

  // Rules
  smokingPolicy: "Allowed" | "Not Allowed" | "Designated Area";
  alcoholPolicy: "Allowed" | "Not Allowed";
  petsPolicy: "Allowed" | "Not Allowed" | "Conditional";
  petTypes: string[]; // Dogs, Cats, Birds, Fish
  petWeightLimit: number;
  petDeposit: number;
  sublettingAllowed: boolean;
  homeBusinessAllowed: boolean;
  noiseRestrictions: string;
  maxOccupants: number;
  visitorStayLimit: number;

  // Property Specific Rules
  parkingRule: "Assigned" | "Open" | "Visitor";
  hasGuestParking: boolean;
  bbqAllowed: boolean;
  poolUsageAllowed: boolean;
  gymUsageAllowed: boolean;
  laundrySetup: "In-unit" | "Shared" | "None";
  garbageDisposal: "Daily" | "Weekly" | "Self";
  mailDelivery: "Doorstep" | "Reception" | "Mailbox";
  maintenanceMethod: "Online" | "Phone" | "Email";
  emergencyContactProvided: boolean;

  // Maintenance & Repair Policy
  emergencyResponseTime: string;
  urgentResponseTime: string;
  routineResponseTime: string;
  maintenanceContactPhone: string;
  ownersResponsibilityDesc: string;
  tenantsResponsibilityDesc: string;
  maintenanceRequestMethodDesc: string;
  vendorManagementDesc: string;

  // Section 7: Move-in/Move-out Procedures
  moveInChecklist: {
    inspection: boolean;
    photos: boolean;
    keysHandover: boolean;
    securityDeposit: boolean;
    firstRent: boolean;
    leaseSigned: boolean;
    rulesAcknowledged: boolean;
    dates: Record<string, string>;
    notes: Record<string, string>;
  };
  moveOutChecklist: {
    noticeReceived: boolean;
    finalInspection: boolean;
    keyReturn: boolean;
    depositReturned: boolean;
    balanceCleared: boolean;
    finalBillCleared: boolean;
    propertyCleaned: boolean;
    dates: Record<string, string>;
    notes: Record<string, string>;
  };

  // Section 8: Tenant Information
  tenantName: string;
  tenantCnic: string; // XXXXX-XXXXXXX-X
  tenantPhone: string; // +92 prefix
  tenantWhatsapp: string;
  tenantEmail: string;
  tenantOccupation: string;
  tenantEmployer: string;
  tenantEmergencyName: string;
  tenantEmergencyPhone: string;
  tenantEmergencyRelationship: string;
  tenantAdultsCount: number;
  tenantChildrenCount: number;
  tenantMoveInDate: string;
  tenantLeaseEndDate: string;

  // Reference Check
  refLandlordName: string;
  refLandlordContact: string;
  refLandlordVerified: boolean;
  refEmployerName: string;
  refEmployerContact: string;
  refEmployerVerified: boolean;
  refPersonal1Name: string;
  refPersonal1Contact: string;
  refPersonal1Verified: boolean;
  refPersonal2Name: string;
  refPersonal2Contact: string;
  refPersonal2Verified: boolean;
  refBankName: string;
  refBankContact: string;
  refBankVerified: boolean;

  // Section 9: Property Valuation
  marketValue: number;
  marketValueSource: string;
  marketValueDate: string;
  zameenEstimate: number;
  golchaEstimate: number;
  appraisedValue: number;
  appraisedValueSource: string;
  appraisedValueDate: string;
  comparables: ComparableProperty[];

  // Section 10: Property Management
  propertyManagerName: string;
  propertyManagerPhone: string;
  propertyManagerEmail: string;
  propertyManagerOfficeAddress: string;
  propertyManagerEmergencyHelpline: string;
  managementCompany: string;
  managementFeeType: "Percentage" | "Fixed";
  managementFeeValue: number;
  lastInspectionDate: string;
  nextInspectionDate: string;
  documents: { id: string; name: string; fileName: string; uploadDate: string; notes: string }[];

  // Section 11: Maintenance History
  maintenanceLogs: MaintenanceLogItem[];
  plannedMaintenance: PlannedMaintenanceTask[];

  // Section 12: Compliance & Legal
  complianceItems: ComplianceItem[];
  tenantRightsChecked: Record<number, boolean>;
  tenantResponsibilitiesChecked: Record<number, boolean>;

  // Section 13: Occupancy Status
  unitAvailabilityDate: string;
  unitAvailabilityStatus: "Available for viewing" | "Under renovation" | "Occupied";
  unitAvailabilityPriority: "High" | "Medium" | "Low";

  // Section 14: Task List & Next Steps
  tasks: { id: string; text: string; completed: boolean; dateCompleted?: string }[];

  // Section 15: Quick Reference Card
  emergencyPolice: string;
  emergencyAmbulance: string;
  emergencyFire: string;
  emergencyMaintenanceContact: string;
  localHospitalName: string;
  localHospitalPhone: string;
  localPoliceStationName: string;
  localPoliceStationPhone: string;
}
