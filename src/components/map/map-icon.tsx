import L from "leaflet";

export const markerIcon = L.icon({
  iconSize: [25, 41],
  iconAnchor: [10, 41],
  popupAnchor: [2, -40],
  iconUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.6/dist/images/marker-shadow.png",
});

export function createArrowIcon(rotation: number) {
  const svgArrow = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"
         viewBox="0 0 24 24" transform="rotate(${rotation})">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#1F53AD" flood-opacity="0.8"/>
        </filter>
      </defs>
      <path d="M2 12L22 2L16 12L22 22Z" fill="#1F53AD" filter="url(#shadow)"/>
    </svg>
  `);

  return new L.Icon({
    iconUrl: "data:image/svg+xml," + svgArrow,
    iconSize: [25, 41],
    iconAnchor: [10, 41],
    popupAnchor: [2, -40],
  });
}

export const getArrowIcon = (rotation: number) =>
  L.divIcon({
    html: `<div style="
      transform: rotate(${rotation}deg);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #1F53AD;
       text-shadow: 0 0 6px #1F53AD, 0 0 10px #cfe0fe;
filter: drop-shadow(0px 0px 6px #cfe0fe);
    ">
      ➤
    </div>`,
    className: "",
    iconSize: [50, 50],
    iconAnchor: [25, 25],
    popupAnchor: [0, -25],
  });

const MapIcon = (props: any) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      {...props}
    >
      <g fill="none">
        <g clipPath="url(#SVGXv8lpc2Y)">
          <path
            fill="#86aff8"
            d="m15.362 1.218l-7.029 5.02V22.88a.52.52 0 0 0 .305-.098l7.028-5.02V1.12a.52.52 0 0 0-.305.098"
          />
          <path
            fill="#1F53AD"
            d="M1.829 1.592A.524.524 0 0 0 1 2.018v15.475a.52.52 0 0 0 .219.426l6.81 4.863a.52.52 0 0 0 .304.097V6.24zM22.781 6.08l-6.81-4.862a.52.52 0 0 0-.304-.098v16.642l6.505 4.646a.524.524 0 0 0 .828-.426V6.507a.52.52 0 0 0-.219-.426"
          />
          <path
            stroke="#212327"
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.638 22.782a.52.52 0 0 1-.61 0l-6.81-4.863A.52.52 0 0 1 1 17.493V2.018a.524.524 0 0 1 .829-.426l6.504 4.646l7.029-5.02a.52.52 0 0 1 .61 0L22.78 6.08a.52.52 0 0 1 .219.426v15.475a.524.524 0 0 1-.829.426l-6.504-4.646zM8.333 6.238v16.643m7.334-5.119V1.119"
            strokeWidth="0.5"
          />
        </g>
        <defs>
          <clipPath id="SVGXv8lpc2Y">
            <path fill="#fff" d="M0 0h24v24H0z" />
          </clipPath>
        </defs>
      </g>
    </svg>
  );
};

export default MapIcon;
