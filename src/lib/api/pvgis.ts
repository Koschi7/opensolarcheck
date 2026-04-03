import type { PVGISResponse } from "@/lib/types";

const PVGIS_BASE_URL = "https://re.jrc.ec.europa.eu/api/v5_3";

interface PVGISParams {
  lat: number;
  lon: number;
  peakpower: number;
  loss: number;
  angle: number;
  aspect: number;
}

/** Erstellt Cache-Key aus Parametern */
function getCacheKey(params: PVGISParams): string {
  return `pvgis_${params.lat}_${params.lon}_${params.peakpower}_${params.angle}_${params.aspect}`;
}

/** Prüft ob Daten im sessionStorage gecacht sind */
function getCachedData(key: string): PVGISResponse | null {
  if (typeof window === "undefined") return null;
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) return JSON.parse(cached);
  } catch {
    // sessionStorage nicht verfügbar
  }
  return null;
}

/** Speichert Daten im sessionStorage */
function setCachedData(key: string, data: PVGISResponse): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(key, JSON.stringify(data));
  } catch {
    // sessionStorage voll oder nicht verfügbar
  }
}

/**
 * Ruft PV-Ertragsdaten von der PVGIS-API ab
 * Mit Caching in sessionStorage und Retry-Logik
 */
export async function fetchPVGISData(
  params: PVGISParams
): Promise<PVGISResponse> {
  const cacheKey = getCacheKey(params);
  const cached = getCachedData(cacheKey);
  if (cached) return cached;

  const url = new URL(`${PVGIS_BASE_URL}/PVcalc`);
  url.searchParams.set("lat", params.lat.toString());
  url.searchParams.set("lon", params.lon.toString());
  url.searchParams.set("peakpower", params.peakpower.toString());
  url.searchParams.set("loss", params.loss.toString());
  url.searchParams.set("angle", params.angle.toString());
  url.searchParams.set("aspect", params.aspect.toString());
  url.searchParams.set("outputformat", "json");

  let lastError: Error | null = null;

  // Retry mit Backoff (max 3 Versuche)
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      if (attempt > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * Math.pow(2, attempt))
        );
      }

      const response = await fetch(url.toString());

      if (response.status === 429) {
        lastError = new Error("PVGIS rate limit reached");
        continue;
      }

      if (!response.ok) {
        throw new Error(`PVGIS API error: ${response.status}`);
      }

      const data: PVGISResponse = await response.json();
      setCachedData(cacheKey, data);
      return data;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }

  throw lastError ?? new Error("PVGIS request failed");
}

/**
 * Geocoding via Nominatim (OpenStreetMap)
 * Uses addressdetails=1 to extract the city/town name properly
 */
export async function geocodePostalCode(
  postalCode: string,
  country: string = "de"
): Promise<{ lat: number; lon: number; city: string } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(postalCode)}&country=${country}&format=json&addressdetails=1&limit=1`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "OpenSolarCheck/1.0 (Open Source PV Calculator)",
      },
    });

    if (!response.ok) return null;

    const results = await response.json();
    if (results.length === 0) return null;

    const result = results[0];
    const addr = result.address;
    // Extract city name from structured address (city > town > village > municipality)
    const city =
      addr?.city ||
      addr?.town ||
      addr?.village ||
      addr?.municipality ||
      result.display_name.split(",")[0];

    return {
      lat: parseFloat(result.lat),
      lon: parseFloat(result.lon),
      city,
    };
  } catch {
    return null;
  }
}
