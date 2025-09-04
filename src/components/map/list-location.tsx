import { memo, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SheetClose } from "@/components/ui/sheet";

import { useMap } from "react-leaflet";

import useMarkerTarget from "@/stores/marker-target";
import { useLocations } from "@/hooks/useLocations";

type ListLocationProps = {};

const ListLocation = ({}: ListLocationProps) => {
  const setMarkerTarget = useMarkerTarget((s) => s.setTarget);
  const [search, setSearch] = useState("");
  const map = useMap();
  const { locations } = useLocations();

  // console.log(locations);
  const filteredLocations = useMemo(() => {
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(search.toLowerCase()) ||
        loc.description?.toLowerCase().includes(search.toLowerCase())
    );
  }, [search, locations]);

  const note =
    "Lưu ý: Trong các mô tả các tầng được gọi theo thứ tự trệt(1) -> Tầng 2 -> Tầng 3 -> Tầng 4 -> Tầng 5.";
  return (
    <>
      <div className="text-xs text-muted-foreground">{note}</div>
      <div className="flex items-center gap-2">
        <Input
          placeholder="Tìm kiếm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          autoFocus={false}
          className="border focus-visible:ring-0"
        />
      </div>
      <ScrollArea className="h-[calc(100%-190px)] ">
        <div className="space-y-2">
          {filteredLocations.map((loc, i) => (
            <Card key={i} className="p-3 shadow-lg">
              <h3 className="font-medium">{loc.name}</h3>
              <p className="mb-2 text-sm text-muted-foreground">
                {loc.description}
              </p>
              <SheetClose asChild>
                <Button
                  size="sm"
                  onClick={() => {
                    setMarkerTarget({
                      id: loc.id,
                      latlng: [loc.lat, loc.lng],
                      name: loc.name,
                      description: loc.description,
                      images: loc.images,
                    });
                    map.flyTo([loc.lat, loc.lng], 18);
                  }}
                  className="hover:cursor-pointer"
                >
                  Xem trên bản đồ
                </Button>
              </SheetClose>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default memo(ListLocation);
