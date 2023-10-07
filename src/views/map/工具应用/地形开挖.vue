<template>
  <div class="cesium-map">
    <div class="cesium-map" id="cesiumContainer" />
  </div>
</template>

<script>
import { prePath } from "@/utils/file";
import { onMounted } from "vue";
import * as Cesium from "cesium";
Cesium.Ion.defaultAccessToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI2NGM4MDcxOS05Zjk3LTQ2YmMtYjAxYi0zYTczNWFkYzFlN2EiLCJpZCI6NzY0NTcsImlhdCI6MTYzOTQ2ODI2NH0.Zsp28WnnCpj4wlAIQwIwcSob228zSaz510QE3zKQN58";
export default {
  name: "CesiumMap",
  setup() {
    let viewer = null;
    let points = []; //填挖点
    let controls = []; //插值控制点
    let hierarchy = []; //绘制面的坐标点
    let height = null;
    onMounted(() => {
      const terrainModels = Cesium.createWorldTerrain();
      viewer = new Cesium.Viewer("cesiumContainer", {
        terrainProvider: terrainModels,
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: false //是否显示全屏按钮工具
      });
      //#endregion

      //开启深度检测
      viewer.scene.globe.depthTestAgainstTerrain = true;
      //调整相机视角
      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.39564, 30.52214, 2000)
      });

      //实例化ScreenSpaceEventHandler对象
      const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

      //鼠标左键点击选点
      handler.setInputAction(function (event) {
        const earthPosition = viewer.scene.pickPosition(event.position);
        const cartographic = Cesium.Cartographic.fromCartesian(earthPosition);

        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const lng = Cesium.Math.toDegrees(cartographic.longitude);
        //var height = cartographic.height;

        controls.push(Cesium.Cartesian3.fromDegrees(lng, lat)); //添加控制点
        points.push(Cesium.Cartesian3.fromDegrees(lng, lat)); //添加填挖点

        //当控制点大于等于两个的时候进行插值，每次插值最新添加的两个点
        if (controls.length > 1) {
          interpolation(
            controls[controls.length - 2],
            controls[controls.length - 1]
          );
        }

        /*  hierarchy.push(lng);
       hierarchy.push(lat);
       hierarchy.push(height); */
      }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

      //点击右键挖地形、绘制面以及贴纹理
      handler.setInputAction(function () {
        console.log("选择完毕！");

        //全部选择完后对控制点最后一个点和第一个点直接进行插值
        interpolation(controls[controls.length - 1], controls[0]);

        //移除贴图时添加的polygon
        viewer.entities.removeAll();

        //挖地形
        DrawClippingPlane(points);

        //绘制面、贴纹理
        addPolygon(hierarchy);

        //将数组清空
        points = [];
        hierarchy = [];
        controls = [];
      }, Cesium.ScreenSpaceEventType.RIGHT_CLICK);
    });
    //封装挖地形函数
    const DrawClippingPlane = points => {
      const pointsLength = points.length;
      const clippingPlanes = []; // 存储ClippingPlane集合

      //计算裁剪面
      for (let i = 0; i < pointsLength; ++i) {
        const nextIndex = (i + 1) % pointsLength;

        //计算两个笛卡尔的按分量求和
        let midpoint = Cesium.Cartesian3.add(
          points[i],
          points[nextIndex],
          new Cesium.Cartesian3()
        );
        //缩放笛卡尔坐标
        midpoint = Cesium.Cartesian3.multiplyByScalar(midpoint, 0.5, midpoint);
        //计算提供的笛卡尔坐标系的标准化形式
        const up = Cesium.Cartesian3.normalize(
          midpoint,
          new Cesium.Cartesian3()
        );

        //计算两个笛卡尔的分量差异
        let right = Cesium.Cartesian3.subtract(
          points[nextIndex],
          midpoint,
          new Cesium.Cartesian3()
        );
        //计算提供的笛卡尔坐标系的标准化形式
        right = Cesium.Cartesian3.normalize(right, right);

        //计算两个笛卡尔的叉（外）乘积
        let normal = Cesium.Cartesian3.cross(
          right,
          up,
          new Cesium.Cartesian3()
        );
        //计算提供的笛卡尔坐标系的标准化形式
        normal = Cesium.Cartesian3.normalize(normal, normal);

        //原始中心平面
        const originCenteredPlane = new Cesium.Plane(normal, 0.0);
        //计算点到平面的有符号最短距离
        const distance = Cesium.Plane.getPointDistance(
          originCenteredPlane,
          midpoint
        );

        clippingPlanes.push(new Cesium.ClippingPlane(normal, distance));
      }

      //创建ClippingPlaneCollection对象
      const ClippingPlaneCollectionObj = new Cesium.ClippingPlaneCollection({
        planes: clippingPlanes,
        edgeWidth: 1.0,
        edgeColor: Cesium.Color.YELLOW
      });

      //赋值给globe的clippingPlanes
      viewer.scene.globe.clippingPlanes = ClippingPlaneCollectionObj;
      console.log("创建完毕！");
    };

    //封装绘制面、贴纹理函数
    const addPolygon = hierarchy => {
      viewer.entities.add({
        polygon: {
          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights(hierarchy),
          material: new Cesium.ImageMaterialProperty({
            image: prePath + "RasterImage/图片/挖地贴图.png"
          }),
          closeTop: false, // 这个要设置为false
          extrudedHeight: 0,
          perPositionHeight: true // 这个要设置true
        }
      });
    };

    //获取指定位置高度
    const getHeight = position => {
      height = viewer.scene.globe.getHeight(position);
      return height;
    };

    //样条插值
    const interpolation = (point1, point2) => {
      const spline = new Cesium.LinearSpline({
        times: [0.0, 1],
        points: [point1, point2]
      });

      for (let i = 0; i <= 100; i++) {
        const cartesian3 = spline.evaluate(i / 100);

        const cartographic = Cesium.Cartographic.fromCartesian(cartesian3);

        const lat = Cesium.Math.toDegrees(cartographic.latitude);
        const lng = Cesium.Math.toDegrees(cartographic.longitude);
        const height = getHeight(cartographic);

        hierarchy.push(lng);
        hierarchy.push(lat);
        hierarchy.push(height);
      }
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
