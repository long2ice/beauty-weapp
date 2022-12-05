import { Button } from "@tarojs/components";
import { OpenButtonProps } from "../../types/props";

export default function OpenButton(props: OpenButtonProps) {
  return (
    <Button
      openType={props.openType}
      plain
      style={{
        backgroundColor: "transparent",
        border: "none",
        padding: "0",
      }}
    >
      {props.children}
    </Button>
  );
}
