<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-03 21:03:13
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-03 21:59:34
 * @FilePath: \pure-admin-thin\src\views\map\三维模型\单体化.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="cesium-map" id="cesiumContainer">
    <div class="toolbar">
      <select id="dropdown" @change="change">
        <option value="0">null</option>
        <option value="1">按建筑类型设置颜色</option>
        <option value="2">按到指定位置的距离选择颜色</option>
        <option value="3">交互渲染</option>
        <option value="4">building属性为dormitory</option>
        <option value="5">building属性为apartments</option>
      </select>
    </div>
  </div>
</template>

<script>
// import { prePath } from "@/utils/file.ts";
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
        /* terrainProvider: Cesium.createWorldTerrain(), */
        timeline: false,
        animation: false,
        vrButton: true,
        sceneModePicker: false,
        infoBox: true,
        scene3DOnly: false
      });

      //添加OSM建筑白膜数据
      const osmBuildingsTileset = Cesium.createOsmBuildings();
      viewer.scene.primitives.add(osmBuildingsTileset);
      //调整相机视角
      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.39564, 30.52214, 2000)
        //destination:Cesium.Cartesian3.fromDegrees(-74.0012351579127,40.715093849131,1000),
      });

      //按建筑类型渲染
      function colorByBuildingType() {
        const osmBuildingsStyle = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: [
              ["${building} === 'university'", "color('skyblue', 0.8)"],
              ["${building} === 'dormitory'", "color('cyan', 0.9)"],
              ["${building} === 'yes'", "color('purple', 0.7)"]
            ]
          }
        });
        osmBuildingsTileset.style = osmBuildingsStyle;
      }

      //按建筑类型显示
      function showByBuildingType(buildingType) {
        switch (buildingType) {
          case "dormitory":
            osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
              show: "${building} === 'dormitory'"
            });
            break;
          case "apartments":
            osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
              show: "${building} === 'apartments'"
            });
            break;
          default:
            break;
        }
      }

      //按到指定位置的距离分级渲染
      function colorByDistanceToCoordinate(pickedLongitude, pickedLatitude) {
        const osmBuildingsStyle = new Cesium.Cesium3DTileStyle({
          defines: {
            //自定义字段
            distance:
              "distance(vec2(${feature['cesium#longitude']}, ${feature['cesium#latitude']}), vec2(" +
              pickedLongitude +
              "," +
              pickedLatitude +
              "))"
          },
          color: {
            conditions: [
              ["${distance} > 0.014", "color('blue')"],
              ["${distance} > 0.010", "color('green')"],
              ["${distance} > 0.006", "color('yellow')"],
              ["${distance} > 0.0001", "color('red')"],
              ["true", "color('white')"]
            ]
          }
        });
        osmBuildingsTileset.style = osmBuildingsStyle;
      }

      //获取点击位置坐标
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      function getCoordinate() {
        handler.setInputAction(function (click) {
          const pickedFeature = viewer.scene.pick(click.position);
          const pickedLongitude = parseFloat(
            pickedFeature.getProperty("cesium#longitude")
          );
          const pickedLatitude = parseFloat(
            pickedFeature.getProperty("cesium#latitude")
          );
          /* console.log( typeof pickedLongitude);
				console.log(typeof pickedLatitude); */

          colorByDistanceToCoordinate(pickedLongitude, pickedLatitude);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }

      //交互渲染
      function interactiveRendering(feature) {
        const selected = feature.getProperty("elementId");
        //请注意属性字段的类型 若属性字段为string类型的 则条件要加 ''
        const condition = "${elementId} === " + selected;
        console.log("condition", condition);
        osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({
          color: {
            conditions: [[condition, "color('cyan', 0.9)"]]
          }
        });
      }
      //获取点击要素
      function getFeature() {
        handler.setInputAction(function (evt) {
          const pickedFeature = viewer.scene.pick(evt.position);
          interactiveRendering(pickedFeature);
        }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
      }

      const dropdown = document.getElementById("dropdown");
      const change = () => {
        switch (dropdown.value) {
          case "0":
            osmBuildingsTileset.style = new Cesium.Cesium3DTileStyle({});
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //移除事件
            break;
          case "1":
            colorByBuildingType();
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //移除事件
            break;
          case "2":
            getCoordinate();
            break;
          case "3":
            getFeature();
            break;
          case "4":
            showByBuildingType("dormitory");
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //移除事件
            break;
          case "5":
            /* var osmBuildingsTileset = Cesium.createOsmBuildings();
					viewer.scene.primitives.add(osmBuildingsTileset); */
            showByBuildingType("apartments");
            handler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_CLICK); //移除事件
            break;
        }
      };
      return {
        change
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
