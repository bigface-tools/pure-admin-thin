/*
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-09-30 11:14:48
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-09-30 17:12:17
 * @FilePath: \pure-admin-thin\src\router\modules\error.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  path: "/error",
  redirect: "/error/403",
  component: () => import("@/views/error/403.vue"),
  meta: {
    icon: "informationLine",
    title: "异常页面",
    // showLink: false,
    rank: 9
  },
  children: [
    {
      path: "/error/403",
      name: "403",
      component: () => import("@/views/error/403.vue"),
      meta: {
        title: "403"
      }
    },
    {
      path: "/error/404",
      name: "404",
      component: () => import("@/views/error/404.vue"),
      meta: {
        title: "404"
      }
    },
    {
      path: "/error/500",
      name: "500",
      component: () => import("@/views/error/500.vue"),
      meta: {
        title: "500"
      }
    }
  ]
} as RouteConfigsTable;
