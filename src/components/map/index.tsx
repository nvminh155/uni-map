import "./style.css";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup } from "react-leaflet";
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
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "../ui/button";
import { csl } from "@/lib/csl";

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
    const timeinterval = setInterval(() => {
      // if(navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition((position) => {
      //     const latlng = position.coords as any;
      //     const newPos = L.latLng(latlng.latitude, latlng.longitude);
      //     if (!markerRef.current) {
      //       markerRef.current = L.marker(newPos, {
      //         icon: createArrowIcon(0),
      //       }).addTo(map);
      //     } else {
      //       markerRef.current.setLatLng(newPos);
      //     }
      //     markerRef.current?.setLatLng(newPos);
      //     map.flyTo(newPos, map.getZoom(), {
      //       animate: true,
      //       duration: 1,
      //     });
      //   });
      // } else {
      //   alert("Geolocation is not supported by this browser.");
      // }
    }, 1000);
    map
      .locate({
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
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
      // map.locate().stop();
      clearInterval(timeinterval);
    };
  }, [map]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const params = new URLSearchParams(window.location.search);
      const openzoom = params.get("openzoom");
      if (openzoom === "1") {
        map.setMinZoom(3);
        map.setMaxBounds();
      }
    }, 5000);
    return () => {
      clearTimeout(timeout);
    };
  }, [markerRef.current]);

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

    const params = new URLSearchParams(window.location.search);
    const openzoom = params.get("openzoom");
    if (openzoom !== "1") {
      map.setMinZoom(zoom);
      map.setMaxBounds(maxBounds);
    }
  }, [map, bounds, maxBounds]);
  return null;
}

export default function MapComponent() {
  const { locations } = useLocations();

  if (locations.length === 0)
    return (
      <div className="h-[100vh] w-[100vw] flex items-center justify-center text-lg font-semibold">
        Loading map...
      </div>
    );

  const bounds: L.LatLngBoundsExpression = getBoundsFromLocations(locations);
  const maxBounds = L.latLngBounds(bounds as any).pad(0.4);
  return (
    <MapContainer
      center={[10.979163106745066, 106.67425870018994]}
      zoom={16}
      minZoom={3}
      maxZoom={19}
      bounds={bounds}
      // maxBounds={maxBounds}
      style={{ height: "100vh", width: "100vw" }}
      // maxBoundsViscosity={1.0} // càng cao càng "dính" vào biên
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
        maxNativeZoom={18}
        minNativeZoom={14}
        maxZoom={19}
        noWrap={false}
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

      <div className="absolute right-4 top-4 z-[1000] flex gap-2 items-center">
        <Sheet>
          <SheetOverlay className="z-[1000]" />
          <SheetTrigger className="z-[1000] bg-white p-2 rounded-lg hover:cursor-pointer shadow-lg">
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

        <Button
          className="rounded-2xl flex flex-col gap-0.5 bg-white text-black shadow-lg hover:bg-gray-100"
          onClick={() => {
            window.open("https://forms.gle/p3EsHPoXk6qC9x1N6", "_blank");
          }}
        >
          <div className="flex items-center gap-1">
            <ThumbsUp className="size-3 text-green-500" />
            <ThumbsDown className="size-3 text-red-500" />
          </div>

          <span className="text-xs font-semibold text-blue-500">Đánh giá</span>
        </Button>
      </div>
      <MarkerTarget />
    </MapContainer>
  );
}

const MarkerTarget = () => {
  const target = useMarkerTarget((s) => s.target);
  const markerRef = useRef<any>(null);
  csl.log("target", target);

  useEffect(() => {
    if (markerRef.current && target?.images?.length) {
      markerRef.current.openPopup();
    }
  }, [target]);

  return (
    target && (
      <Marker position={target.latlng} icon={markerIcon} ref={markerRef}>
        <Popup autoPan>
          <h3 className=" font-semibold">{target.name}</h3>
          <p className="text-xs text-muted-foreground">{target.description}</p>
          {/* {target?.images?.length > 0 && <ImagesTarget />} */}
        </Popup>
      </Marker>
    )
  );
};

