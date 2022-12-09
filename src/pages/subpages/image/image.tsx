import { Flex, Image, Popup, Swiper } from "@taroify/core";
import { getCurrentInstance } from "@tarojs/runtime";
import "./image.scss";
import { Text, View } from "@tarojs/components";
import { useEffect, useState } from "react";
import Taro, {
  getSetting,
  navigateBack,
  saveImageToPhotosAlbum,
} from "@tarojs/taro";
import {
  favoritePicture,
  getFavoritePictures,
  getPicturesByTag,
  likePicture,
} from "../../../api/picture";
import OpenButton from "../../../components/button";
import {
  ArrowLeft,
  Down,
  GoodJobOutlined,
  LabelOutlined,
  LikeOutlined,
  ShareOutlined,
} from "@taroify/icons";
import { getCollectionPictures } from "../../../api/collection";

export default function ImageView() {
  const params = getCurrentInstance()?.router?.params;
  const tag = params?.tag as string;
  const collection_id = params?.collection_id as string;
  const favorite = params?.favorite as boolean;
  const [toolbarHidden, setToolbarHidden] = useState(false);
  const [animationData, setAnimationData] = useState<any>();
  const [animationDataIndicator, setAnimationDataIndicator] = useState<any>();
  const defaultOffset = Number(params?.offset ?? 0);
  const [index, setIndex] = useState(defaultOffset);
  const [open, setOpen] = useState(false);
  Taro.useShareAppMessage(() => {
    return {
      title: "分享给你一张好看的美女图片",
      path: `/pages/subpages/image/image?tag=${tag}&offset=${index}&collection_id=${collection_id}`,
    };
  });
  const [pictures, setPictures] = useState<Array<Picture>>([]);
  const [picture, setPicture] = useState<Picture>();
  const [offset, setOffset] = useState(Number(0));
  const limit = 20;
  const [total, setTotal] = useState(0);
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
    if (pictures[index].favorite) {
      Taro.showToast({
        title: "收藏成功",
        icon: "success",
      });
      pictures[index].favorite_count++;
      setPicture({
        ...pictures[index],
      });
    } else {
      Taro.showToast({
        title: "取消收藏成功",
        icon: "none",
      });
      pictures[index].favorite_count--;
      setPicture({
        ...pictures[index],
      });
    }
    await favoritePicture(pictures[index].id);
  };
  const likePic = async () => {
    pictures[index].like = !pictures[index].like;
    if (pictures[index].like) {
      Taro.showToast({
        title: "点赞成功",
        icon: "success",
      });
      pictures[index].like_count++;
      setPicture({
        ...pictures[index],
      });
    } else {
      Taro.showToast({
        title: "取消点赞成功",
        icon: "none",
      });
      pictures[index].like_count--;
      setPicture({
        ...pictures[index],
      });
    }
    await likePicture(pictures[index].id);
  };
  const downloadImage = async (url: string) => {
    Taro.showLoading({
      title: "下载中",
    });
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
        });
      });
    } else {
      Taro.showToast({
        title: "下载失败",
        icon: "none",
      });
      return "";
    }
    Taro.hideLoading();
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
      let result;
      let newPictures;
      if (tag != "undefined") {
        result = await getPicturesByTag(
          tag,
          defaultOffset == index ? Math.max(defaultOffset + limit) : limit,
          offset,
          true
        );
        setTotal(result.total);
        newPictures = [...pictures, ...result.data];
      } else if (collection_id !== "undefined") {
        result = await getCollectionPictures(Number(collection_id));
        setTotal(result.length);
        newPictures = result;
      } else if (favorite) {
        result = await getFavoritePictures(
          defaultOffset == index ? Math.max(defaultOffset + limit) : limit,
          offset,
          true
        );
        setTotal(result.total);
        newPictures = result.data;
      }
      setPictures(newPictures);
      setPicture(newPictures[index]);
    })();
  }, [offset]);
  useEffect(() => {
    if (toolbarHidden) {
      animation.translateY(100).step();
      setAnimationData(animation.export());
      animationIndicator.translateY(60).step();
      setAnimationDataIndicator(animationIndicator.export());
    } else {
      animation.translateY(0).step();
      setAnimationData(animation.export());
      animationIndicator.translateY(0).step();
      setAnimationDataIndicator(animationIndicator.export());
    }
  }, [toolbarHidden]);
  const formatCount = (count: number) => {
    if (count > 100) {
      return "99+";
    }
    return count;
  };
  return (
    <View>
      <Swiper
        value={index}
        onChange={(v) => {
          if (pictures.length == v + 1 && v == index + 1) {
            if (offset + v + 1 < total) {
              setOffset(offset + v + 1);
            } else {
              Taro.showToast({
                title: "已经是最后一张了",
                icon: "none",
                duration: 2000,
              });
            }
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
          {index + 1} / {total}
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
                  color={picture?.favorite ? "red" : "white"}
                  size={20}
                />
                <Text>{`收藏(${formatCount(
                  picture?.favorite_count ?? 0
                )})`}</Text>
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
                  color={picture?.like ? "red" : "white"}
                  size={20}
                />
                <Text>{`点赞(${formatCount(picture?.like_count ?? 0)})`}</Text>
              </View>
            </Flex.Item>
            <Flex.Item>
              <View onClick={() => setOpen(true)} className="action-item">
                <LabelOutlined size={20} />
                <Text>简介</Text>
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
      <Popup
        open={open}
        placement="left"
        onClose={() => setOpen(false)}
        className="description"
        rounded
      >
        {picture?.description}
      </Popup>
    </View>
  );
}
