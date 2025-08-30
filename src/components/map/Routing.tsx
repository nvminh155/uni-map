// import React, { useEffect } from "react";
// import { useMap } from "react-leaflet";
// import L from "leaflet";

// const myAPIKey = import.meta.env.VITE_SOME_KEY;

// const fromWaypoint: [number, number] = [38.937165, -77.04559];
// const toWaypoint: [number, number] = [38.881152, -76.990693];

// const turnByTurnMarkerStyle: L.CircleMarkerOptions = {
//   radius: 5,
//   fillColor: "#fff",
//   color: "#555",
//   weight: 1,
//   opacity: 1,
//   fillOpacity: 1,
// };

// function Routing1() {
//   const map = useMap();

//   return null;
// }

// const Routing = () => {
// return null;
//   const map = useMap();

//   useEffect(() => {
//     if (!from || !to) return;

//     fetch(
//       `https://api.geoapify.com/v1/routing?waypoints=${fromWaypoint.join(
//         ","
//       )}|${toWaypoint.join(",")}&mode=drive&apiKey=${myAPIKey}`
//     )
//       .then((res) => res.json())
//       .then((result) => {
//         map.flyTo([to[0], to[1]], 15);
//         console.log(result);
//         L.geoJSON(result, {
//           style: () => ({
//             color: "rgba(20, 137, 255, 0.7)",
//             weight: 5,
//           }),
//         })
//           .bindPopup((layer: any) => {
//             return `${layer.feature.properties.distance} ${layer.feature.properties.distance_units}, ${layer.feature.properties.time}`;
//           })
//           .addTo(map);
//       })
//       .catch((err) => console.error(err));
//   }, [from, to, map]);
//   return <div>Routing</div>;
// };

// export default Routing;
