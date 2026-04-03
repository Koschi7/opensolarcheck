import { describe, it, expect } from "vitest";
import { calculateYield, calculateYieldFallback } from "@/lib/calculations/pvYield";

describe("pvYield", () => {
  describe("calculateYieldFallback", () => {
    it("should calculate yield for 10 kWp system in southern Germany", () => {
      const result = calculateYieldFallback(10, "none", "80331");
      // München: süd region, ~1050 kWh/kWp * 0.86 PR * 1.0 shading
      expect(result.annualYield).toBeGreaterThan(8500);
      expect(result.annualYield).toBeLessThan(10000);
      expect(result.monthlyYield).toHaveLength(12);
    });

    it("should calculate yield for northern Germany with lower values", () => {
      const resultNorth = calculateYieldFallback(10, "none", "20095");
      const resultSouth = calculateYieldFallback(10, "none", "80331");
      expect(resultNorth.annualYield).toBeLessThan(resultSouth.annualYield);
    });

    it("should reduce yield with heavy shading", () => {
      const noShading = calculateYieldFallback(10, "none");
      const heavy = calculateYieldFallback(10, "high");
      expect(heavy.annualYield).toBeLessThan(noShading.annualYield);
      expect(heavy.annualYield).toBeCloseTo(noShading.annualYield * 0.7, -1);
    });

    it("should return 0 for 0 kWp", () => {
      const result = calculateYieldFallback(0, "none");
      expect(result.annualYield).toBe(0);
    });

    it("should have monthly yield sum approximately equal to annual yield", () => {
      const result = calculateYieldFallback(10, "none");
      const monthlySum = result.monthlyYield.reduce((s, m) => s + m, 0);
      // Allow small rounding differences
      expect(Math.abs(monthlySum - result.annualYield)).toBeLessThan(20);
    });

    it("should use default region when no postal code given", () => {
      const result = calculateYieldFallback(10, "none");
      expect(result.annualYield).toBeGreaterThan(0);
      expect(result.specificYield).toBeGreaterThan(700);
    });
  });

  describe("calculateYield with PVGIS data", () => {
    const mockPVGISData = {
      outputs: {
        monthly: {
          fixed: [
            { month: 1, E_d: 8, E_m: 248, "H(i)_d": 2, "H(i)_m": 62, SD_m: 30 },
            { month: 2, E_d: 14, E_m: 392, "H(i)_d": 3, "H(i)_m": 84, SD_m: 40 },
            { month: 3, E_d: 24, E_m: 744, "H(i)_d": 5, "H(i)_m": 155, SD_m: 50 },
            { month: 4, E_d: 32, E_m: 960, "H(i)_d": 6, "H(i)_m": 180, SD_m: 60 },
            { month: 5, E_d: 36, E_m: 1116, "H(i)_d": 7, "H(i)_m": 217, SD_m: 65 },
            { month: 6, E_d: 38, E_m: 1140, "H(i)_d": 7, "H(i)_m": 210, SD_m: 60 },
            { month: 7, E_d: 37, E_m: 1147, "H(i)_d": 7, "H(i)_m": 217, SD_m: 60 },
            { month: 8, E_d: 34, E_m: 1054, "H(i)_d": 6, "H(i)_m": 186, SD_m: 55 },
            { month: 9, E_d: 27, E_m: 810, "H(i)_d": 5, "H(i)_m": 150, SD_m: 50 },
            { month: 10, E_d: 18, E_m: 558, "H(i)_d": 3, "H(i)_m": 93, SD_m: 40 },
            { month: 11, E_d: 10, E_m: 300, "H(i)_d": 2, "H(i)_m": 60, SD_m: 30 },
            { month: 12, E_d: 6, E_m: 186, "H(i)_d": 1, "H(i)_m": 31, SD_m: 25 },
          ],
        },
        totals: {
          fixed: {
            E_y: 8655,
            E_d: 23.7,
            "H(i)_y": 1645,
          },
        },
      },
    };

    it("should use PVGIS data when available", () => {
      const result = calculateYield(10, "none", mockPVGISData);
      expect(result.annualYield).toBeGreaterThan(8000);
      expect(result.monthlyYield).toHaveLength(12);
    });

    it("should apply shading factor to PVGIS data", () => {
      const noShading = calculateYield(10, "none", mockPVGISData);
      const heavy = calculateYield(10, "high", mockPVGISData);
      expect(heavy.annualYield).toBeLessThan(noShading.annualYield);
    });

    it("should fall back when no PVGIS data", () => {
      const result = calculateYield(10, "none", null, "80331");
      expect(result.annualYield).toBeGreaterThan(0);
    });
  });
});
