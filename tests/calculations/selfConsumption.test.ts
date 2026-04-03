import { describe, it, expect } from "vitest";
import { calculateSelfConsumption } from "@/lib/calculations/selfConsumption";

describe("selfConsumption", () => {
  it("should return ~30% self-consumption for 10 kWp with 4000 kWh consumption", () => {
    const result = calculateSelfConsumption({
      peakPower_kWp: 10,
      annualYield_kWh: 9500,
      annualConsumption_kWh: 4000,
      batteryCapacity_kWh: 0,
      hasBattery: false,
    });

    // r = 10/4000*1000 = 2.5 → low self-consumption
    expect(result.selfConsumptionRatio).toBeGreaterThanOrEqual(0.05);
    expect(result.selfConsumptionRatio).toBeLessThan(0.5);
    expect(result.autarkyRate).toBeGreaterThan(0);
    expect(result.autarkyRate).toBeLessThanOrEqual(1);
  });

  it("should have higher self-consumption with smaller system", () => {
    const small = calculateSelfConsumption({
      peakPower_kWp: 3,
      annualYield_kWh: 2850,
      annualConsumption_kWh: 4000,
      batteryCapacity_kWh: 0,
      hasBattery: false,
    });

    const large = calculateSelfConsumption({
      peakPower_kWp: 15,
      annualYield_kWh: 14250,
      annualConsumption_kWh: 4000,
      batteryCapacity_kWh: 0,
      hasBattery: false,
    });

    expect(small.selfConsumptionRatio).toBeGreaterThan(
      large.selfConsumptionRatio
    );
  });

  it("should increase self-consumption with battery", () => {
    const withoutBattery = calculateSelfConsumption({
      peakPower_kWp: 10,
      annualYield_kWh: 9500,
      annualConsumption_kWh: 4000,
      batteryCapacity_kWh: 0,
      hasBattery: false,
    });

    const withBattery = calculateSelfConsumption({
      peakPower_kWp: 10,
      annualYield_kWh: 9500,
      annualConsumption_kWh: 4000,
      batteryCapacity_kWh: 10,
      hasBattery: true,
    });

    expect(withBattery.selfConsumptionRatio).toBeGreaterThan(
      withoutBattery.selfConsumptionRatio
    );
  });

  it("should handle zero consumption", () => {
    const result = calculateSelfConsumption({
      peakPower_kWp: 10,
      annualYield_kWh: 9500,
      annualConsumption_kWh: 0,
      batteryCapacity_kWh: 0,
      hasBattery: false,
    });

    expect(result.selfConsumptionRatio).toBe(0);
    expect(result.feedInKWh).toBe(9500);
  });

  it("should handle zero yield", () => {
    const result = calculateSelfConsumption({
      peakPower_kWp: 0,
      annualYield_kWh: 0,
      annualConsumption_kWh: 4000,
      batteryCapacity_kWh: 0,
      hasBattery: false,
    });

    expect(result.selfConsumptionRatio).toBe(0);
    expect(result.gridConsumptionKWh).toBe(4000);
  });

  it("should ensure self-consumption + feed-in = annual yield", () => {
    const result = calculateSelfConsumption({
      peakPower_kWp: 10,
      annualYield_kWh: 9500,
      annualConsumption_kWh: 4000,
      batteryCapacity_kWh: 10,
      hasBattery: true,
    });

    expect(result.selfConsumptionKWh + result.feedInKWh).toBeCloseTo(9500, -1);
  });
});
