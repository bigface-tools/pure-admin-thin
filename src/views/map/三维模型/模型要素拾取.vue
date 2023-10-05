<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-03 21:03:13
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-05 17:31:48
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
        baseLayerPicker: true, //是否显示默认图层选择工具
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: false //是否显示全屏按钮工具
      });

      const tileSet = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: prePath + "3D格式数据/Tileset/tileset.json"
        })
      );
      //定位过去
      viewer.zoomTo(tileSet);

      // 创建div
      const newDiv = document.createElement("div");
      viewer.container.appendChild(newDiv);
      newDiv.style.display = "none";
      newDiv.style.position = "absolute";
      newDiv.style.bottom = "0";
      newDiv.style.left = "0";
      newDiv.style.padding = "4px";
      newDiv.style.backgroundColor = "white";

      //创建高亮要素对象
      const highlighted = {
        feature: undefined,
        originalColor: new Cesium.Color()
      };

      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function (event) {
        //捕捉要素
        const pickedFeature = viewer.scene.pick(event.endPosition);
        console.log("pickedFeature", pickedFeature);

        //当未捕捉到要素时隐藏div
        if (!Cesium.defined(pickedFeature)) {
          newDiv.style.display = "none";
          return;
        }
        //否则若捕捉到要素
        else {
          //高亮显示
          if (Cesium.defined(highlighted.feature)) {
            highlighted.feature.color = highlighted.originalColor;
            highlighted.feature = undefined;
          }
          highlighted.feature = pickedFeature;
          Cesium.Color.clone(pickedFeature.color, highlighted.originalColor);
          pickedFeature.color = Cesium.Color.LIME.withAlpha(0.5);

          //提示高度
          newDiv.style.display = "block";
          //加5 是为了不让div遮挡左键点击
          newDiv.style.bottom = `${
            viewer.canvas.clientHeight - event.endPosition.y + 5
          }px`;
          newDiv.style.left = `${event.endPosition.x}px`;
          const name =
            "Height:" + pickedFeature.getProperty("Height").toFixed(2) + "m";
          newDiv.textContent = name;
        }
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
