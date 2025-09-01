declare module "react-pannellum" {
  import * as React from "react";


  interface PannellumProps {
    id?: string;
    width?: string | number;
    height?: string | number;
    imageSource?: string;
    pitch?: number;
    yaw?: number;
    hfov?: number;
    autoLoad?: boolean;
    showZoomCtrl?: boolean;
    children?: React.ReactNode;
    config?: any;
    [key: string]: any; // fallback cho các props khác
  }

  export const ReactPannellum: React.FC<PannellumProps>;
  export const pannellum: any;
  export default ReactPannellum;
}
