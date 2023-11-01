export const routes = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/register/Register.vue"),
  },
  {
    path: "/forgot",
    name: "Forgot",
    component: () => import("@/views/forgot/Forgot.vue"),
  },
  {
    path: "/main",
    name: "Main",
    component: () => import("@/views/main/index.vue"),
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/main/home/Home.vue"),
        meta: { name: "首页" },
      },
      {
        path: "/search",
        name: "Search",
        component: () => import("@/views/main/search/index.vue"),
        meta: { name: "商品搜索" },
      },
      {
        path: "/category/:type_id?",
        name: "Category",
        component: () => import("@/views/main/category/Category.vue"),
        meta: { name: "商品搜索" },
      },
      {
        path: "/detail2",
        name: "Detail2",
        component: () => import("@/views/main/detail/Detail2.vue"),
        meta: { name: "商品详情-官方" },
      },
      {
        path: "/detail",
        name: "Detail",
        component: () => import("@/views/main/detail/Detail.vue"),
        meta: { name: "商品详情-私人" },
      },
      {
        path: "/cart",
        name: "Cart",
        component: () => import("@/views/main/cart/Cart.vue"),
        meta: { name: "我的购物车" },
      },
      {
        path: "/personal",
        name: "Personal",
        component: () => import("@/views/main/personal/Personal.vue"),
        meta: { name: "个人中心" },
      },
      {
        path: "/order",
        name: "Order",
        component: () => import("@/views/main/order/Order.vue"),
        meta: { name: "订单提交" },
        // beforeEnter: (to, from, next) => {
        //   from.name === "Pay" ? next({ name: "Cart" }) : next();
        // },
      },
      {
        path: "/orderDetail",
        name: "OrderDetail",
        component: () => import("@/views/main/order/OrderDetail.vue"),
        meta: { name: "订单详情" },
      },
      {
        path: "/pay",
        name: "Pay",
        component: () => import("@/views/main/pay/Pay.vue"),
        meta: { name: "支付界面" },
      },
      {
        path: "/paySuccess",
        name: "PaySuccess",
        component: () => import("@/views/main/pay/PaySuccess.vue"),
        meta: { name: "收银" },
      },
      {
        path: "/talk",
        name: "Talk",
        component: () => import("@/views/main/talk/index.vue"),
        meta: { name: "嗨聊" },
      },
      {
        path: "/comment",
        name: "Comment",
        component: () => import("@/views/main/comment/Comment.vue"),
        meta: { name: "商品评价" },
      },
    ],
  },
  {
    path: "*",
    name: "404",
    component: () => import("@/views/404/index.vue"),
  },
  {
    path: "/",
    redirect: "home",
    component: () => import("@/views/login/Login.vue"),
  },
];
