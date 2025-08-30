import { useEffect, useState } from "react";
import { sb } from "@/lib/supabase";
import type { Location } from "@/types/location";

export function useLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      const { data, error } = await sb
        .from("locations")
        .select("*")
        .order("id");

      if (error) {
        setError(error.message);
      } else {
        setLocations(data as Location[]);
      }
      setLoading(false);
    };

    fetchLocations();
  }, []);

  return { locations, loading, error };
}
