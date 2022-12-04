import { Text, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import { getSystemInfoSync, navigateBack } from "@tarojs/taro";
import { Navbar } from "@taroify/core";
import { NavbarProps } from "../../types/props";
import { ArrowLeft } from "@taroify/icons";

export default function MyNavbar(props: NavbarProps) {
  const [navHeight, setNavHeight] = useState(0);
  useEffect(() => {
    let sysInfo = getSystemInfoSync();
    let statusBarHeight = sysInfo.statusBarHeight || 0;
    setNavHeight(statusBarHeight);
  }, []);
  return (
    <View
      style={{
        paddingTop: navHeight + "px",
        backgroundColor: "#6190E8",
      }}
    >
      <Navbar
        title={props.title}
        style={{
          backgroundColor: "#6190E8",
          color: "#fff",
        }}
      >
        {props.children ?? (
          <Navbar.NavLeft
            style={{
              color: "#fff",
            }}
            onClick={async () => {
              await navigateBack();
            }}
            icon={<ArrowLeft color="white" />}
          >
            <Text
              style={{
                color: "#fff",
              }}
            >
              返回
            </Text>
          </Navbar.NavLeft>
        )}
      </Navbar>
    </View>
  );
}
