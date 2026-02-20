import { LOAD_CATEGORIES } from "@/config/loadCategories";

export function calculateBill({ supplyHours, category, tariff = 45 }) {
  const load = LOAD_CATEGORIES[category];

  if (!load) throw new Error("Invalid category");

  const allocatedEnergy = supplyHours * load.loadFactor;

  const amount = allocatedEnergy * tariff;

  return {
    amount,
    loadFactor: load.loadFactor,
    allocatedEnergy,
  };
}
