import { useQuery } from "@tanstack/react-query";
import { sb } from "@/lib/supabase";
import type { Location } from "@/types/location";
import { csl } from "@/lib/csl";

export function useLocations() {
  const { data: locations = [], isLoading: loading, error } = useQuery({
    queryKey: ["locations"],
    queryFn: async (): Promise<Location[]> => {
      const { data, error } = await sb
        .from("locations")
        .select("*")
        .order("id");

      if (error) {
        csl.error(error);
        throw new Error(error.message);
      }

      return data as Location[];
    },
    staleTime: 1000 * 60 * 60 * 15,
  });

  return { 
    locations, 
    loading, 
    error: error ? error.message : null 
  };
}
