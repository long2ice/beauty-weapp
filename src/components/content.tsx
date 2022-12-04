import { Flex } from "@taroify/core";
import { ScrollView, Text, View } from "@tarojs/components";
import {
  forwardRef,
  Ref,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { getPictures, getPicturesByTag, getPictureTag } from "../api/picture";
import { ContentProps, ContentRef } from "../../types/props";
import "./content.scss";
import ClickImage from "./image";

function Content(props: ContentProps, ref: Ref<ContentRef>) {
  const [tags, setTags] = useState<Array<string>>([]);
  const [pictures, setPictures] = useState<Array<Picture>>([]);
  const [tag, setTag] = useState<string>(props.tag);
  const [offset, setOffset] = useState(0);
  const limit = props.limit;
  useImperativeHandle(ref, () => ({
    refresh: () => {
      setOffset(offset + limit);
    },
    tag: tag,
  }));
  useEffect(() => {
    (async () => {
      if (props.showTags) {
        setTags(await getPictureTag());
      }
    })();
  }, []);
  useEffect(() => {
    (async () => {
      setPictures(await getPicturesByTag(tag, limit, offset));
    })();
  }, [tag]);
  useEffect(() => {
    (async () => {
      setPictures([...pictures, ...(await getPictures(limit, offset))]);
    })();
  }, [offset]);
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
            <ClickImage picture={picture} tag={tag} offset={index} />
          </Flex.Item>
        ))}
      </Flex>
    </>
  );
}

export default forwardRef(Content);
