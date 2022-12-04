import { ScrollView, Text, View } from "@tarojs/components";
import "./home.css";
import Layout from "../../components/layout";
import { Navbar } from "@taroify/core";
import { Search } from "@taroify/icons";
import { Arrow } from "@taroify/icons";
import { Flex } from "@taroify/core";
import { useEffect, useRef, useState } from "react";
import { getHotPictures } from "../../api/picture";
import { navigateTo } from "@tarojs/taro";
import Content from "../../components/content";
import { ContentRef } from "../../../types/props";
import ClickImage from "../../components/image";

export default function Home() {
  const [hotPictures, setHotPictures] = useState<Array<Picture>>([]);
  useEffect(() => {
    (async () => {
      setHotPictures(await getHotPictures(20, 0));
    })();
  }, []);

  const contentRef = useRef<ContentRef>(null);

  return (
    <Layout
      title="首页"
      navbar={
        <Navbar.NavLeft
          onClick={async () => {
            await navigateTo({
              url: "/pages/subpages/search/search",
            });
          }}
          icon={<Search color="white" />}
        />
      }
    >
      <View className="main">
        <ScrollView
          scrollY
          scrollWithAnimation
          enhanced
          showScrollbar={false}
          bounces
          style={{
            height: "85vh",
          }}
          onScrollToLower={() => {
            contentRef.current?.refresh();
          }}
        >
          <Flex justify="start" align="center" className="header">
            <Flex.Item>
              <Text className="title">热门推荐</Text>
            </Flex.Item>
            <Flex.Item className="action">
              <View
                onClick={async () => {
                  await navigateTo({
                    url: "/pages/subpages/search-result/search-result?showTags=true&tag=热门",
                  });
                }}
              >
                <Text>更多</Text>
                <Arrow />
              </View>
            </Flex.Item>
          </Flex>
          <ScrollView
            scrollX
            scrollWithAnimation
            enhanced
            showScrollbar={false}
            bounces
          >
            <Flex gutter={6}>
              {hotPictures.map((picture, index) => (
                <Flex.Item span={8} key={picture.id}>
                  <ClickImage picture={picture} tag="热门" offset={index} />
                </Flex.Item>
              ))}
            </Flex>
          </ScrollView>
          <Flex justify="start" align="center" className="header all">
            <Flex.Item>
              <Text className="title">全部壁纸</Text>
            </Flex.Item>
            <Flex.Item className="action">
              <View
                onClick={async () => {
                  await navigateTo({
                    url:
                      "/pages/subpages/search-result/search-result?showTags=true&tag=" +
                      contentRef.current?.tag,
                  });
                }}
              >
                <Text>更多</Text>
                <Arrow />
              </View>
            </Flex.Item>
          </Flex>
          <Content ref={contentRef} tag="最新" showTags limit={9} />
        </ScrollView>
      </View>
    </Layout>
  );
}