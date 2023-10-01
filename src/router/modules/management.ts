/*
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-09-30 14:54:47
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-09-30 17:13:02
 * @FilePath: \pure-admin-thin\src\router\modules\management.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  path: "/org",
  redirect: "/org/home",
  meta: {
    icon: "informationLine",
    title: "异常页面",
    // showLink: false,
    rank: 9
  },
  children: [
    {
      path: "/org/home",
      name: "403",
      component: () => import("@/views/org/index.vue"),
      meta: {
        title: "403"
      }
    }
  ]
} as RouteConfigsTable;
