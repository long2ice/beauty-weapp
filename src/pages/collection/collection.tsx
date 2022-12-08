import { ScrollView, Text, View } from "@tarojs/components";
import "./collection.css";
import Layout from "../../components/layout";
import { Flex, Search } from "@taroify/core";
import { useEffect, useState } from "react";
import { searchCollections } from "../../api/collection";
import ClickImage from "../../components/image";
import "./collection.scss";
import Taro from "@tarojs/taro";

export default function Collection() {
  const [value, setValue] = useState("");
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const limit = 12;
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    (async () => {
      setLoading(true);
      Taro.showLoading({
        title: "加载中",
      });
      let result = await searchCollections(value, limit, offset);
      setTotal(result.total);
      setCollections([...collections, ...result.data]);
      setLoading(false);
      Taro.hideLoading();
    })();
  }, [offset]);
  const onSearch = async () => {
    let result = await searchCollections(value, limit, offset);
    setCollections(result.data);
    setTotal(result.total);
  };
  return (
    <Layout title="图集" navbar={<View />}>
      <View className="main">
        <Search
          value={value}
          shape="rounded"
          className="search"
          placeholder="请输入搜索关键词"
          onChange={(e) => setValue(e.detail.value)}
          onSearch={onSearch}
        />
        <ScrollView
          scrollY
          scrollWithAnimation
          enhanced
          showScrollbar={false}
          bounces
          style={{
            height: "80vh",
          }}
          onScrollToLower={() => {
            if (loading) {
              return;
            }
            if (offset + limit < total) {
              setOffset(offset + limit);
            } else {
              Taro.showToast({
                title: "没有更多图集了",
                icon: "none",
                duration: 2000,
              });
            }
          }}
        >
          <Flex wrap="wrap" gutter={6}>
            {collections.map((collection) => (
              <Flex.Item span={8} key={collection.id}>
                <View className="collection-item">
                  <ClickImage
                    url={collection.url}
                    collection_id={collection.id}
                    offset={0}
                  />
                  <Text className="collection-item-text">
                    {collection.title}
                  </Text>
                </View>
              </Flex.Item>
            ))}
          </Flex>
        </ScrollView>
      </View>
    </Layout>
  );
}
