/*
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-09-30 14:54:47
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-01 16:54:15
 * @FilePath: \pure-admin-thin\src\router\modules\management.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default {
  path: "/map",
  redirect: "/map/cluster",
  meta: {
    icon: "informationLine",
    title: "地图",
    // showLink: false,
    rank: 9
  },
  children: [
    {
      path: "/map/cluster",
      name: "mapCluster",
      component: () => import("@/views/map/cluster.vue"),
      meta: {
        title: "聚合图层"
      }
    },
    {
      path: "/map/visible",
      name: "mapVisible",
      component: () => import("@/views/map/工具应用/可视域分析.vue"),
      meta: {
        title: "可视域分析"
      }
    },
    {
      path: "/map/electronicFence",
      name: "mapElectronicFence",
      component: () => import("@/views/map/材质特效/电子围栏.vue"),
      meta: {
        title: "电子围栏"
      }
    },
    {
      path: "/map/weather",
      name: "mapWeather",
      component: () => import("@/views/map/材质特效/粒子天气.vue"),
      meta: {
        title: "粒子天气"
      }
    },
    {
      path: "/map/fireworks",
      name: "mapFireworks",
      component: () => import("@/views/map/材质特效/粒子烟花.vue"),
      meta: {
        title: "粒子烟花"
      }
    },
    {
      path: "/map/dynamicLine",
      name: "dynamicLine",
      component: () => import("@/views/map/材质特效/流动线.vue"),
      meta: {
        title: "流动线"
      }
    }
  ]
} as RouteConfigsTable;
