import Layout from "../../../components/layout";
import { getCurrentInstance } from "@tarojs/runtime";
import { useRef } from "react";
import { ScrollView, View } from "@tarojs/components";
import Content from "../../../components/content";
import { ContentRef } from "../../../../types/props";

export default function SearchResult() {
  const params = getCurrentInstance()?.router?.params;
  const showTags = params?.showTags as boolean;
  const defaultTag = params?.tag as string;
  const favorite = params?.favorite as boolean;
  const contentRef = useRef<ContentRef>(null);
  let title = "分类";
  if (favorite) {
    title = "我的收藏";
  } else if (defaultTag) {
    title = defaultTag;
  }
  return (
    <Layout title={title}>
      <View className="main">
        <ScrollView
          scrollY
          scrollWithAnimation
          enhanced
          showScrollbar={false}
          bounces
          style={{
            height: "90vh",
          }}
          onScrollToLower={() => {
            contentRef.current?.refresh();
          }}
        >
          <Content
            showTags={showTags}
            tag={defaultTag}
            ref={contentRef}
            favorite={favorite}
            limit={15}
          />
        </ScrollView>
      </View>
    </Layout>
  );
}
