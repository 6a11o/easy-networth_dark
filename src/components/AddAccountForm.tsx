import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { useFinancial } from "@/context/FinancialContext";
import { AssetCategory, LiabilityCategory, assetCategoryLabels, liabilityCategoryLabels } from "@/types";
import { toast } from "sonner";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from "react";

// Import the actual enums for Zod validation
import { AssetCategory as AssetCategoryEnum, LiabilityCategory as LiabilityCategoryEnum } from "@/types";

// Extract valid category keys from the label objects
const assetCategoryValues = Object.keys(assetCategoryLabels) as [AssetCategory, ...AssetCategory[]];
const liabilityCategoryValues = Object.keys(liabilityCategoryLabels) as [LiabilityCategory, ...LiabilityCategory[]];

// Zod schemas for validation using z.enum
const assetSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  balance: z.preprocess(
    (val) => (val === undefined || val === null || val === '') ? NaN : parseFloat(String(val)), // Convert empty/null to NaN for initial check
    z.number({ required_error: "Balance is required", invalid_type_error: "Balance must be a valid number" })
     .positive({ message: "Balance must be zero or positive" }) // Allow 0 balance
     .or(z.literal(0)) // Explicitly allow 0
     .refine(val => !isNaN(val), { message: "Balance must be a valid number" }) // Ensure it's not NaN after parsing
  ),
  category: z.enum(assetCategoryValues, { // Use z.enum with the extracted keys
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
});

type AssetFormData = z.infer<typeof assetSchema>;

const liabilitySchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  balance: z.preprocess(
    (val) => (val === undefined || val === null || val === '') ? NaN : parseFloat(String(val)),
    z.number({ required_error: "Balance is required", invalid_type_error: "Balance must be a valid number" })
     .positive({ message: "Balance must be zero or positive" }) // Allow 0 balance
     .or(z.literal(0)) // Explicitly allow 0
     .refine(val => !isNaN(val), { message: "Balance must be a valid number" })
  ),
  category: z.enum(liabilityCategoryValues, { // Use z.enum with the extracted keys
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
});

type LiabilityFormData = z.infer<typeof liabilitySchema>;

export const AddAccountForm = () => {
  const [activeTab, setActiveTab] = useState("asset");
  const { addAsset, addLiability } = useFinancial();

  // React Hook Form setup for Assets
  const {
    register: registerAsset,
    handleSubmit: handleAssetSubmit,
    control: assetControl,
    reset: resetAssetForm,
    formState: { errors: assetErrors, isSubmitting: isAssetSubmitting },
  } = useForm<AssetFormData>({
    resolver: zodResolver(assetSchema),
    defaultValues: {
      name: "",
      // RHF requires 'undefined' for empty controlled number inputs if type="number"
      balance: undefined,
      category: assetCategoryValues[0], // Default to the first category
    },
  });

  // React Hook Form setup for Liabilities
  const {
    register: registerLiability,
    handleSubmit: handleLiabilitySubmit,
    control: liabilityControl,
    reset: resetLiabilityForm,
    formState: { errors: liabilityErrors, isSubmitting: isLiabilitySubmitting },
  } = useForm<LiabilityFormData>({
    resolver: zodResolver(liabilitySchema),
    defaultValues: {
      name: "",
      balance: undefined,
      category: liabilityCategoryValues[0], // Default to the first category
    },
  });

  // Handle asset form submission
  const onAssetSubmit: SubmitHandler<AssetFormData> = async (data) => {
    try {
      // Zod ensures balance is a valid number here
      addAsset(data.name, data.balance, data.category);
      resetAssetForm();
      toast.success(`Asset "${data.name}" added successfully`);
    } catch (error) {
      toast.error("Failed to add asset. Please try again.");
      console.error("Asset submission error:", error);
    }
  };

  // Handle liability form submission
  const onLiabilitySubmit: SubmitHandler<LiabilityFormData> = async (data) => {
    try {
      addLiability(data.name, data.balance, data.category);
      resetLiabilityForm();
      toast.success(`Liability "${data.name}" added successfully`);
    } catch (error) {
      toast.error("Failed to add liability. Please try again.");
      console.error("Liability submission error:", error);
    }
  };

  // Common styles for inputs and selects
  const inputStyles = "bg-gray-900/60 border-gray-700/80 text-gray-100 placeholder-gray-500 focus:border-primary focus:ring-1 focus:ring-primary/80 transition duration-150 ease-in-out shadow-sm";
  const selectTriggerStyles = `${inputStyles} data-[placeholder]:text-gray-500`;
  const selectContentStyles = "bg-gray-900 border-gray-700 text-gray-200 shadow-lg";
  const selectItemStyles = "focus:bg-primary/20 focus:text-white data-[highlighted]:bg-primary/10 data-[highlighted]:text-gray-100 transition duration-150 ease-in-out";
  const buttonBaseStyles = "w-full font-semibold disabled:opacity-60 transition-all duration-200 ease-in-out transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 shadow-md";
  const assetButtonStyles = `${buttonBaseStyles} bg-primary hover:bg-primary/90 focus:ring-primary`;
  const liabilityButtonStyles = `${buttonBaseStyles} bg-destructive hover:bg-destructive/90 focus:ring-destructive`; // Using 'destructive' for liability color

  return (
    // Use a slightly darker, less transparent background for the card
    <Card className="mt-6 bg-gray-950/80 backdrop-blur-lg border border-white/10 shadow-xl rounded-xl overflow-hidden">
      <CardHeader className="border-b border-white/10 p-5">
        <CardTitle className="text-lg font-medium text-gray-100">Add New Account</CardTitle>
        <CardDescription className="text-sm text-gray-400 pt-1">
          Add assets or liabilities to track your net worth.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-5">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Restyled TabsList */}
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-gray-900/70 border border-gray-700/80 rounded-lg p-1 h-auto shadow-inner">
            <TabsTrigger
              value="asset"
              className="data-[state=active]:bg-primary/90 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-300 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out"
            >
              Asset
            </TabsTrigger>
            <TabsTrigger
              value="liability"
              // Using 'destructive' color for active liability tab
              className="data-[state=active]:bg-destructive/90 data-[state=active]:text-white data-[state=active]:shadow-md text-gray-300 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out"
            >
              Liability
            </TabsTrigger>
          </TabsList>

          {/* Asset Form Tab */}
          <TabsContent value="asset">
            <form onSubmit={handleAssetSubmit(onAssetSubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="asset-name" className="text-sm font-medium text-gray-300">Name</Label>
                <Input
                  id="asset-name"
                  {...registerAsset("name")}
                  placeholder="e.g., Main Checking Account"
                  className={inputStyles}
                  aria-invalid={assetErrors.name ? "true" : "false"}
                />
                {assetErrors.name && <p role="alert" className="text-xs text-red-400 pt-1">{assetErrors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="asset-balance" className="text-sm font-medium text-gray-300">Current Balance</Label>
                <Input
                  id="asset-balance"
                  type="number" // Keep for browser features
                  step="0.01"
                  {...registerAsset("balance", { setValueAs: (v) => v === '' ? undefined : parseFloat(v) })} // Let RHF handle undefined for empty number input
                  placeholder="e.g., 5000.00"
                  className={inputStyles}
                  aria-invalid={assetErrors.balance ? "true" : "false"}
                />
                {assetErrors.balance && <p role="alert" className="text-xs text-red-400 pt-1">{assetErrors.balance.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="asset-category" className="text-sm font-medium text-gray-300">Category</Label>
                <Controller
                  control={assetControl}
                  name="category"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        id="asset-category"
                        className={selectTriggerStyles}
                        aria-invalid={assetErrors.category ? "true" : "false"}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className={selectContentStyles}>
                        {Object.entries(assetCategoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value} className={selectItemStyles}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {assetErrors.category && <p role="alert" className="text-xs text-red-400 pt-1">{assetErrors.category.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isAssetSubmitting}
                className={`${assetButtonStyles} mt-2 hover:scale-[1.01] active:scale-[0.99]`}
              >
                {isAssetSubmitting ? 'Adding...' : 'Add Asset'}
              </Button>
            </form>
          </TabsContent>

          {/* Liability Form Tab */}
          <TabsContent value="liability">
            <form onSubmit={handleLiabilitySubmit(onLiabilitySubmit)} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="liability-name" className="text-sm font-medium text-gray-300">Name</Label>
                <Input
                  id="liability-name"
                  {...registerLiability("name")}
                  placeholder="e.g., Visa Credit Card"
                  className={inputStyles}
                   aria-invalid={liabilityErrors.name ? "true" : "false"}
               />
                {liabilityErrors.name && <p role="alert" className="text-xs text-red-400 pt-1">{liabilityErrors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="liability-balance" className="text-sm font-medium text-gray-300">Current Balance</Label>
                <Input
                  id="liability-balance"
                  type="number"
                  step="0.01"
                  {...registerLiability("balance", { setValueAs: (v) => v === '' ? undefined : parseFloat(v) })}
                  placeholder="e.g., 2500.00"
                  className={inputStyles}
                  aria-invalid={liabilityErrors.balance ? "true" : "false"}
                />
                {liabilityErrors.balance && <p role="alert" className="text-xs text-red-400 pt-1">{liabilityErrors.balance.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="liability-category" className="text-sm font-medium text-gray-300">Category</Label>
                <Controller
                  control={liabilityControl}
                  name="category"
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <SelectTrigger
                        id="liability-category"
                        className={selectTriggerStyles}
                        aria-invalid={liabilityErrors.category ? "true" : "false"}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent className={selectContentStyles}>
                        {Object.entries(liabilityCategoryLabels).map(([value, label]) => (
                          <SelectItem key={value} value={value} className={selectItemStyles}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {liabilityErrors.category && <p role="alert" className="text-xs text-red-400 pt-1">{liabilityErrors.category.message}</p>}
              </div>

              <Button
                type="submit"
                disabled={isLiabilitySubmitting}
                className={`${liabilityButtonStyles} mt-2 hover:scale-[1.01] active:scale-[0.99]`}
              >
                {isLiabilitySubmitting ? 'Adding...' : 'Add Liability'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
