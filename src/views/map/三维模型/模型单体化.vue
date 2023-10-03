<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-03 21:03:13
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-03 21:04:44
 * @FilePath: \pure-admin-thin\src\views\map\三维模型\单体化.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="cesium-map" id="cesiumContainer" />
</template>

<script>
import { prePath } from "@/utils/file.ts";
import { onMounted } from "vue";
import * as Cesium from "cesium";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NGM4MDcxOS05Zjk3LTQ2YmMtYjAxYi0zYTczNWFkYzFlN2EiLCJpZCI6NzY0NTcsImlhdCI6MTYzOTQ2ODI2NH0.Zsp28WnnCpj4wlAIQwIwcSob228zSaz510QE3zKQN58";
export default {
  name: "CesiumMap",
  setup() {
    let viewer = null;

    onMounted(() => {
      viewer = new Cesium.Viewer("cesiumContainer", {
        geocoder: true, //是否显示地名查找工具
        homeButton: true, //是否显示首页位置工具
        sceneModePicker: true, //是否显示视角模式切换工具
        baseLayerPicker: false, //是否显示默认图层选择工具
        navigationHelpButton: true, //是否显示导航帮助工具
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: true, //是否显示全屏按钮工具
        terrainProvider: Cesium.createWorldTerrain()
      });

      viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度监测

      const tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: prePath + "倾斜摄影/大雁塔3DTiles/tileset.json"
        })
      );

      viewer.zoomTo(tileset);

      //加载分类瓦片
      const classifytileset = new Cesium.Cesium3DTileset({
        url: prePath + "RasterImage/单体化切片/tileset.json",
        classificationType: Cesium.ClassificationType.CESIUM_3D_TILE
      });
      //设置分类瓦片透明度
      classifytileset.style = new Cesium.Cesium3DTileStyle({
        color: "rgba(255, 255, 255,0.01)"
      });
      viewer.scene.primitives.add(classifytileset);

      const highlighted = {
        feature: undefined,
        originalColor: new Cesium.Color()
      };

      //鼠标移动
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function onMouseMove(movement) {
        if (Cesium.defined(highlighted.feature)) {
          highlighted.feature.color = highlighted.originalColor;
          highlighted.feature = undefined;
        }

        // 拾取新要素
        const pickedFeature = viewer.scene.pick(movement.endPosition);
        if (!Cesium.defined(pickedFeature)) {
          return;
        }

        // 高亮显示
        highlighted.feature = pickedFeature;
        Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
        pickedFeature.color = Cesium.Color.LIME.withAlpha(0.5);
      }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);
    });
  }
};
</script>

<style scoped>
.cesium-map {
  height: calc(100vh - 100px);
}
</style>
