import { describe, it, expect } from "vitest";
import { calculateCO2Savings } from "@/lib/calculations/co2";

describe("co2", () => {
  it("should calculate annual CO2 savings", () => {
    const result = calculateCO2Savings(9500);

    // 9500 kWh * 0.32 kg/kWh = 3040 kg
    expect(result.annualSavings_kg).toBeCloseTo(3040, -1);
  });

  it("should calculate lifetime savings", () => {
    const result = calculateCO2Savings(9500);

    // ~25 years with degradation, should be ~70 tons
    expect(result.lifetimeSavings_tons).toBeGreaterThan(50);
    expect(result.lifetimeSavings_tons).toBeLessThan(80);
  });

  it("should calculate equivalent flights", () => {
    const result = calculateCO2Savings(9500);

    // 3040 kg / 200 kg = ~15 flights
    expect(result.equivalentFlights).toBeGreaterThan(10);
    expect(result.equivalentFlights).toBeLessThan(20);
  });

  it("should calculate equivalent trees", () => {
    const result = calculateCO2Savings(9500);

    // 3040 kg / 10 kg = ~304 trees
    expect(result.equivalentTrees).toBeGreaterThan(250);
    expect(result.equivalentTrees).toBeLessThan(350);
  });

  it("should return 0 for 0 yield", () => {
    const result = calculateCO2Savings(0);

    expect(result.annualSavings_kg).toBe(0);
    expect(result.lifetimeSavings_tons).toBe(0);
    expect(result.equivalentFlights).toBe(0);
    expect(result.equivalentTrees).toBe(0);
  });
});
