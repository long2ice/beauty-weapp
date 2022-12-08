import { ScrollView, Text, View } from "@tarojs/components";
import Layout from "../../components/layout";
import { useEffect, useState } from "react";
import * as storage from "../../storages/user";
import { Avatar, Cell, Divider, Flex, Input } from "@taroify/core";
import { Arrow, CommentOutlined, InfoOutlined } from "@taroify/icons";
import OpenButton from "../../components/button";
import { updateUser, updateUserAvatar } from "../../api/user";
import Taro, { navigateTo } from "@tarojs/taro";
import ClickImage from "../../components/image";
import { getFavoritePictures } from "../../api/picture";
import * as service from "../../services/user";

import "./user.scss";

export default function User() {
  const [user, setUser] = useState<UserType>();
  const [pictures, setPictures] = useState<Array<Picture>>([]);
  const [total, setTotal] = useState(0);
  const limit = 9;

  const refreshUser = async () => {
    let u = await service.getUser();
    setUser(u);
  };
  const initPage = async () => {
    Taro.showLoading({
      title: "加载中",
    });
    await refreshUser();
    let ret = await getFavoritePictures(limit, 0);
    setTotal(ret.total);
    setPictures(ret.data);
    Taro.hideLoading();
  };
  useEffect(() => {
    (async () => {
      await initPage();
    })();
  }, []);
  Taro.usePullDownRefresh(async () => {
    await initPage();
    Taro.stopPullDownRefresh();
  });
  const onChooseAvatar = async (res) => {
    let user = await updateUserAvatar(res.detail.avatarUrl);
    await storage.setUser(user);
    await refreshUser();
  };
  const onUpdateNickname = async (res) => {
    let user = await updateUser({
      nickname: res.detail.value,
    });
    await storage.setUser(user);
    await refreshUser();
  };
  return (
    <Layout title="我的" navbar={<View />}>
      <View className="main">
        <View className="header">
          <Flex gutter={20} align="center">
            <Flex.Item>
              <OpenButton
                openType="chooseAvatar"
                onChooseAvatar={onChooseAvatar}
              >
                <Avatar src={user?.avatar} size="large" />
              </OpenButton>
            </Flex.Item>
            <Flex.Item>
              <Input
                value={user?.nickname}
                type="nickname"
                onBlur={onUpdateNickname}
                className="nickname"
              />
            </Flex.Item>
          </Flex>
        </View>
        <View className="favorite-container">
          <Flex justify="start" align="center">
            <Flex.Item>
              <Text className="title">{`我的收藏 (${total})`}</Text>
            </Flex.Item>
            <Flex.Item className="action">
              <View
                onClick={async () => {
                  await navigateTo({
                    url: "/pages/subpages/search-result/search-result?favorite=true",
                  });
                }}
              >
                <Text>更多</Text>
                <Arrow />
              </View>
            </Flex.Item>
          </Flex>
          <Divider />
          <ScrollView
            scrollX
            scrollWithAnimation
            enhanced
            showScrollbar={false}
            bounces
          >
            <Flex gutter={6}>
              {pictures.map((picture, index) => (
                <Flex.Item span={8} key={picture.id}>
                  <ClickImage url={picture.url} offset={index} favorite />
                </Flex.Item>
              ))}
            </Flex>
          </ScrollView>
        </View>
        <View className="menu">
          <Cell
            icon={<CommentOutlined />}
            rightIcon={<Arrow />}
            clickable
            title="意见反馈"
            style={{
              borderTopLeftRadius: "10rpx",
              borderTopRightRadius: "10rpx",
            }}
            onClick={async () => {
              await navigateTo({
                url: "/pages/subpages/feedback/feedback",
              });
            }}
          />
          <Cell
            icon={<InfoOutlined />}
            rightIcon={<Arrow />}
            clickable
            title="关于我们"
            onClick={async () => {
              await navigateTo({
                url: "/pages/subpages/about/about",
              });
            }}
            style={{
              borderBottomLeftRadius: "10rpx",
              borderBottomRightRadius: "10rpx",
            }}
          />
        </View>
      </View>
    </Layout>
  );
}
