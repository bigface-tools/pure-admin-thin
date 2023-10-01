<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-01 19:48:15
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-01 19:48:42
 * @FilePath: \pure-admin-thin\src\views\map\材质特效\雷达扫描.vue
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
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: false //是否显示全屏按钮工具
      });

      let rotation = 0; //纹理旋转角度
      const amount = 4; //旋转变化量

      const rader = {
        position: Cesium.Cartesian3.fromDegrees(114.40372, 30.52252),
        ellipse: {
          semiMajorAxis: 300.0,
          semiMinorAxis: 300.0,
          //指定材质
          material: new Cesium.ImageMaterialProperty({
            image: prePath + "RasterImage/图片/color.png",
            color: new Cesium.Color(1.0, 0.0, 0.0, 0.7)
          }),

          // 不设置高度则无法渲染外框线
          height: 0.0,
          //heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,

          //外边框
          outline: true,
          outlineWidth: 2,
          outlineColor: new Cesium.Color(1.0, 1.0, 0.0, 1.0),

          //纹理旋转角度通过CallbackProperty回调
          stRotation: new Cesium.CallbackProperty(function () {
            rotation += amount;
            if (rotation >= 360 || rotation <= -360) {
              rotation = 0;
            }
            //度数转弧度
            return Cesium.Math.toRadians(rotation);
          }, false)
        }
      };

      //将rader添加进entity集合
      viewer.entities.add(rader);

      viewer.entities.add({
        position: Cesium.Cartesian3.fromDegrees(114.40372, 30.52252),
        point: {
          pixelSize: 10,
          color: Cesium.Color.RED,
          heightReference: Cesium.HeightReference.CLAMP_TO_GROUND
        }
      });
      viewer.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.40372, 30.52252, 2000)
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
