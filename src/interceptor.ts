import Taro, { addInterceptor, checkSession } from "@tarojs/taro";
import { getToken, removeToken } from "./storages/auth";
import * as auth from "./services/auth";
import { getRandomStr, getSign } from "./utils/sign";

export async function getHeaders(data) {
  const token = await getToken();
  let timestamp = new Date().getTime().toString().substring(0, 10);
  let nonce = getRandomStr(8);
  return {
    Authorization: "Bearer " + token,
    "x-timestamp": timestamp,
    "x-nonce": nonce,
    "x-sign": getSign(data, timestamp, nonce),
  };
}

const interceptor = async function (chain) {
  await checkSession().catch(async () => {
    await removeToken();
    await auth.login();
  });
  const requestParams = chain.requestParams;
  const { data } = requestParams;
  requestParams.header = await getHeaders(data);
  return await chain.proceed(requestParams).then(async (res) => {
    switch (res.statusCode) {
      case 200:
        return res;
      case 401:
        await removeToken();
        await auth.login();
        return await chain.proceed(requestParams);
      default:
        await Taro.showToast({
          title: "服务器错误",
          icon: "error",
        });
        return Promise.reject(res.data);
    }
  });
};
addInterceptor(interceptor);
