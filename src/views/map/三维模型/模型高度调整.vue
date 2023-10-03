<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-03 21:03:13
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-03 21:56:46
 * @FilePath: \pure-admin-thin\src\views\map\三维模型\单体化.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="cesium-map" id="cesiumContainer">
    <div class="heightAdjustDiv">
      <label style="color: white">高度</label> <br />
      <input
        type="range"
        min="-100"
        max="100"
        step="1"
        @input="change"
        id="R"
        value="0"
      />
      <input
        type="text"
        style="width: 70px"
        id="heightValue"
        value="0"
        @change="change2"
      />
    </div>
  </div>
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

      viewer.scene.globe.depthTestAgainstTerrain = true;

      const tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: prePath + "倾斜摄影/大雁塔3DTiles/tileset.json"
        })
      );

      viewer.zoomTo(tileset);

      const R = document.getElementById("R");

      //当滑动条变化时调用该函数
      function change() {
        //拿到滑动条当前值
        const height = Number(R.value);
        //文本框显示当前值
        heightValue.value = height;

        //判断是否为数字，不是数字则return
        if (isNaN(height)) {
          return;
        }

        //将3D Tiles外包围球中心点从笛卡尔空间直角坐标转换为弧度表示
        const cartographic = Cesium.Cartographic.fromCartesian(
          tileset.boundingSphere.center //3D Tiles外包围球中心
        );

        //3D Tiles外包围球中心点原始坐标
        const surface = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude
        );

        //3D Tiles外包围球中心点坐标偏移
        const offset = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          height
        );

        //计算两个笛卡尔分量的差异
        const translation = Cesium.Cartesian3.subtract(
          offset,
          surface,
          new Cesium.Cartesian3()
        );

        //创建一个表示转换的Matrix4
        tileset.modelMatrix = Cesium.Matrix4.fromTranslation(translation);
      }

      change2 = () => {
        const height = Number(heightValue.value);
        R.value = height;
        change();
      };
      return {
        change2
      };
    });
  }
};
</script>

<style scoped>
.cesium-map {
  height: calc(100vh - 100px);
}
</style>
