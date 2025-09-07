import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import ImgPannellum from "./img-pannellum";
import { Button } from "../ui/button";
import { ImageIcon } from "lucide-react";
import useMarkerTarget from "@/stores/marker-target";

function ImagesTarget() {
  const target = useMarkerTarget((s) => s.target);

  if (!target?.id || !target.images || target.images.length === 0) return null;
  const baseUrl =
    import.meta.env.VITE_SUPABASE_URL +
    "/storage/v1/object/public/panoramas/locations/L" +
    target.id;

  // console.log("baseUrl", baseUrl, target.images);
  return (
    <Dialog>
      <DialogTrigger asChild onClick={() => {}}>
        <Button>
          <ImageIcon className="size-4" />
          <span className="text-xs">Xem hình ảnh</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="z-[1000] !w-[90%] !max-w-[90%] !max-h-[90%] flex flex-col px-0 pb-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="text-sm">
            Hình ảnh của {target.name}
          </DialogTitle>
          <DialogDescription className="text-xs">
            {target.description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1">
          <div className="text-xs text-gray-500">
            Đây là bản beta để xem hình ảnh liên quan đến {target.name} nên còn
            có thể còn sai sót hoặc ảnh mờ. Vui lòng góp ý{" "}
            <a
              href="https://forms.gle/p3EsHPoXk6qC9x1N6"
              target="_blank"
              className="text-blue-500 underline"
            >
              tại đây
            </a>{" "}
            nếu như bạn có thêm hình ảnh liên quan hoặc yêu cầu đổi hình ảnh.
          </div>
          <ImgPannellum imageSource={baseUrl + "/" + target.images[0]} />
        </div>
        {/* <div className="flex items-center overflow-x-auto">
          {target.images.map((image, i) => (
            // <img
            //   key={"image " + i}
            //   src={baseUrl + "/" + image}
            //   alt={"photo of " + target.name}
            //   className="w-[200px] h-[200px] o"
            // />
            <BlurImage
              key={"image " + i}
              src={baseUrl + "/" + image}
              alt={"photo of " + target.name}
              ratio={1}
              className="w-[200px] h-[200px] object-cover"
            />
          ))}
        </div> */}
      </DialogContent>
    </Dialog>
  );
}

export default ImagesTarget;
