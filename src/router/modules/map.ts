/*
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-09-30 14:54:47
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-01 20:38:51
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
    },
    {
      path: "/map/dynamicWarter",
      name: "dynamicWarter",
      component: () => import("@/views/map/材质特效/流动水面.vue"),
      meta: {
        title: "流动水面"
      }
    },
    {
      path: "/map/fog",
      name: "mapFog",
      component: () => import("@/views/map/材质特效/雾效果.vue"),
      meta: {
        title: "雾效果"
      }
    },
    {
      path: "/map/radar",
      name: "mapRadar",
      component: () => import("@/views/map/材质特效/雷达扫描.vue"),
      meta: {
        title: "雷达扫描"
      }
    },
    {
      path: "/map/singleImg",
      name: "mapSingleImg",
      component: () => import("@/views/map/数据加载/单张图片.vue"),
      meta: {
        title: "单张图片"
      }
    },
    {
      path: "/map/gaode",
      name: "mapGaode",
      component: () => import("@/views/map/数据加载/高德.vue"),
      meta: {
        title: "高德"
      }
    }
  ]
} as RouteConfigsTable;
