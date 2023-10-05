<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-03 21:03:13
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-05 21:20:01
 * @FilePath: \pure-admin-thin\src\views\map\三维模型\单体化.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="cesium-map" id="cesiumContainer">
    <div class="adjust3DTilesDiv">
      <label style="color: white">缩放倍数</label> <br />
      <input
        type="range"
        min="0.01"
        max="10"
        step="0.01"
        @input="changeScale()"
        id="Scale"
        value="1"
      />
      <input
        type="text"
        style="width: 70px"
        id="scaleValue"
        value="1"
        @change="changeScale2()"
      />
      <br />
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
    let m;
    let mStar;
    let tileset = null;
    onMounted(() => {
      viewer = new Cesium.Viewer("cesiumContainer", {
        geocoder: true, //是否显示地名查找工具
        homeButton: true, //是否显示首页位置工具
        sceneModePicker: true, //是否显示视角模式切换工具
        baseLayerPicker: true, //是否显示默认图层选择工具
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: true //是否显示全屏按钮工具
      });

      //加载三维模型
      tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: prePath + "倾斜摄影/大雁塔3DTiles/tileset.json"
        })
      );
      //定位过去
      viewer.zoomTo(tileset);

      tileset.readyPromise.then(function () {
        //得到外包围盒中心点坐标
        const cartographic = Cesium.Cartographic.fromCartesian(
          tileset.boundingSphere.center
        );
        //坐标变换为Cartesian3类型
        const surface = Cesium.Cartesian3.fromRadians(
          cartographic.longitude,
          cartographic.latitude,
          cartographic.height
        );
        //以提供的原点为中心计算4x4变换矩阵
        m = Cesium.Transforms.eastNorthUpToFixedFrame(surface);
        //记录模型初始转移矩阵，放大缩小以此为基础
        mStar = tileset._root.transform;
      });
    });
    //缩放滑动条
    function changeScale() {
      //缩放
      const scale = Number(Scale.value);
      scaleValue.value = scale;
      if (scale) {
        const _scale = Cesium.Matrix4.fromUniformScale(scale);
        Cesium.Matrix4.multiply(mStar, _scale, m);
        tileset._root.transform = m;
      } else {
        return;
      }
    }

    //缩放值文本框
    const changeScale2 = () => {
      const scale = Number(scaleValue.value);
      Scale.value = scale;
      changeScale();
    };
    return {
      changeScale2,
      changeScale
    };
  }
};
</script>

<style scoped>
.cesium-map {
  height: calc(100vh - 100px);
}
</style>
