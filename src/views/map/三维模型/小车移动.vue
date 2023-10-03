<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-03 21:03:13
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-03 21:25:43
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
        timeline: true,
        animation: true
      });
      //#endregion

      const tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: prePath + "倾斜摄影/大雁塔3DTiles/tileset.json"
        })
      );
      viewer.zoomTo(tileset);

      /* const entity2 = viewer.entities.add({
      position:new Cesium.Cartesian3 ( -1715529.0193483282 , 4993383.694752825 , 3566984.256377016 ),
      model: {
        uri: "./3D格式数据/glb/GroundVehicle.glb",
      },
    });
    viewer.zoomTo(entity2); */

      //定义CZML结构
      const czml = [
        {
          id: "document",
          version: "1.0",
          clock: {
            interval: "2022-04-14T15:18:00Z/2022-04-14T15:18:15Z",
            currentTime: "2022-04-14T15:18:00Z"
          }
        },
        {
          id: "CesiumMilkTruck",
          model: {
            gltf:
              prePath + "RasterImage/CZML/CesiumMilkTruck/CesiumMilkTruck.glb"
          },
          position: {
            cartesian: [
              "2022-04-14T15:18:00Z",
              -1715306.5175099864,
              4993455.496718319,
              3566986.1689425386,
              "2022-04-14T15:18:12Z",
              -1715529.0193483282,
              4993383.694752825,
              3566984.256377016,
              "2022-04-14T15:18:15Z",
              -1715541.2997855775,
              4993376.825711799,
              3566988.324779788
            ]
          }
        },
        {
          id: "Polyline",
          polyline: {
            positions: {
              cartesian: [
                -1715306.5175099864, 4993455.496718319, 3566986.1689425386,
                -1715529.0193483282, 4993383.694752825, 3566984.256377016,
                -1715541.2997855775, 4993376.825711799, 3566988.324779788
              ]
            },
            material: {
              polylineOutline: {
                color: {
                  rgba: [125, 255, 128, 255]
                },
                outlineWidth: 0
              }
            },
            width: 5,
            clampToGround: true
          }
        }
      ];

      let entity; //获取小车模型
      let positionProperty; //获取小车位置属性
      //创建CZML实例的Promise
      const dataSourcePromise = Cesium.CzmlDataSource.load(czml);

      viewer.dataSources.add(dataSourcePromise).then(function (dataSource) {
        //获取小车模型
        entity = dataSource.entities.getById("CesiumMilkTruck");
        //设定小车朝向
        entity.orientation = new Cesium.VelocityOrientationProperty(
          entity.position
        ); //设置模型朝向按照指定路线
        //获取小车位置
        positionProperty = entity.position;
      });

      //渲染监听
      function start() {
        //开启动画
        viewer.clock.shouldAnimate = true;
        //渲染监听模型实时位置、高度并贴在3DTiles之上
        viewer.scene.postRender.addEventListener(function () {
          const position = positionProperty.getValue(viewer.clock.currentTime);
          console.log(position);
          entity.position = viewer.scene.clampToHeight(position, [entity]);
          entity.position = position;
        });
        viewer.zoomTo(entity);
      }

      tileset.initialTilesLoaded.addEventListener(start); //3D Tiles渲染完成后调用

      //#endregion
    });
  }
};
</script>

<style scoped>
.cesium-map {
  height: calc(100vh - 100px);
}
</style>
