import { ClickImageProps } from "../../types/props";
import { Image } from "@taroify/core";
import { navigateTo } from "@tarojs/taro";

export default function ClickImage(props: ClickImageProps) {
  return (
    <Image
      src={props.url}
      className="picture"
      mode="aspectFill"
      placeholder="加载中..."
      fallback="加载失败"
      onClick={async () => {
        await navigateTo({
          url: `/pages/subpages/image/image?tag=${props.tag}&offset=${props.offset}&collection_id=${props.collection_id}&favorite=${props.favorite}`,
        });
      }}
    />
  );
}
