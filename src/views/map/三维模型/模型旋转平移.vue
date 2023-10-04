<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-03 21:03:13
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-04 15:26:10
 * @FilePath: \pure-admin-thin\src\views\map\三维模型\单体化.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="cesium-map" id="cesiumContainer">
    <div class="adjust3DTilesDiv">
      <label style="color: white">X轴旋转</label> <br />
      <input
        type="range"
        min="-100"
        max="100"
        step="1"
        @input="rotation"
        id="Rx"
        value="0"
      />
      <input
        type="text"
        style="width: 70px"
        id="RxValue"
        value="0"
        @change="rotationX"
      />
      <br />
      <label style="color: white">Y轴旋转</label> <br />
      <input
        type="range"
        min="-100"
        max="100"
        step="1"
        @input="rotation"
        id="Ry"
        value="0"
      />
      <input
        type="text"
        style="width: 70px"
        id="RyValue"
        value="0"
        @change="rotationY"
      />
      <br />
      <label style="color: white">Z轴旋转</label> <br />
      <input
        type="range"
        min="-100"
        max="100"
        step="1"
        @input="rotation"
        id="Rz"
        value="0"
      />
      <input
        type="text"
        style="width: 70px"
        id="RzValue"
        value="0"
        @change="rotationZ"
      />
      <br />

      <label style="color: white">经度平移</label> <br />
      <input
        type="range"
        min="-100"
        max="100"
        step="1"
        @input="translation"
        id="Tlon"
        value="0"
      />
      <input
        type="text"
        style="width: 70px"
        id="TlonValue"
        value="0"
        @change="translationLon"
      />
      <br />
      <label style="color: white">纬度平移</label> <br />
      <input
        type="range"
        min="-100"
        max="100"
        step="1"
        @input="translation"
        id="Tlat"
        value="0"
      />
      <input
        type="text"
        style="width: 70px"
        id="TlatValue"
        value="0"
        @change="translationLat"
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
    let tileset = null;
    let viewer = null;
    let params;
    let cartographic;
    onMounted(() => {
      viewer = new Cesium.Viewer("cesiumContainer", {
        geocoder: true, //是否显示地名查找工具
        homeButton: true, //是否显示首页位置工具
        sceneModePicker: true, //是否显示视角模式切换工具
        baseLayerPicker: true, //是否显示默认图层选择工具
        navigationHelpButton: true, //是否显示导航帮助工具
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: true //是否显示全屏按钮工具
        //terrainProvider: Cesium.createWorldTerrain()
      });

      tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: prePath + "倾斜摄影/大雁塔3DTiles/tileset.json"
        })
      );

      viewer.zoomTo(tileset);

      tileset.readyPromise.then(function () {
        cartographic = Cesium.Cartographic.fromCartesian(
          tileset.boundingSphere.center //倾斜摄影模型外包围球中心
        );
        console.log("cartographic", cartographic);

        params = {
          tx: Cesium.Math.toDegrees(cartographic.longitude), //模型中心X轴坐标（经度，单位：十进制度）
          ty: Cesium.Math.toDegrees(cartographic.latitude), //模型中心Y轴坐标（纬度，单位：十进制度）
          tz: 0, //模型中心Z轴坐标（高程，单位：米）
          rx: 0, //X轴（经度）方向旋转角度（单位：度）
          ry: 0, //Y轴（纬度）方向旋转角度（单位：度）
          rz: 0 //Z轴（高程）方向旋转角度（单位：度）
        };
      });
    });
    //平移旋转函数
    function update3dtilesMaxtrix(params) {
      //旋转
      const mx = Cesium.Matrix3.fromRotationX(Cesium.Math.toRadians(params.rx));
      const my = Cesium.Matrix3.fromRotationY(Cesium.Math.toRadians(params.ry));
      const mz = Cesium.Matrix3.fromRotationZ(Cesium.Math.toRadians(params.rz));
      const rotationX = Cesium.Matrix4.fromRotationTranslation(mx);
      const rotationY = Cesium.Matrix4.fromRotationTranslation(my);
      const rotationZ = Cesium.Matrix4.fromRotationTranslation(mz);

      //平移
      const position = Cesium.Cartesian3.fromDegrees(
        params.tx,
        params.ty,
        params.tz
      );
      console.log("position", position);
      const m = Cesium.Transforms.eastNorthUpToFixedFrame(position);

      //旋转、平移矩阵相乘
      Cesium.Matrix4.multiply(m, rotationX, m);
      Cesium.Matrix4.multiply(m, rotationY, m);
      Cesium.Matrix4.multiply(m, rotationZ, m);
      //返回结果矩阵
      return m;
    }

    //Rx、Ry、Rz旋转滑动条
    function rotation() {
      //拿到x轴旋转滑动条当前值
      const rx = Number(Rx.value);
      //x轴旋转文本框显示当前值
      RxValue.value = rx;

      //拿到y轴旋转滑动条当前值
      const ry = Number(Ry.value);
      //x轴旋转文本框显示当前值
      RyValue.value = ry;

      //拿到z轴旋转滑动条当前值
      const rz = Number(Rz.value);
      //x轴旋转文本框显示当前值
      RzValue.value = rz;

      //判断是否为数字，不是数字则return
      if (isNaN(rx) && isNaN(ry) && isNaN(rz)) {
        return;
      }
      params.rx = rx;
      params.ry = ry;
      params.rz = rz;
      tileset._root.transform = update3dtilesMaxtrix(params);
    }
    //X轴文本框
    function rotationX() {
      const rx = Number(RxValue.value);
      Rx.value = rx;
      rotation();
    }
    //Y轴文本框
    function rotationY() {
      const ry = Number(RyValue.value);
      Ry.value = ry;
      rotation();
    }
    //Z轴文本框
    function rotationZ() {
      const rz = Number(RzValue.value);
      Rz.value = rz;
      rotation();
    }

    //平移滑动条
    function translation() {
      //拿到经度平移滑动条当前值
      const tLon = Number(Tlon.value);
      //经度平移文本框显示当前值
      TlonValue.value = tLon;

      //拿到纬度平移滑动条当前值
      const tLat = Number(Tlat.value);
      //纬度平移文本框显示当前值
      TlatValue.value = tLat;

      //判断是否为数字，不是数字则return
      if (isNaN(tLon) && isNaN(tLat)) {
        return;
      }
      params.tx = Cesium.Math.toDegrees(cartographic.longitude) + tLon / 500;
      params.ty = Cesium.Math.toDegrees(cartographic.latitude) + tLat / 500;
      tileset._root.transform = update3dtilesMaxtrix(params);
    }
    //经度文本框
    function translationLon() {
      const tLon = Number(TlonValue.value);
      Tlon.value = tLon;

      translation();
    }
    //纬度文本框
    function translationLat() {
      const tLat = Number(TlatValue.value);
      Tlat.value = tLat;

      translation();
    }
    return {
      translation,
      translationLon,
      translationLat,
      rotationX,
      rotationY,
      rotationZ,
      rotation
    };
  }
};
</script>

<style scoped>
.cesium-map {
  height: calc(100vh - 100px);
}
</style>
