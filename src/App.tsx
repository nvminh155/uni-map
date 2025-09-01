import MapComponent from "./components/map";
import { getDeviceType } from "./utils";

const App = () => {
  const deviceType = getDeviceType();
  return (
    <div className="z-[1000] ">
      <MapComponent />
      {deviceType === "pc" && (
        <div className="fixed top-4 left-1/2 text-lg select-none -translate-x-1/2 bg-white p-1 rounded-lg shadow-lg z-[1000]">
          Nên sử dụng trên điện thoại của bạn
        </div>
      )}
    </div>
  );
};

export default App;
