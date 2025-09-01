
import ReactPannellum from "react-pannellum";

type ImgPannellumProps = {
  imageSource: string;
}
export default function ImgPannellum({ imageSource }: ImgPannellumProps) {
  return (
    <div style={{ width: "100%", height: "500px"}} className="!max-h-[300px] relative">
      <ReactPannellum
        id="pano"
        sceneId="firstScene"
        imageSource={imageSource}
        config={{
          autoLoad: true,
        }}
        className="!w-full !h-full"
      />
    </div>
  );
}
