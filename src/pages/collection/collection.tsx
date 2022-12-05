import { ScrollView, View } from "@tarojs/components";
import "./collection.css";
import Layout from "../../components/layout";
import { Flex, Search } from "@taroify/core";
import { useEffect, useState } from "react";
import { searchCollections } from "../../api/collection";
import ClickImage from "../../components/image";
import "./collection.scss";

export default function Collection() {
  const [value, setValue] = useState("");
  const [collections, setCollections] = useState<CollectionType[]>([]);
  const limit = 12;
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    (async () => {
      setCollections([
        ...collections,
        ...(await searchCollections(value, limit, offset)),
      ]);
    })();
  }, [offset, value]);
  const onSearch = async (keyword: string) => {
    console.log(keyword);
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
          onSearch={async () => await onSearch(value)}
        />
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
            setOffset(offset + limit);
          }}
        >
          <Flex wrap="wrap" gutter={6} className="content">
            {collections.map((collection) => (
              <Flex.Item span={8} key={collection.id}>
                <ClickImage
                  url={collection.url}
                  collection_id={collection.id}
                  offset={0}
                />
              </Flex.Item>
            ))}
          </Flex>
        </ScrollView>
      </View>
    </Layout>
  );
}
