<template>
  <div class="cesium-map">
    <div class="cesium-map" id="cesiumContainer" />
    <div class="toolbar">
      <button @click="add">添加可视域</button>
      <button @click="remove">删除可视域</button>
    </div>
  </div>
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
    // 分析参数
    const viewModel = { verticalAngle: 90, horizontalAngle: 120 };
    //存储分析结果
    let arrViewField = [];
    onMounted(() => {
      viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: false, //是否显示全屏按钮工具
        terrainProvider: Cesium.createWorldTerrain()
      });

      /* viewer.scene.globe.enableLighting = true;

		viewer.shadows = true; */

      //开启深度检测后 会有高程遮挡效果
      viewer.scene.globe.depthTestAgainstTerrain = true;
      const tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: "./src/assets/map/倾斜摄影/大雁塔3DTiles/tileset.json"
        })
      );
      viewer.zoomTo(tileset);
    });
    // 添加可视域
    const add = () => {
      const viewshed = new Cesium.ViewShed3D(viewer, {
        horizontalAngle: Number(viewModel.horizontalAngle),
        verticalAngle: Number(viewModel.verticalAngle)
        /*distance: Number(viewModel.distance),
				calback: function () {
					viewModel.distance = viewshed.distance;
					console.log('viewModel.distance',viewModel.distance);
				} */
      });
      arrViewField.push(viewshed);
    };
    const remove = () => {
      for (let i = 0; i < arrViewField.length; i++) {
        arrViewField[i].destroy();
      }
      arrViewField = [];
    };
    return {
      viewer,
      add,
      remove
    };
  }
};
</script>

<style scoped>
.cesium-map {
  height: calc(100vh - 100px);
}

.toolbar {
  position: absolute;
  top: 20px;
  left: 40px;
}
</style>
