<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-03 21:03:13
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-03 22:00:18
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
        infoBox: false,
        selectionIndicator: false,
        shadows: true,
        animation: false,
        shouldAnimate: true
      });
      //开启深度检测
      viewer.scene.globe.depthTestAgainstTerrain = true;
      //定义变量
      const longitude = 114.40074;
      const latitude = 30.51978;
      const range = 0.0001;
      const duration = 8.0;
      const cartographic = new Cesium.Cartographic();

      //添加模型
      const entity = viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(longitude, latitude),
        model: {
          uri: prePath + "3D格式数据/glb/GroundVehicle.glb"
        }
      });
      //定位过去
      viewer.zoomTo(entity);

      //添加点和label标签
      const point = viewer.entities.add({
        position: new Cesium.CallbackProperty(updatePosition, false),
        point: {
          pixelSize: 10,
          color: Cesium.Color.YELLOW,
          disableDepthTestDistance: Number.POSITIVE_INFINITY //正无穷大,设置到达距地面多少米后禁用深度测试
        },
        label: {
          showBackground: true,
          font: "18px monospace",
          horizontalOrigin: Cesium.HorizontalOrigin.LEFT,
          verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
          pixelOffset: new Cesium.Cartesian2(5, 5)
        }
      });

      function updatePosition(time) {
        const offset = (time.secondsOfDay % duration) / duration;
        cartographic.longitude = Cesium.Math.toRadians(
          longitude - range + offset * range * 2.0
        );
        cartographic.latitude = Cesium.Math.toRadians(latitude);
        let height;
        if (viewer.scene.sampleHeightSupported) {
          height = viewer.scene.sampleHeight(cartographic);
        }
        if (Cesium.defined(height)) {
          cartographic.height = height;
          point.label.text = `${Math.abs(height).toFixed(2).toString()} m`;
          point.label.show = true;
        } else {
          cartographic.height = 0.0;
          point.label.show = false;
        }
        return Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          cartographic.height
        );
      }
    });
  }
};
</script>

<style scoped>
.cesium-map {
  height: calc(100vh - 100px);
}
</style>
