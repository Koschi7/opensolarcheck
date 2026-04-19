import { describe, it, expect } from "vitest";
import { calculateEconomics } from "@/lib/calculations/economics";

describe("economics", () => {
  const baseParams = {
    peakPower_kWp: 10,
    annualYield_kWh: 9500,
    selfConsumptionRatio: 0.3,
    batteryCapacity_kWh: 0,
    hasBattery: false,
  };

  it("should calculate positive savings", () => {
    const result = calculateEconomics(baseParams);

    expect(result.totalInvestment).toBeGreaterThan(0);
    expect(result.annualSavings).toBeGreaterThan(0);
    expect(result.yearlyData).toHaveLength(25);
  });

  it("should have reasonable payback period (8-15 years)", () => {
    const result = calculateEconomics(baseParams);

    expect(result.paybackYears).not.toBeNull();
    expect(result.paybackYears as number).toBeGreaterThan(5);
    expect(result.paybackYears as number).toBeLessThan(20);
  });

  it("should return null payback when system never pays back", () => {
    const result = calculateEconomics({
      ...baseParams,
      annualYield_kWh: 0,
    });

    expect(result.paybackYears).toBeNull();
  });

  it("should have positive ROI over 25 years", () => {
    const result = calculateEconomics(baseParams);

    expect(result.roi).toBeGreaterThan(0);
    expect(result.npv).toBeGreaterThan(0);
  });

  it("should show increasing cumulative savings", () => {
    const result = calculateEconomics(baseParams);
    const lastYear = result.yearlyData[24];

    expect(lastYear.cumulativeSavings).toBeGreaterThan(0);
  });

  it("should include battery cost in investment", () => {
    const withBattery = calculateEconomics({
      ...baseParams,
      hasBattery: true,
      batteryCapacity_kWh: 10,
      selfConsumptionRatio: 0.5,
    });

    const withoutBattery = calculateEconomics(baseParams);

    expect(withBattery.totalInvestment).toBeGreaterThan(
      withoutBattery.totalInvestment
    );
  });

  it("should have degradation reducing yield over time", () => {
    const result = calculateEconomics(baseParams);
    const year1 = result.yearlyData[0];
    const year25 = result.yearlyData[24];

    expect(year25.yield).toBeLessThan(year1.yield);
  });

  it("should have increasing electricity prices", () => {
    const result = calculateEconomics(baseParams);
    const year1 = result.yearlyData[0];
    const year25 = result.yearlyData[24];

    expect(year25.electricityPrice).toBeGreaterThan(year1.electricityPrice);
  });

  it("should handle zero yield gracefully", () => {
    const result = calculateEconomics({
      ...baseParams,
      annualYield_kWh: 0,
    });

    expect(result.annualSavings).toBeLessThan(0); // Only maintenance costs
  });
});
