/*
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-09-30 14:54:47
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-06 11:06:02
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
    },
    {
      path: "/map/singleModel",
      name: "mapSingleModel",
      component: () => import("@/views/map/三维模型/模型单体化.vue"),
      meta: {
        title: "模型单体化"
      }
    },
    {
      path: "/map/translate",
      name: "mapTranslate",
      component: () => import("@/views/map/三维模型/模型旋转平移.vue"),
      meta: {
        title: "模型旋转平移"
      }
    },
    {
      path: "/map/zoom",
      name: "mapZoom",
      component: () => import("@/views/map/三维模型/模型缩放.vue"),
      meta: {
        title: "模型缩放"
      }
    },
    {
      path: "/map/modelHight",
      name: "mapModelHight",
      component: () => import("@/views/map/三维模型/模型高度调整.vue"),
      meta: {
        title: "模型高度调整"
      }
    },
    {
      path: "/map/featurePick",
      name: "mapFeaturePick",
      component: () => import("@/views/map/三维模型/模型要素拾取.vue"),
      meta: {
        title: "模型要素拾取"
      }
    },
    {
      path: "/map/feature",
      name: "mapFeature",
      component: () => import("@/views/map/三维模型/要素风格.vue"),
      meta: {
        title: "要素风格"
      }
    },
    {
      path: "/map/carMove",
      name: "mapCarMove",
      component: () => import("@/views/map/三维模型/小车移动.vue"),
      meta: {
        title: "小车移动"
      }
    },
    {
      path: "/map/modelColor",
      name: "mapModelColor",
      component: () => import("@/views/map/三维模型/模型着色.vue"),
      meta: {
        title: "模型着色"
      }
    },
    {
      path: "/map/modelfit",
      name: "mapModelfit",
      component: () => import("@/views/map/三维模型/贴合3d模型.vue"),
      meta: {
        title: "贴合3d模型"
      }
    },
    {
      path: "/map/terrainDig",
      name: "mapTerrainDig",
      component: () => import("@/views/map/工具应用/地形开挖.vue"),
      meta: {
        title: "地形开挖"
      }
    }
  ]
} as RouteConfigsTable;
