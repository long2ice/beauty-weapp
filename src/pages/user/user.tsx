import { View, Text } from "@tarojs/components";
import "./user.css";
import Layout from "../../components/layout";

export default function User() {
  return (
    <Layout title="我的" navbar={<View />}>
      <View className="main">
        <Text>User</Text>
      </View>
    </Layout>
  );
}
