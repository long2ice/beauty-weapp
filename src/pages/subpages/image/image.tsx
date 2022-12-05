import { Flex, Image } from "@taroify/core";
import { getCurrentInstance } from "@tarojs/runtime";
import "./image.scss";
import { Text, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro, { navigateBack } from "@tarojs/taro";
import {
  favoritePicture,
  getPicturesByTag,
  likePicture,
} from "../../../api/picture";
import { Swiper } from "@taroify/core";
import { getSetting, saveImageToPhotosAlbum } from "@tarojs/taro";
import OpenButton from "../../../components/button";
import {
  LikeOutlined,
  GoodJobOutlined,
  ShareOutlined,
  ArrowLeft,
  Down,
} from "@taroify/icons";

export default function ImageView() {
  const params = getCurrentInstance()?.router?.params;
  const tag = params?.tag as string;
  const [toolbarHidden, setToolbarHidden] = useState(false);
  const [animationData, setAnimationData] = useState<any>();
  const [animationDataIndicator, setAnimationDataIndicator] = useState<any>();
  const [index, setIndex] = useState(0);
  Taro.useShareAppMessage(() => {
    return {
      title: "分享给你一张好看的图片",
      path: `/pages/subpages/image/image?tag=${tag}&offset=${index}`,
    };
  });
  const [pictures, setPictures] = useState<Array<Picture>>([]);
  const [picture, setPicture] = useState<Picture>();
  const [offset, setOffset] = useState(params?.offset as number);
  const limit = 20;
  const animation = Taro.createAnimation({
    duration: 500,
    timingFunction: "linear",
    delay: 0,
    transformOrigin: "50% 50% 0",
  });
  const animationIndicator = Taro.createAnimation({
    duration: 500,
    timingFunction: "linear",
    delay: 0,
    transformOrigin: "50% 50% 0",
  });
  const favoritePic = async () => {
    pictures[index].favorite = !pictures[index].favorite;
    await favoritePicture(pictures[index].id);
    if (pictures[index].favorite) {
      Taro.showToast({
        title: "收藏成功",
        icon: "success",
        duration: 2000,
      });
      setPicture({
        ...pictures[index],
        favorite_count: pictures[index].favorite_count + 1,
        favorite: true,
      });
    } else {
      Taro.showToast({
        title: "取消收藏成功",
        icon: "none",
        duration: 2000,
      });
      setPicture({
        ...pictures[index],
        favorite_count: pictures[index].favorite_count - 1,
        favorite: false,
      });
    }
  };
  const likePic = async () => {
    pictures[index].like = !pictures[index].like;
    await likePicture(pictures[index].id);
    if (pictures[index].like) {
      Taro.showToast({
        title: "点赞成功",
        icon: "success",
        duration: 2000,
      });
      setPicture({
        ...pictures[index],
        like_count: pictures[index].like_count + 1,
        like: true,
      });
    } else {
      Taro.showToast({
        title: "取消点赞成功",
        icon: "none",
        duration: 2000,
      });
      setPicture({
        ...pictures[index],
        like_count: pictures[index].like_count - 1,
        like: false,
      });
    }
  };
  const downloadImage = async (url: string) => {
    let res = await Taro.downloadFile({
      url: url,
    });
    if (res.statusCode === 200) {
      saveImageToPhotosAlbum({
        filePath: res.tempFilePath,
      }).then((_) => {
        Taro.showToast({
          title: "保存成功",
          icon: "success",
          duration: 2000,
        });
      });
    } else {
      Taro.showToast({
        title: "下载失败",
        icon: "none",
        duration: 2000,
      });
      return "";
    }
  };
  const saveImage = async () => {
    let url = pictures[index].url;
    let setting = await getSetting();
    if (setting.authSetting["scope.writePhotosAlbum"]) {
      await downloadImage(url);
    } else {
      await Taro.authorize({
        scope: "scope.writePhotosAlbum",
        async success() {
          await downloadImage(url);
        },
      });
    }
  };

  useEffect(() => {
    setPicture(pictures[index]);
  }, [index]);
  useEffect(() => {
    (async () => {
      let newPictures = [
        ...pictures,
        ...(await getPicturesByTag(tag, limit, offset, true)),
      ];
      setPictures(newPictures);
      setPicture(newPictures[index]);
    })();
  }, [offset]);
  useEffect(() => {
    if (toolbarHidden) {
      animation.translateY(100).step();
      setAnimationData(animation.export());
      animationIndicator.translateY(75).step();
      setAnimationDataIndicator(animationIndicator.export());
    } else {
      animation.translateY(0).step();
      setAnimationData(animation.export());
      animationIndicator.translateY(0).step();
      setAnimationDataIndicator(animationIndicator.export());
    }
  }, [toolbarHidden]);
  return (
    <View>
      <Swiper
        onChange={(v) => {
          if (pictures.length == v + 1 && v == index + 1) {
            setOffset(offset + limit);
          }
          setIndex(v);
        }}
      >
        {pictures.map((p) => (
          <Swiper.Item key={p.id}>
            <Image
              src={p.url}
              mode="aspectFill"
              placeholder="加载中..."
              fallback="加载失败"
              className="full-image"
              onClick={() => {
                setToolbarHidden(!toolbarHidden);
              }}
            />
          </Swiper.Item>
        ))}
        <Swiper.Indicator
          className="indicator"
          animation={animationDataIndicator}
        >
          {index + 1} / {pictures.length}
        </Swiper.Indicator>
      </Swiper>
      <View className="container">
        <View className="toolbar" animation={animationData}>
          <Flex justify="space-between" align="center">
            <Flex.Item>
              <View
                onClick={async () => {
                  await navigateBack();
                }}
                className="action-item"
              >
                <ArrowLeft size={20} />
                <Text>返回</Text>
              </View>
            </Flex.Item>
            <Flex.Item>
              <View onClick={favoritePic} className="action-item">
                <LikeOutlined
                  color={picture?.favorite ? "white" : "red"}
                  size={20}
                />
                <Text>收藏</Text>
              </View>
            </Flex.Item>
            <Flex.Item>
              <View onClick={saveImage} className="action-item">
                <Down size={20} />
                <Text>下载</Text>
              </View>
            </Flex.Item>
            <Flex.Item>
              <View className="action-item" onClick={likePic}>
                <GoodJobOutlined
                  color={picture?.like ? "white" : "red"}
                  size={20}
                />
                <Text>点赞</Text>
              </View>
            </Flex.Item>
            <Flex.Item>
              <OpenButton openType="share">
                <View className="action-item">
                  <ShareOutlined size={20} />
                  <Text>分享</Text>
                </View>
              </OpenButton>
            </Flex.Item>
          </Flex>
        </View>
      </View>
    </View>
  );
}
