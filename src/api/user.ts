import Taro, { request } from "@tarojs/taro";
import { API_URL } from "../constants";
import { getHeaders } from "../interceptor";

const BASE_URL = API_URL + "/user";

export async function getUser() {
  let { data } = await request({
    url: BASE_URL,
    method: "GET",
  });
  return data;
}

export async function updateUserAvatar(
  avatar: string
): Promise<UserType | ErrorType> {
  let { data } = await Taro.uploadFile({
    url: BASE_URL + "/avatar",
    filePath: avatar,
    name: "avatar",
    header: await getHeaders({}),
  });
  return JSON.parse(data);
}

export async function updateUser(body): Promise<UserType | ErrorType> {
  let { data } = await request({
    url: BASE_URL,
    method: "PUT",
    data: body,
  });
  return data;
}
