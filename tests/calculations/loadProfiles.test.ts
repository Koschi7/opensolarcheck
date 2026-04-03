import { describe, it, expect } from "vitest";
import { MONTHLY_LOAD_DISTRIBUTION, getMonthlyConsumption } from "@/lib/data/loadProfiles";

describe("loadProfiles", () => {
  it("should have monthly distribution that sums to 1.0", () => {
    const sum = MONTHLY_LOAD_DISTRIBUTION.reduce((acc, val) => acc + val, 0);
    expect(sum).toBeCloseTo(1.0, 10);
  });

  it("should have exactly 12 months", () => {
    expect(MONTHLY_LOAD_DISTRIBUTION).toHaveLength(12);
  });

  it("should have all positive values", () => {
    MONTHLY_LOAD_DISTRIBUTION.forEach((val) => {
      expect(val).toBeGreaterThan(0);
    });
  });

  it("should distribute annual consumption across months", () => {
    const monthly = getMonthlyConsumption(4000);
    expect(monthly).toHaveLength(12);
    const sum = monthly.reduce((acc, val) => acc + val, 0);
    expect(sum).toBeCloseTo(4000, 5);
  });

  it("should have higher winter consumption than summer", () => {
    const monthly = getMonthlyConsumption(12000);
    const december = monthly[11];
    const july = monthly[6];
    expect(december).toBeGreaterThan(july);
  });
});
