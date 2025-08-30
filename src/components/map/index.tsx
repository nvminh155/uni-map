"use client";
import "./style.css";
import { useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
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
          map.flyTo(latlng, map.getZoom(), {
            animate: true,
            duration: 1,
          });
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

    // const watchId = navigator.geolocation.watchPosition((pos) => {
    //   const { latitude, longitude, heading, speed } = pos.coords;
    //   const latlng = { lat: latitude, lng: longitude };
    //   setPosition(latlng);
    //   map.flyTo(latlng, map.getZoom());
    //   if (!markerRef.current)
    //     markerRef.current = L.marker(latlng, {
    //       icon: createArrowIcon(0),
    //     }).addTo(map);
    //   else animateMarker(markerRef.current, latlng);
    // }, (err) => {
    //   console.log(err);
    //   // alert("error" + err.message);
    // }, {
    //   enableHighAccuracy: true,
    //   maximumAge: 1000,
    //   timeout: 10000,
    // });
    // map.on("click", (e) => {
    //   console.log(e.latlng);
    //   L.marker(e.latlng, {
    //     icon: createArrowIcon(0),
    //   }).addTo(map);
    // });
    // map.locate({
    //   watch: true,
    //   timeout: 10000,
    //   maximumAge: 2000,
    //   enableHighAccuracy: true,

    // }).on("locationfound", function (e) {
    //   if(!markerRef.current) setPosition(e.latlng);

    //   // alert("locationfound");
    //   if(!position && !markerRef.current) {
    //     map.flyTo(e.latlng, map.getZoom());
    //     console.log("fly to",  position);
    //     // alert("fly to");
    //   }

    //   markerRef.current?.setLatLng(e.latlng);
    //   const radius = e.accuracy;

    //   // const circle = L.circle(e.latlng, radius);
    //   // circle.addTo(map);
    //   console.log(e.latlng);
    //   // setBbox(e.bounds.toBBoxString().split(","));
    // });

    return () => {
      map.locate().stop();
    };
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

export default function MapComponent() {
  // console.log("re-render parent");
  return (
    <MapContainer
      center={[10.979163106745066, 106.67425870018994]}
      zoom={30}
      scrollWheelZoom
      style={{ height: "100vh", width: "100vw" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <LocationMarker />

      <Sheet>
        <SheetOverlay className="z-[1000]" />
        <SheetTrigger className="absolute right-4 top-4 z-[1000] bg-white p-2 rounded-lg hover:cursor-pointer">
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
  return target && <Marker position={target} icon={markerIcon}></Marker>;
};
