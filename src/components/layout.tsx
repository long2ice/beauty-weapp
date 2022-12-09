import { View } from "@tarojs/components";
import { LayoutProps } from "../../types/props";
import "./layout.scss";
import MyNavbar from "./navbar";
import { ConfigProvider } from "@taroify/core";
import { useEffect, useState } from "react";
import * as auth from "../services/auth";

export default function Layout(props: LayoutProps) {
  const [login, setLogin] = useState(false);
  useEffect(() => {
    (async () => {
      await auth.login();
      setLogin(true);
    })();
  }, []);
  return (
    <ConfigProvider
      theme={{
        navbarTitleColor: "#fff",
      }}
    >
      <View className="layout">
        <MyNavbar title={props.title}>{props.navbar}</MyNavbar>
        {login && props.children}
      </View>
    </ConfigProvider>
  );
}
