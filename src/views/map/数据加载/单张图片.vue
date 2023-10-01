<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-01 20:03:40
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-01 20:31:27
 * @FilePath: \pure-admin-thin\src\views\map\数据加载\单张图片.vue
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
      // 设置地图层级和中心点

      const worldTerrain = Cesium.createWorldTerrain({
        requestWaterMask: true,
        requestVertexNormals: true
      });
      viewer = new Cesium.Viewer("cesiumContainer", {
        terrainProvider: worldTerrain,
        baseLayerPicker: false, //图层选择控件
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: false //是否显示全屏按钮工具
      });
      /*    const center = Cesium.Cartesian3.fromDegrees(106.557165, 29.570997, 1000); // 重庆的经纬度及高度
      viewer.scene.camera.setView({
        destination: center,
        orientation: {
          heading: Cesium.Math.toRadians(0),
          pitch: Cesium.Math.toRadians(-90),
          roll: 0.0
        } 
      });*/
      //左下角坐标，右上角坐标
      const rectangle = Cesium.Rectangle.fromDegrees(
        106.557165,
        29.570997,
        106.567165,
        29.576997
      );
      viewer.imageryLayers.addImageryProvider(
        new Cesium.SingleTileImageryProvider({
          url: prePath + "重庆.png",
          rectangle: rectangle
        })
      );
      viewer.camera.setView({
        destination: Cesium.Rectangle.fromDegrees(
          106.5165,
          29.510997,
          106.597165,
          29.596997
        )
      });
    });
  }
};
</script>

<style scoped>
.cesium-map {
  height: calc(100vh - 100px);
}
</style>
