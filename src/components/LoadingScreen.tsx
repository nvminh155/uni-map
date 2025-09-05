import { useLocations } from "@/hooks/useLocations";
import { csl } from "@/lib/csl";
import { useState, useEffect, useRef } from "react";

export default function LocationFade() {
  const [index, setIndex] = useState(0);
  const { locations } = useLocations();

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (locations.length === 0) return;

    const interval = setInterval(() => {
      csl.log(index, locations[index]);

      setIndex((prev) => (prev + 1) % locations.length);

      const leaflet = document.querySelectorAll(".leaflet-map-pane");
      let t: any = null;
      if (leaflet.length > 0) {
        t = setTimeout(() => {
          ref.current?.classList.add("hidden");
          ref.current?.remove();
          clearTimeout(t);
        }, 1600);
      }
    
    }, 800); // 1 giây đổi 1 lần

    return () => clearInterval(interval);
  }, [locations]);

  useEffect(() => {
  
  }, [index, locations]);

  csl.log(index, locations[index]);
  return (
    <div
      ref={ref}
      className="text-xl font-semibold z-[2000] gap-1 bg-[#f1f5f9] fixed top-0 left-0 w-full h-[100vh] flex flex-col items-center justify-center"
    >
      <div>
        <img src="/chick.gif" alt="logo" className="w-[60px] h-[60px]" />
      </div>
      <span className=" font-yanone font-light text-[50px] text-gradient text-shadow-2xs">
        Bạn đang ở?
      </span>
      <span className={`fade font-[400] font-yanone  text-[65px] text-[#1F53AD]`}>
        {locations.length > 0 ? locations[index]?.name : "..."}
      </span>
    </div>
  );
}
