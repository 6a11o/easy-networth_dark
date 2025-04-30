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
import { Asset, Liability, AssetCategory, LiabilityCategory, assetCategoryLabels, liabilityCategoryLabels } from "@/types";
import { toast } from "sonner";
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from "react";
import { useCurrency, availableCurrencies } from "@/context/CurrencyContext";
import { ScrollArea } from "@/components/ui/scroll-area";

// Import the actual enums for Zod validation
import { AssetCategory as AssetCategoryEnum, LiabilityCategory as LiabilityCategoryEnum } from "@/types";

// Extract valid category keys from the label objects
const assetCategoryValues = Object.keys(assetCategoryLabels) as [AssetCategory, ...AssetCategory[]];
const liabilityCategoryValues = Object.keys(liabilityCategoryLabels) as [LiabilityCategory, ...LiabilityCategory[]];

// Zod schemas for validation using z.enum
const assetSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  balance: z.preprocess(
    (val) => (val === undefined || val === null || val === '') ? NaN : parseFloat(String(val)),
    z.number({ required_error: "Balance is required", invalid_type_error: "Balance must be a valid number" })
     .positive({ message: "Balance must be zero or positive" })
     .or(z.literal(0))
     .refine(val => !isNaN(val), { message: "Balance must be a valid number" })
  ),
  category: z.enum(assetCategoryValues, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  currency: z.string().min(1, { message: "Currency is required" }),
});

type AssetFormData = z.infer<typeof assetSchema>;

const liabilitySchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }),
  balance: z.preprocess(
    (val) => (val === undefined || val === null || val === '') ? NaN : parseFloat(String(val)),
    z.number({ required_error: "Balance is required", invalid_type_error: "Balance must be a valid number" })
     .positive({ message: "Balance must be zero or positive" })
     .or(z.literal(0))
     .refine(val => !isNaN(val), { message: "Balance must be a valid number" })
  ),
  category: z.enum(liabilityCategoryValues, {
    errorMap: () => ({ message: "Please select a valid category" }),
  }),
  currency: z.string().min(1, { message: "Currency is required" }),
});

type LiabilityFormData = z.infer<typeof liabilitySchema>;

export const AddAccountForm = () => {
  const [activeTab, setActiveTab] = useState("asset");
  const { addAsset, addLiability, isPremium, setIsPremium, assets, liabilities } = useFinancial();
  const { formatAmount, currency: mainCurrency } = useCurrency();
  
  // Track recently added accounts during the current session
  const [recentAssets, setRecentAssets] = useState<Asset[]>([]);
  const [recentLiabilities, setRecentLiabilities] = useState<Liability[]>([]);

  // Initial load of assets and liabilities
  useEffect(() => {
    // Only include most recent assets and liabilities (last 5 added)
    const sortedAssets = [...assets].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5);
    
    const sortedLiabilities = [...liabilities].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ).slice(0, 5);
    
    setRecentAssets(sortedAssets);
    setRecentLiabilities(sortedLiabilities);
  }, [assets, liabilities]);

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
      balance: undefined,
      category: assetCategoryValues[0],
      currency: mainCurrency.code,
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
      category: liabilityCategoryValues[0],
      currency: mainCurrency.code,
    },
  });

  // Handle asset form submission
  const onAssetSubmit: SubmitHandler<AssetFormData> = async (data) => {
    try {
      await addAsset(data.name, data.balance, data.category, data.currency);
      resetAssetForm();
      
      toast.success(`Asset "${data.name}" added successfully`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Upgrade to premium')) {
        toast.error(error.message, {
          description: 'Upgrade to Pro to add unlimited asset accounts',
          action: {
            label: 'Upgrade',
            onClick: () => setIsPremium(true)
          }
        });
      } else {
        toast.error("Failed to add asset. Please try again.");
        console.error("Asset submission error:", error);
      }
    }
  };

  // Handle liability form submission
  const onLiabilitySubmit: SubmitHandler<LiabilityFormData> = async (data) => {
    try {
      await addLiability(data.name, data.balance, data.category, data.currency);
      resetLiabilityForm();
      
      toast.success(`Liability "${data.name}" added successfully`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('Upgrade to premium')) {
        toast.error(error.message, {
          description: 'Upgrade to Pro to add unlimited liability accounts',
          action: {
            label: 'Upgrade',
            onClick: () => setIsPremium(true)
          }
        });
      } else {
        toast.error("Failed to add liability. Please try again.");
        console.error("Liability submission error:", error);
      }
    }
  };

  // Get the color for each account category
  const getCategoryColor = (category: string, isAsset: boolean): string => {
    if (isAsset) {
      switch(category) {
        case 'bank': return '#33C3F0';
        case 'stocks': return '#66EACE';
        case 'crypto': return '#8b5cf6';
        case 'realEstate': return '#4ade80';
        case 'retirement': return '#f59e0b';
        case 'other': return '#94a3b8';
        default: return '#33C3F0';
      }
    } else {
      switch(category) {
        case 'creditcard': return '#f87171';
        case 'loan': return '#ef4444';
        case 'mortgage': return '#dc2626';
        case 'other': return '#94a3b8';
        default: return '#f87171';
      }
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
    // Use a slightly darker, less transparent background for the card with wider width
    <Card className="mt-6 bg-gray-950/80 backdrop-blur-lg border border-white/10 shadow-xl rounded-xl overflow-hidden max-w-4xl mx-auto">
      <CardHeader className="border-b border-white/10 p-4">
        <CardTitle className="text-lg font-medium text-gray-100">Add New Account</CardTitle>
        <CardDescription className="text-sm text-gray-400">
          Add assets or liabilities to track your net worth.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          {/* Restyled TabsList */}
          <TabsList className="grid w-full grid-cols-2 mb-4 bg-gray-900/70 border border-gray-700/80 rounded-lg p-1 h-auto shadow-inner">
            <TabsTrigger
              value="asset"
              className="data-[state=active]:bg-primary/90 data-[state=active]:text-[#081924] data-[state=active]:font-semibold data-[state=active]:shadow-md text-gray-300 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-in-out"
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
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Form column - takes up 3/5 of space on medium screens and up */}
              <div className="md:col-span-3 space-y-4">
                <form onSubmit={handleAssetSubmit(onAssetSubmit)} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="asset-name" className="text-sm font-medium text-gray-300">Name</Label>
                    <Input
                      id="asset-name"
                      {...registerAsset("name")}
                      placeholder="e.g., Main Checking Account"
                      className={inputStyles}
                      aria-invalid={assetErrors.name ? "true" : "false"}
                    />
                    {assetErrors.name && <p role="alert" className="text-xs text-red-400">{assetErrors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="asset-balance" className="text-sm font-medium text-gray-300">Current Balance</Label>
                      <Input
                        id="asset-balance"
                        type="number"
                        step="0.01"
                        {...registerAsset("balance", { setValueAs: (v) => v === '' ? undefined : parseFloat(v) })}
                        placeholder="e.g., 5000.00"
                        className={inputStyles}
                        aria-invalid={assetErrors.balance ? "true" : "false"}
                      />
                      {assetErrors.balance && <p role="alert" className="text-xs text-red-400">{assetErrors.balance.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="asset-currency" className="text-sm font-medium text-gray-300">Currency</Label>
                      <Controller
                        control={assetControl}
                        name="currency"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              id="asset-currency"
                              className={selectTriggerStyles}
                              aria-invalid={assetErrors.currency ? "true" : "false"}
                            >
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent className={selectContentStyles}>
                              {availableCurrencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code} className={selectItemStyles}>
                                  {currency.name} ({currency.symbol})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {assetErrors.currency && <p role="alert" className="text-xs text-red-400">{assetErrors.currency.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
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
                    {assetErrors.category && <p role="alert" className="text-xs text-red-400">{assetErrors.category.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isAssetSubmitting}
                    className={`${assetButtonStyles} hover:scale-[1.01] active:scale-[0.99]`}
                  >
                    {isAssetSubmitting ? 'Adding...' : 'Add Asset'}
                  </Button>
                </form>
              </div>
              
              {/* Recently added accounts - takes up 2/5 of space on medium screens and up */}
              <div className="md:col-span-2">
                {recentAssets.length > 0 ? (
                  <div className="h-full">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Recently Added</h4>
                    <ScrollArea className="h-[150px] rounded-md border border-gray-700/40 bg-gray-900/30 p-2">
                      <div className="space-y-2 pr-2">
                        {recentAssets.map((asset) => (
                          <div 
                            key={asset.id}
                            className="flex justify-between items-center p-2 bg-gray-900/70 rounded border border-gray-700/40 hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="w-1.5 h-6 rounded-sm mr-2" style={{ backgroundColor: getCategoryColor(asset.category, true) }}></div>
                              <div>
                                <h5 className="font-medium text-sm text-gray-200">{asset.name}</h5>
                                <p className="text-xs text-gray-400">
                                  {assetCategoryLabels[asset.category as keyof typeof assetCategoryLabels]}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-green-400">
                              {formatAmount(asset.balance)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-900/20 rounded-md border border-gray-700/30">
                    <p className="text-sm text-gray-400">No assets added yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Liability Form Tab */}
          <TabsContent value="liability">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {/* Form column */}
              <div className="md:col-span-3 space-y-4">
                <form onSubmit={handleLiabilitySubmit(onLiabilitySubmit)} className="space-y-4">
                  <div className="space-y-1">
                    <Label htmlFor="liability-name" className="text-sm font-medium text-gray-300">Name</Label>
                    <Input
                      id="liability-name"
                      {...registerLiability("name")}
                      placeholder="e.g., Visa Credit Card"
                      className={inputStyles}
                      aria-invalid={liabilityErrors.name ? "true" : "false"}
                    />
                    {liabilityErrors.name && <p role="alert" className="text-xs text-red-400">{liabilityErrors.name.message}</p>}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
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
                      {liabilityErrors.balance && <p role="alert" className="text-xs text-red-400">{liabilityErrors.balance.message}</p>}
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="liability-currency" className="text-sm font-medium text-gray-300">Currency</Label>
                      <Controller
                        control={liabilityControl}
                        name="currency"
                        render={({ field }) => (
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <SelectTrigger
                              id="liability-currency"
                              className={selectTriggerStyles}
                              aria-invalid={liabilityErrors.currency ? "true" : "false"}
                            >
                              <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent className={selectContentStyles}>
                              {availableCurrencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code} className={selectItemStyles}>
                                  {currency.name} ({currency.symbol})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        )}
                      />
                      {liabilityErrors.currency && <p role="alert" className="text-xs text-red-400">{liabilityErrors.currency.message}</p>}
                    </div>
                  </div>

                  <div className="space-y-1">
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
                    {liabilityErrors.category && <p role="alert" className="text-xs text-red-400">{liabilityErrors.category.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isLiabilitySubmitting}
                    className={`${liabilityButtonStyles} hover:scale-[1.01] active:scale-[0.99]`}
                  >
                    {isLiabilitySubmitting ? 'Adding...' : 'Add Liability'}
                  </Button>
                </form>
              </div>
              
              {/* Recently added accounts */}
              <div className="md:col-span-2">
                {recentLiabilities.length > 0 ? (
                  <div className="h-full">
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Recently Added</h4>
                    <ScrollArea className="h-[150px] rounded-md border border-gray-700/40 bg-gray-900/30 p-2">
                      <div className="space-y-2 pr-2">
                        {recentLiabilities.map((liability) => (
                          <div 
                            key={liability.id}
                            className="flex justify-between items-center p-2 bg-gray-900/70 rounded border border-gray-700/40 hover:bg-gray-800/50 transition-colors"
                          >
                            <div className="flex items-center">
                              <div className="w-1.5 h-6 rounded-sm mr-2" style={{ backgroundColor: getCategoryColor(liability.category, false) }}></div>
                              <div>
                                <h5 className="font-medium text-sm text-gray-200">{liability.name}</h5>
                                <p className="text-xs text-gray-400">
                                  {liabilityCategoryLabels[liability.category as keyof typeof liabilityCategoryLabels]}
                                </p>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-red-400">
                              {formatAmount(liability.balance)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center bg-gray-900/20 rounded-md border border-gray-700/30">
                    <p className="text-sm text-gray-400">No liabilities added yet</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
