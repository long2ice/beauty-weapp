import Layout from "../../../components/layout";
import { useEffect, useState } from "react";
import { Flex, Search } from "@taroify/core";
import { View, Text } from "@tarojs/components";
import "./search.scss";
import { DeleteOutlined } from "@taroify/icons";
import {
  addKeyword,
  clearKeywords,
  getKeywords,
} from "../../../storages/search";
import { navigateTo } from "@tarojs/taro";
import { getHotKeywords } from "../../../api/picture";

export default function SearchPage() {
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hotKeywords, setHotKeywords] = useState<string[]>([]);
  const refreshHistory = async () => {
    let keywords = await getKeywords();
    setHistory(keywords);
  };
  useEffect(() => {
    (async () => {
      await refreshHistory();
      const words = await getHotKeywords();
      setHotKeywords(words);
    })();
  }, []);
  const onSearch = async (keyword: string) => {
    await addKeyword(keyword);
    await refreshHistory();
    await navigateTo({
      url: `/pages/subpages/search-result/search-result?tag=${keyword.trim()}`,
    });
  };
  const onClear = async () => {
    await clearKeywords();
    await refreshHistory();
  };
  return (
    <Layout title="搜索">
      <View className="main">
        <Search
          value={value}
          shape="rounded"
          className="search"
          placeholder="请输入搜索关键词"
          onChange={(e) => setValue(e.detail.value)}
          onSearch={async () => await onSearch(value)}
        />
        <View className="history">
          <Flex>
            <Flex.Item>
              <Text>历史搜索</Text>
            </Flex.Item>
            <Flex.Item className="action">
              <DeleteOutlined onClick={onClear} />
            </Flex.Item>
          </Flex>
          <Flex className="words" gutter={6}>
            {history.map((item) => (
              <Flex.Item key={item}>
                <Text
                  className="badge"
                  onClick={async () => {
                    await onSearch(item);
                  }}
                >
                  {item}
                </Text>
              </Flex.Item>
            ))}
          </Flex>
        </View>
        <View className="hot-search">
          <Text>大家都在搜</Text>
          <Flex className="words" gutter={6}>
            {hotKeywords.map((item) => (
              <Flex.Item key={item}>
                <Text
                  className="badge"
                  onClick={async () => {
                    await onSearch(item);
                  }}
                >
                  {item}
                </Text>
              </Flex.Item>
            ))}
          </Flex>
        </View>
      </View>
    </Layout>
  );
}
