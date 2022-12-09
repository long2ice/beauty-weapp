import { Flex } from "@taroify/core";
import { ScrollView, Text, View } from "@tarojs/components";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {
  getFavoritePictures,
  getPicturesByTag,
  getPictureTag,
} from "../api/picture";
import { ContentProps, ContentRef } from "../../types/props";
import "./content.scss";
import ClickImage from "./image";
import Taro from "@tarojs/taro";

function Content(props: ContentProps, ref: Ref<ContentRef>) {
  const [tags, setTags] = useState<Array<string>>([]);
  const [pictures, setPictures] = useState<Array<Picture>>([]);
  const [total, setTotal] = useState(0);
  const [tag, setTag] = useState<string>(props.tag);
  const [offset, setOffset] = useState(0);
  const limit = props.limit;
  const [loading, setLoading] = useState(false);
  useImperativeHandle(ref, () => ({
    refresh: async () => {
      if (loading) {
        return;
      }
      setLoading(true);

      if (offset + limit < total) {
        Taro.showLoading({
          title: "加载中",
        });
        let newOffset = offset + limit;
        setOffset(newOffset);
        let result;
        if (props.favorite) {
          result = await getFavoritePictures(limit, newOffset);
        } else {
          result = await getPicturesByTag(tag, limit, newOffset);
        }
        setPictures([...pictures, ...result.data]);
        setTotal(result.total);
        setLoading(false);
        Taro.hideLoading();
      } else {
        Taro.showToast({
          title: "没有更多图片了",
          icon: "none",
        });
      }
    },
    tag: tag,
  }));
  useEffect(() => {
    (async () => {
      if (props.showTags) {
        setTags(await getPictureTag());
      }
      if (props.favorite) {
        let result = await getFavoritePictures(limit, offset);
        setPictures(result.data);
        setTotal(result.total);
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if (tag) {
        setOffset(0);
        let result = await getPicturesByTag(tag, limit, 0);
        setPictures(result.data);
        setTotal(result.total);
      }
    })();
  }, [tag]);
  return (
    <>
      {props.showTags && (
        <ScrollView
          scrollX
          scrollWithAnimation
          enhanced
          showScrollbar={false}
          bounces
          className="tags"
        >
          <Flex gutter={10}>
            {tags.map((t) => (
              <Flex.Item
                key={t}
                onClick={() => {
                  setTag(t);
                }}
              >
                <View className={"badge" + (t == tag ? " badge-active" : "")}>
                  <Text>{t}</Text>
                </View>
              </Flex.Item>
            ))}
          </Flex>
        </ScrollView>
      )}
      <Flex wrap="wrap" gutter={6}>
        {pictures.map((picture, index) => (
          <Flex.Item span={8} key={picture.id}>
            <ClickImage
              url={picture.url}
              tag={tag}
              offset={index}
              favorite={props.favorite}
            />
          </Flex.Item>
        ))}
      </Flex>
    </>
  );
}

export default forwardRef(Content);
