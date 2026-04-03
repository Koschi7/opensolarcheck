import type { ConfiguratorInput } from "@/lib/types";

export interface ValidationError {
  field: string;
  message: string;
}

function isInvalidNumber(value: number): boolean {
  return !Number.isFinite(value);
}

export function validateLocation(
  input: ConfiguratorInput["location"]
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (isInvalidNumber(input.lat) || input.lat < -90 || input.lat > 90) {
    errors.push({ field: "lat", message: "validation.lat" });
  }
  if (isInvalidNumber(input.lon) || input.lon < -180 || input.lon > 180) {
    errors.push({ field: "lon", message: "validation.lon" });
  }
  return errors;
}

export function validateRoof(
  input: ConfiguratorInput["roof"]
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (isInvalidNumber(input.tilt) || input.tilt < 0 || input.tilt > 60) {
    errors.push({ field: "tilt", message: "validation.tilt" });
  }
  if (
    isInvalidNumber(input.azimuth) ||
    input.azimuth < -180 ||
    input.azimuth > 180
  ) {
    errors.push({ field: "azimuth", message: "validation.azimuth" });
  }
  if (isInvalidNumber(input.area) || input.area <= 0 || input.area > 500) {
    errors.push({ field: "area", message: "validation.area" });
  }
  return errors;
}

export function validateSystem(
  input: ConfiguratorInput["system"]
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (
    isInvalidNumber(input.modulePower) ||
    input.modulePower < 100 ||
    input.modulePower > 800
  ) {
    errors.push({ field: "modulePower", message: "validation.modulePower" });
  }
  if (
    isInvalidNumber(input.moduleCount) ||
    input.moduleCount < 1 ||
    input.moduleCount > 200
  ) {
    errors.push({ field: "moduleCount", message: "validation.moduleCount" });
  }
  return errors;
}

export function validateConsumption(
  input: ConfiguratorInput["consumption"]
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (
    isInvalidNumber(input.annualConsumption) ||
    input.annualConsumption < 0 ||
    input.annualConsumption > 100000
  ) {
    errors.push({
      field: "annualConsumption",
      message: "validation.annualConsumption",
    });
  }
  return errors;
}

export function validateBattery(
  input: ConfiguratorInput["battery"]
): ValidationError[] {
  const errors: ValidationError[] = [];
  if (
    input.hasBattery &&
    (isInvalidNumber(input.capacity) || input.capacity < 1 || input.capacity > 50)
  ) {
    errors.push({ field: "capacity", message: "validation.capacity" });
  }
  return errors;
}

export function validateStep(
  step: number,
  input: ConfiguratorInput
): ValidationError[] {
  switch (step) {
    case 1:
      return validateLocation(input.location);
    case 2:
      return validateRoof(input.roof);
    case 3:
      return validateSystem(input.system);
    case 4:
      return validateConsumption(input.consumption);
    case 5:
      return validateBattery(input.battery);
    default:
      return [];
  }
}
