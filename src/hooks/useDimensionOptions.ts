import { useQuery } from "@tanstack/react-query";
import { getDimensionValues } from "../api";
import type { DimensionKey, FilterOption } from "../types";


export function useDimensionOptions(dimension: DimensionKey) {
  return useQuery<FilterOption[], Error>({
    queryKey: ["dimension-options", dimension],
    queryFn: ({ signal }) => getDimensionValues(dimension, signal),
    staleTime: Infinity,
    retry: 2,
  });
}
