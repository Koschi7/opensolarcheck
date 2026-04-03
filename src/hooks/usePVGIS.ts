"use client";

import { useState, useCallback, useRef } from "react";
import type { PVGISResponse } from "@/lib/types";
import { fetchPVGISData } from "@/lib/api/pvgis";

interface UsePVGISReturn {
  data: PVGISResponse | null;
  loading: boolean;
  error: string | null;
  fetchData: (params: {
    lat: number;
    lon: number;
    peakpower: number;
    angle: number;
    aspect: number;
    loss?: number;
  }) => Promise<PVGISResponse | null>;
}

export function usePVGIS(): UsePVGISReturn {
  const [data, setData] = useState<PVGISResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(
    async (params: {
      lat: number;
      lon: number;
      peakpower: number;
      angle: number;
      aspect: number;
      loss?: number;
    }) => {
      // Abort any in-flight request to prevent race conditions
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      const controller = new AbortController();
      abortControllerRef.current = controller;

      setLoading(true);
      setError(null);

      try {
        const result = await fetchPVGISData({
          ...params,
          loss: params.loss ?? 14,
        });
        if (controller.signal.aborted) return null;
        setData(result);
        return result;
      } catch (err) {
        if (controller.signal.aborted) return null;
        const message =
          err instanceof Error ? err.message : "PVGIS request failed";
        setError(message);
        return null;
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    []
  );

  return { data, loading, error, fetchData };
}
