export default defineAppConfig({
  pages: ["pages/home/home", "pages/collection/collection", "pages/user/user"],
  subPackages: [
    {
      root: "pages/subpages",
      pages: ["search/search", "search-result/search-result", "image/image"],
    },
  ],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#6190E8",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "white",
  },
  lazyCodeLoading: "requiredComponents",
  tabBar: {
    borderStyle: "white",
    selectedColor: "#6190E8",
    color: "#333333",
    list: [
      {
        text: "首页",
        pagePath: "pages/home/home",
        iconPath: "assets/tabbar/home.png",
        selectedIconPath: "assets/tabbar/home-active.png",
      },
      {
        text: "图集",
        pagePath: "pages/collection/collection",
        iconPath: "assets/tabbar/collection.png",
        selectedIconPath: "assets/tabbar/collection-active.png",
      },
      {
        text: "我的",
        pagePath: "pages/user/user",
        iconPath: "assets/tabbar/user.png",
        selectedIconPath: "assets/tabbar/user-active.png",
      },
    ],
  },
});
