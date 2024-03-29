import { View } from "@tarojs/components";
import { Button, Form, Textarea } from "@taroify/core";
import { useState } from "react";
import Taro, { navigateBack } from "@tarojs/taro";
import Layout from "../../../components/layout";
import { AddFeedback } from "../../../api/feedback";

export default function Feedback() {
  const [content, setContent] = useState("");
  const onSubmit = async () => {
    await AddFeedback(content);
    Taro.showToast({
      title: "反馈成功",
      icon: "success",
    });
    setTimeout(async () => {
      await navigateBack();
    }, 2000);
  };
  return (
    <Layout title="反馈">
      <View className="main">
        <Form onSubmit={onSubmit}>
          <Form.Item
            name="username"
            style={{
              borderRadius: "10px",
            }}
            rules={[{ required: true, message: "请填写反馈内容" }]}
          >
            <Form.Control>
              <Textarea
                placeholder="请输入反馈内容"
                value={content}
                limit={200}
                autoHeight
                onChange={(e) => {
                  setContent(e.detail.value);
                }}
              />
            </Form.Control>
          </Form.Item>
          <View style={{ margin: "16px" }}>
            <Button
              shape="round"
              block
              style={{
                backgroundColor: "#6190E8",
                color: "white",
              }}
              formType="submit"
            >
              提交
            </Button>
          </View>
        </Form>
      </View>
    </Layout>
  );
}
