// 官网首页头部按钮
export const headerBtns = [
  {
    label: "产品",
    pageName: "production",
  },
  {
    label: "发现",
    pageName: "discovery",
  },
  {
    label: "帮助",
    pageName: "help",
  },
  {
    label: "社区",
    pageName: "community",
  },
];

// 官网首页底部按钮
export const footerBtns = [
  {
    label: "产品动态",
    pageName: "dynamic",
  },
  {
    label: "服务协议",
    pageName: "agreement",
  },
  {
    label: "关于我们",
    pageName: "about",
  },
  {
    label: "联系我们",
    pageName: "contact",
  },
];

// 官网首页tab选项（PC端）
export const homeTabs = ["小说/漫画连载", "摄影/设计作品集", "游戏中心", "更多可能，等你探索"];

// 官网首页tab选项（移动端）
export const mobileHomeTabs = ["小说/漫画", "摄影/设计", "游戏", "更多"];

// 官网首页tab选项内容
export const homeTabsContent = [
  {
    desc: "自主版权 • 反盗版支持",
    btns: [
      { label: "小说场景", pageName: "novel" },
      { label: "漫画场景", pageName: "comic" },
    ],
  },
  {
    desc: "版权保护 • 再创作变现",
    btns: [{ label: "场景体验", pageName: "gallery" }],
  },
  {
    desc: "简易操作 • 一站式发行服务",
    btns: [{ label: "场景体验", pageName: "gallery" }],
  },
  {
    desc: "编写个人博客、搭建素材库等",
    btns: [{ label: "马上注册", pageName: "register" }],
  },
];

// 官网首页场景底图
export const senariosImages = [
  { className: "green-matrix", url: require("../assets/image/green-matrix.png"), animation: "slide-left-bottom" },
  { className: "blue-circle", url: require("../assets/image/blue-circle.png"), animation: "slide-left-bottom" },
  { className: "green-circle", url: require("../assets/image/green-circle.png"), animation: "slide-right-top" },
  { className: "blue-matrix", url: require("../assets/image/blue-matrix.png"), animation: "slide-right-top" },
];

// 官网首页介绍列表
export const homeIntroList = [
  {
    title: "「 智能合约 」，高效变现",
    img: "https://image.freelog.com/preview-image/cb74b0d54ac4ebde7c8a8fb5cd322ed7fe70a20a.jpg",
    desc: "根据不同人群创建不同授权策略，实现交易定制化、自动化，满足你的多样变现需求。",
    pageName: "contract",
  },
  {
    title: "「 再创作 」，助力多渠道变现",
    img: "https://image.freelog.com/preview-image/cb74b0d54ac4ebde7c8a8fb5cd322ed7fe70a20a.jpg",
    desc: "资源可被他人签约为素材进行再创作，拓宽资源变现渠道。",
    pageName: "rely",
  },
  {
    title: "节点商运营，轻松获益",
    img: "https://image.freelog.com/preview-image/cb74b0d54ac4ebde7c8a8fb5cd322ed7fe70a20a.jpg",
    desc: "新增节点商角色，专注资源运营，提高变现效率，你可以专注生产优质资源，轻松获益。",
    pageName: "node",
  },
];

// 页面名称
export type pageName =
  | "production"
  | "discovery"
  | "help"
  | "community"
  | "dynamic"
  | "agreement"
  | "about"
  | "contact"
  | "login"
  | "register"
  | "novel"
  | "comic"
  | "gallery"
  | "contract"
  | "rely"
  | "node";

// 页面地址映射
export const pageMappings = {
  production: "",
  discovery: "",
  help: "",
  community: "",
  dynamic: "",
  agreement: "",
  about: "",
  contact: "",
  login: "http://user.testfreelog.com/login",
  register: "http://user.testfreelog.com/logon",
  novel: "http://freelognovel.testfreelog.com",
  comic: "http://freelogcomic.testfreelog.com",
  gallery: "http://freeloggallery.testfreelog.com",
  contract: "https://www.yuque.com/taiyang-4rbf5/vctf9v/isguhs#AlFok",
  rely: "https://www.yuque.com/taiyang-4rbf5/vctf9v/isguhs#AlFok",
  node: "https://www.yuque.com/taiyang-4rbf5/vctf9v/isguhs#WgXtD",
};
