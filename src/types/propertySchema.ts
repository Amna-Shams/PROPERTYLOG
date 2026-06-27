import { z } from "zod";

export const propertySchema = z.object({
  // Section 1: Basic
  propertyId: z.string().startsWith("PM-PROP-"),
  propertyName: z.string().min(1, "Property name is required"),
  propertyType: z.enum(["Residential", "Commercial", "Mixed-Use"]),
  category: z.enum(["Apartment", "House", "Villa", "Studio", "Penthouse", "Office", "Shop"]),
  numUnits: z.number().int().positive(),
  yearBuilt: z.number().int().min(1900).max(new Date().getFullYear()),
  status: z.enum(["Available", "Occupied", "Under Maintenance", "Renovation"]),

  // Section 2: Address
  province: z.string().min(1),
  city: z.string().min(1),
  area: z.string().min(1),
  streetAddress: z.string().min(1),
  landmark: z.string().optional(),
  postalCode: z.string().regex(/^\d{5}$/, "Postal code must be 5 digits"),
  mapsLink: z.string().url().optional(),
  
  // Section 5: Financials
  monthlyRent: z.number().positive(),
  securityDeposit: z.number().positive(),
  maintenanceCharges: z.number().nonnegative(),
  parkingCharges: z.number().nonnegative(),
});

export type PropertyFormData = z.infer<typeof propertySchema>;
