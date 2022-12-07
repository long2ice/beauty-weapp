import { View } from "@tarojs/components";
import { LayoutProps } from "../../types/props";
import "./layout.scss";
import MyNavbar from "./navbar";
import { ConfigProvider } from "@taroify/core";

export default function Layout(props: LayoutProps) {
  return (
    <ConfigProvider
      theme={{
        navbarTitleColor: "#fff",
      }}
    >
      <View className="layout">
        <MyNavbar title={props.title}>{props.navbar}</MyNavbar>
        {props.children}
      </View>
    </ConfigProvider>
  );
}
