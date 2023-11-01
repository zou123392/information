export const routes = [
  {
    path: "/",
    redirect: "Login",
    component: () => import("@/views/login/Login.vue")
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/Login.vue")
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/register/Register.vue")
  },
  {
    path: "/forgot",
    name: "Forgot",
    component: () => import("@/views/forgot/Forgot.vue")
  },
  {
    path: "/main",
    name: "Main",
    component: () => import("@/views/main/index.vue"),
    children: [
      {
        path: "/posttrade",
        name: "PostTrade",
        component: () => import("@/views/main/posttrade/PostTrade.vue")
      },
      {
        path: "/products",
        name: "Products",
        component: () => import("@/views/main/products/Products.vue")
      },
      {
        path: "/orders",
        name: "Order",
        component: () => import("@/views/main/order/Order.vue")
      },
      {
        path: "/handleOrders",
        name: "HandleOrder",
        component: () => import("@/views/main/order/HandleOrder.vue")
      },
      {
        path: "/user",
        name: "User",
        component: () => import("@/views/main/user/User.vue")
      }
    ]
  },
  {
    path: "*",
    name: "404",
    component: () => import("@/views/404/index.vue")
  }
];
