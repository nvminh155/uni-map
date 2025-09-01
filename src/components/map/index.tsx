import "./style.css";
import { useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  Popup,
} from "react-leaflet";
import L from "leaflet";

import MapIcon, { createArrowIcon, markerIcon } from "./map-icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetOverlay,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ListLocation from "./list-location";
import useMarkerTarget from "@/stores/marker-target";
import { getBoundsFromLocations } from "@/utils";
import { useLocations } from "@/hooks/useLocations";

function distanceInMeters(latlng1: any, latlng2: any) {
  return latlng1.distanceTo(latlng2); // Leaflet built-in
}

// Animate marker
function animateMarker(marker: L.Marker, newLatLng: any, duration = 1000) {
  const start = marker.getLatLng();
  const startTime = performance.now();

  function animate(time: number) {
    const t = Math.min((time - startTime) / duration, 1);
    const lat = start.lat + (newLatLng.lat - start.lat) * t;
    const lng = start.lng + (newLatLng.lng - start.lng) * t;
    marker.setLatLng([lat, lng]);
    if (t < 1) requestAnimationFrame(animate);
  }
  requestAnimationFrame(animate);
}

function LocationMarker() {
  // const [bbox, setBbox] = useState<string[]>([]);
  const markerRef = useRef<L.Marker | null>(null);
  const map = useMap();

  useEffect(() => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.alpha !== null) {
        markerRef.current?.setIcon(createArrowIcon(event.alpha));
      }
    };
    window.addEventListener("deviceorientation", handleOrientation, true);

    map.on("click", (e) => {
      const params = new URLSearchParams(window.location.search);
      const track = params.get("track");

      if (track === "minhnv") console.log([e.latlng.lat, e.latlng.lng]);
    });
    map
      .locate({
        watch: true,
        timeout: 10000,
        maximumAge: 5000,
        enableHighAccuracy: false,
      })
      .on("locationfound", (e) => {
        const latlng = e.latlng;
        if (!markerRef.current) {
          markerRef.current = L.marker(latlng, {
            icon: createArrowIcon(0),
          }).addTo(map);
          // Fly map
          // map.flyTo(latlng, map.getZoom(), {
          //   animate: true,
          //   duration: 1,
          // });
        }
        const newPos = L.latLng(latlng.lat, latlng.lng);

        if (markerRef.current) {
          const dist = distanceInMeters(markerRef.current.getLatLng(), newPos);
          if (dist < 0.5) {
            // thay đổi < 3m → bỏ qua để tránh giật
            return;
          }
        }

        markerRef.current?.setLatLng(newPos); // cập nhật lastPos

        // Animate marker
        animateMarker(markerRef.current!, newPos, 1200);

        // Fly map
        // map.flyTo(newPos, map.getZoom(), {
        //   animate: true,
        //   duration: 1,
        // });
      });

    return () => {
      map.locate().stop();
    };
  }, [map]);

  useEffect(() => {
    map.on("moveend", () => {
      const bounds = map.getBounds(); // lấy LatLngBounds
      console.log("BBox:", bounds);

      // Nếu muốn trả về bbox dạng [west, south, east, north]:
      const bbox = [
        bounds.getWest(),
        bounds.getSouth(),
        bounds.getEast(),
        bounds.getNorth(),
      ];

      console.log("BBox array:", bbox);
    });
  }, [map]);

  return null;
  // return position === null ? null : (
  //   <Marker
  //     ref={markerRef}
  //     position={position}
  //     icon={createArrowIcon(heading)}
  //   >
  //     <Popup>
  //       You are here. <br />
  //       Map bbox: <br />
  //       <b>Southwest lng</b>: {bbox[0]} <br />
  //       <b>Southwest lat</b>: {bbox[1]} <br />
  //       <b>Northeast lng</b>: {bbox[2]} <br />
  //       <b>Northeast lat</b>: {bbox[3]}
  //     </Popup>
  //   </Marker>
  // );
}

// bbox: [west, south, east, north]

function SetBounds({
  bounds,
  maxBounds,
}: {
  bounds: L.LatLngBoundsExpression;
  maxBounds: L.LatLngBoundsExpression;
}) {
  const map = useMap();

  useEffect(() => {
    const zoom = map.getBoundsZoom(bounds);
    map.fitBounds(bounds);
    map.setMinZoom(zoom);
    map.setMaxBounds(maxBounds);
  }, [map, bounds, maxBounds]);
  return null;
}

export default function MapComponent() {
  const { locations } = useLocations();

  if (locations.length === 0) return <div>
    Loading map...
  </div>;
  const bounds: L.LatLngBoundsExpression = getBoundsFromLocations(locations);
  const maxBounds = L.latLngBounds(bounds as any).pad(0.4);
  return (
    <MapContainer
      center={[10.979163106745066, 106.67425870018994]}
      zoom={16}
      minZoom={14}
      maxZoom={18}
      bounds={bounds}
      maxBounds={maxBounds}
      style={{ height: "100vh", width: "100vw"}}
      // maxBoundsViscosity={1.0} // càng cao càng "dính" vào biên
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/* <Polygon
        pathOptions={{
          fillColor: "white",
          fillOpacity: 0.8,
          color: "transparent",
        }}
        positions={[world as any, allowed as any]} // world trừ allowed
      /> */}
      <LocationMarker />
      <SetBounds bounds={bounds} maxBounds={maxBounds} />
      <Sheet>
        <SheetOverlay className="z-[1000]" />
        <SheetTrigger className="absolute right-4 top-4 z-[1000] bg-white p-2 rounded-lg hover:cursor-pointer shadow-lg">
          <MapIcon className="size-6" />
        </SheetTrigger>
        <SheetContent
          className="z-[1000] w-[300px] sm:w-[540px] px-2"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          <SheetHeader>
            <SheetTitle>Danh sách địa điểm</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <ListLocation />
        </SheetContent>
      </Sheet>

    
      <MarkerTarget />
    </MapContainer>
  );
}

const MarkerTarget = () => {
  const target = useMarkerTarget((s) => s.target);
  // console.log("re-render marker target =>", target);
  return target && <Marker position={target.latlng} icon={markerIcon}>
    <Popup>
      <h3 className="text-lg font-semibold">{target.name}</h3>
      <p>{target.description}</p>
      
    </Popup>
  </Marker>;
};
