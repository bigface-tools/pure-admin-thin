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

      //定义聚和标签样式
      const pinBuilder = new Cesium.PinBuilder();
      //fromText中三个参数分别为 label内容、颜色、大小
      const pin100 = pinBuilder
        .fromText("100+", Cesium.Color.RED, 70)
        .toDataURL();
      const pin70 = pinBuilder
        .fromText("70+", Cesium.Color.GOLD, 65)
        .toDataURL();
      const pin50 = pinBuilder
        .fromText("50+", Cesium.Color.BLUE, 60)
        .toDataURL();
      const pin40 = pinBuilder
        .fromText("40+", Cesium.Color.GREEN, 55)
        .toDataURL();
      const pin30 = pinBuilder
        .fromText("30+", Cesium.Color.YELLOW, 50)
        .toDataURL();
      const pin20 = pinBuilder
        .fromText("20+", Cesium.Color.CYAN, 45)
        .toDataURL();
      const pin10 = pinBuilder
        .fromText("10+", Cesium.Color.AQUA, 40)
        .toDataURL();
      const singleDigitPins = new Array(9);
      for (let i = 0; i < singleDigitPins.length; ++i) {
        singleDigitPins[i] = pinBuilder
          .fromText("" + (i + 2), Cesium.Color.VIOLET, 40)
          .toDataURL();
      }

      //加载点数据
      const kmlDataSourcePromise = viewer.dataSources.add(
        Cesium.KmlDataSource.load(prePath + "kml/facilities/facilities.kml")
      );

      kmlDataSourcePromise.then(function (dataSource) {
        dataSource.clustering.enabled = true;
        dataSource.clustering.minimumClusterSize = 2;

        //添加事件监听
        dataSource.clustering.clusterEvent.addEventListener(function (
          clusteredEntities,
          cluster
        ) {
          cluster.label.show = false;
          cluster.billboard.show = true;
          cluster.billboard.id = cluster.label.id;
          cluster.billboard.verticalOrigin = Cesium.VerticalOrigin.BOTTOM;
          if (clusteredEntities.length >= 100) {
            cluster.billboard.image = pin100;
          } else if (clusteredEntities.length >= 70) {
            cluster.billboard.image = pin70;
          } else if (clusteredEntities.length >= 50) {
            cluster.billboard.image = pin50;
          } else if (clusteredEntities.length >= 40) {
            cluster.billboard.image = pin40;
          } else if (clusteredEntities.length >= 30) {
            cluster.billboard.image = pin30;
          } else if (clusteredEntities.length >= 20) {
            cluster.billboard.image = pin20;
          } else if (clusteredEntities.length >= 10) {
            cluster.billboard.image = pin10;
          } else {
            cluster.billboard.image =
              singleDigitPins[clusteredEntities.length - 2];
          }
        });

        /* afterAddDataSource(dataSource); */
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
