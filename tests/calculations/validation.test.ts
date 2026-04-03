import { describe, it, expect } from "vitest";
import {
  validateLocation,
  validateRoof,
  validateSystem,
  validateConsumption,
  validateBattery,
} from "@/lib/calculations/validation";

describe("validation", () => {
  describe("validateLocation", () => {
    it("should accept valid coordinates", () => {
      const errors = validateLocation({ postalCode: "80331", lat: 48.14, lon: 11.58, city: "München" });
      expect(errors).toHaveLength(0);
    });

    it("should reject NaN latitude", () => {
      const errors = validateLocation({ postalCode: "80331", lat: NaN, lon: 11.58, city: "" });
      expect(errors.some((e) => e.field === "lat")).toBe(true);
    });

    it("should reject Infinity longitude", () => {
      const errors = validateLocation({ postalCode: "80331", lat: 48.14, lon: Infinity, city: "" });
      expect(errors.some((e) => e.field === "lon")).toBe(true);
    });

    it("should reject out-of-range lat", () => {
      const errors = validateLocation({ postalCode: "80331", lat: 91, lon: 11.58, city: "" });
      expect(errors.some((e) => e.field === "lat")).toBe(true);
    });
  });

  describe("validateRoof", () => {
    it("should accept valid roof parameters", () => {
      const errors = validateRoof({ tilt: 35, azimuth: 0, area: 50, shading: "none" });
      expect(errors).toHaveLength(0);
    });

    it("should reject NaN tilt", () => {
      const errors = validateRoof({ tilt: NaN, azimuth: 0, area: 50, shading: "none" });
      expect(errors.some((e) => e.field === "tilt")).toBe(true);
    });

    it("should reject NaN area", () => {
      const errors = validateRoof({ tilt: 35, azimuth: 0, area: NaN, shading: "none" });
      expect(errors.some((e) => e.field === "area")).toBe(true);
    });

    it("should reject zero area", () => {
      const errors = validateRoof({ tilt: 35, azimuth: 0, area: 0, shading: "none" });
      expect(errors.some((e) => e.field === "area")).toBe(true);
    });
  });

  describe("validateSystem", () => {
    it("should reject NaN modulePower", () => {
      const errors = validateSystem({
        moduleType: "mono",
        modulePower: NaN,
        moduleCount: 20,
        peakPower: 8.4,
        efficiency: 0.21,
      });
      expect(errors.some((e) => e.field === "modulePower")).toBe(true);
    });

    it("should reject NaN moduleCount", () => {
      const errors = validateSystem({
        moduleType: "mono",
        modulePower: 420,
        moduleCount: NaN,
        peakPower: 8.4,
        efficiency: 0.21,
      });
      expect(errors.some((e) => e.field === "moduleCount")).toBe(true);
    });
  });

  describe("validateConsumption", () => {
    it("should reject NaN consumption", () => {
      const errors = validateConsumption({
        annualConsumption: NaN,
        hasHeatPump: false,
        hasEV: false,
        heatPumpConsumption: 4000,
        evConsumption: 2500,
      });
      expect(errors.some((e) => e.field === "annualConsumption")).toBe(true);
    });

    it("should reject Infinity consumption", () => {
      const errors = validateConsumption({
        annualConsumption: Infinity,
        hasHeatPump: false,
        hasEV: false,
        heatPumpConsumption: 4000,
        evConsumption: 2500,
      });
      expect(errors.some((e) => e.field === "annualConsumption")).toBe(true);
    });
  });

  describe("validateBattery", () => {
    it("should reject NaN capacity when battery enabled", () => {
      const errors = validateBattery({ hasBattery: true, capacity: NaN });
      expect(errors.some((e) => e.field === "capacity")).toBe(true);
    });

    it("should skip validation when battery disabled", () => {
      const errors = validateBattery({ hasBattery: false, capacity: NaN });
      expect(errors).toHaveLength(0);
    });
  });
});
