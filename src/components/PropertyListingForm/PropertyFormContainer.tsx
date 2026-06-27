import React, { useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { propertySchema, PropertyFormData } from "../../types/propertySchema";
import { motion, AnimatePresence } from "motion/react";

const STEPS = ["Basic Info", "Address", "Specifications", "Financials"];

export const PropertyFormContainer: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const methods = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      propertyId: "PM-PROP-1234",
      propertyName: "",
      numUnits: 1,
      yearBuilt: 2024,
      postalCode: "44000"
    }
  });

  const onSubmit = (data: PropertyFormData) => {
    console.log(data);
    alert("Property saved!");
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
      <h2 className="text-2xl font-bold mb-6">Add New Property</h2>
      
      {/* Progress Indicator */}
      <div className="flex justify-between mb-8">
        {STEPS.map((step, idx) => (
          <div key={step} className={`text-sm font-semibold ${idx === currentStep ? "text-green-600" : "text-slate-400"}`}>
            {step}
          </div>
        ))}
      </div>

      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <AnimatePresence mode="wait">
            {currentStep === 0 && <motion.div key="basic">Basic Info Section (Form Fields Here)</motion.div>}
            {currentStep === 1 && <motion.div key="address">Address Section (Form Fields Here)</motion.div>}
            {currentStep === 2 && <motion.div key="specs">Specs Section (Form Fields Here)</motion.div>}
            {currentStep === 3 && <motion.div key="financials">Financials Section (Form Fields Here)</motion.div>}
          </AnimatePresence>

          <div className="mt-8 flex justify-between">
            <button type="button" onClick={() => setCurrentStep(Math.max(0, currentStep - 1))} disabled={currentStep === 0} className="px-4 py-2 border rounded-xl">Back</button>
            {currentStep < STEPS.length - 1 ? (
              <button type="button" onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))} className="px-4 py-2 bg-green-600 text-white rounded-xl">Next</button>
            ) : (
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded-xl">Submit</button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};
