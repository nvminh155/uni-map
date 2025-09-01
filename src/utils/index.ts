import type { Location } from "@/types/location";

function getBoundsFromLocations(locations: Location[]): any {
  const lats = locations.map((loc) => loc.lat);
  const lngs = locations.map((loc) => loc.lng);

  const southWest = [Math.min(...lats), Math.min(...lngs)];
  const northEast = [Math.max(...lats), Math.max(...lngs)];

  return [southWest, northEast];
}

function getDeviceType() {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad|iPod/i.test(ua)) {
    return "phone";
  }
  if (/Tablet|iPad/i.test(ua)) {
    return "tablet";
  }
  return "pc";
}


export { getBoundsFromLocations, getDeviceType };