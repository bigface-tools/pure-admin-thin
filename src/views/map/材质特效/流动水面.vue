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
        fullscreenButton: false, //是否显示全屏按钮工具
        terrainProvider: Cesium.createWorldTerrain()
      });
      viewer.scene.globe.depthTestAgainstTerrain = true; //开启深度检测后 会有高程遮挡效果

      const rectangle = new Cesium.GeometryInstance({
        geometry: new Cesium.RectangleGeometry({
          rectangle: Cesium.Rectangle.fromDegrees(95.0, 39.0, 100.0, 42.0),
          height: 3500.0
        })
      });
      //定义外观
      const rectangleAppearance = new Cesium.EllipsoidSurfaceAppearance({
        aboveGround: true,
        material: new Cesium.Material({
          fabric: {
            type: "Water", //材质类型
            uniforms: {
              //baseWaterColor: new Cesium.Color.fromBytes(24, 173, 247, 100),//基础颜色
              normalMap: prePath + "RasterImage/图片/动态水面.jpg", //法线纹理贴图
              frequency: 100.0, //波的数量
              animationSpeed: 0.01, //水波震动速度
              amplitude: 10.0 //振幅大小
            }
          }
        }),
        //重写shader，修改水面的透明度
        fragmentShaderSource:
          "varying vec3 v_positionMC;\n" +
          "varying vec3 v_positionEC;\n" +
          "varying vec2 v_st;\n" +
          "void main()\n" +
          "{\n" +
          "czm_materialInput materialInput;\n" +
          "vec3 normalEC = normalize(czm_normal3D * czm_geodeticSurfaceNormal(v_positionMC, vec3(0.0), vec3(1.0)));\n" +
          "#ifdef FACE_FORWARD\n" +
          "normalEC = faceforward(normalEC, vec3(0.0, 0.0, 1.0), -normalEC);\n" +
          "#endif\n" +
          "materialInput.s = v_st.s;\n" +
          "materialInput.st = v_st;\n" +
          "materialInput.str = vec3(v_st, 0.0);\n" +
          "materialInput.normalEC = normalEC;\n" +
          "materialInput.tangentToEyeMatrix = czm_eastNorthUpToEyeCoordinates(v_positionMC, materialInput.normalEC);\n" +
          "vec3 positionToEyeEC = -v_positionEC;\n" +
          "materialInput.positionToEyeEC = positionToEyeEC;\n" +
          "czm_material material = czm_getMaterial(materialInput);\n" +
          "#ifdef FLAT\n" +
          "gl_FragColor = vec4(material.diffuse + material.emission, material.alpha);\n" +
          "#else\n" +
          "gl_FragColor = czm_phong(normalize(positionToEyeEC), material, czm_lightDirectionEC);\n" +
          "gl_FragColor.a=0.55;\n" +
          "#endif\n" +
          "}\n"
      });

      const addRectangleGeometry = new Cesium.Primitive({
        geometryInstances: rectangle,
        appearance: rectangleAppearance
      });

      viewer.scene.primitives.add(addRectangleGeometry);

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(108, 42, 6000000)
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
