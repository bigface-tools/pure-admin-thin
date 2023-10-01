<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-01 20:03:40
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-01 20:38:23
 * @FilePath: \pure-admin-thin\src\views\map\数据加载\单张图片.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="cesium-map" id="cesiumContainer" />
</template>

<script>
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
      viewer = new Cesium.Viewer("cesiumContainer", {
        baseLayerPicker: false, //图层选择控件
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: false, //是否显示全屏按钮工具
        //加载高德地图，UrlTemplateImageryProvider接口是加载谷歌地图或者其他互联网地图的接口
        imageryProvider: new Cesium.UrlTemplateImageryProvider({
          url: "https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}"
        })
      });

      //添加高德地图注记
      viewer.imageryLayers.addImageryProvider(
        new Cesium.UrlTemplateImageryProvider({
          url: "http://webst02.is.autonavi.com/appmaptile?x={x}&y={y}&z={z}&lang=zh_cn&size=1&scale=1&style=8"
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
