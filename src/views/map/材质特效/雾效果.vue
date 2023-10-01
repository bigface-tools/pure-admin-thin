<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-01 18:54:28
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-01 18:55:04
 * @FilePath: \pure-admin-thin\src\views\map\材质特效\雾效果.vue
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
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: false //是否显示全屏按钮工具
      });

      const tileset = viewer.scene.primitives.add(
        new Cesium.Cesium3DTileset({
          url: prePath + "倾斜摄影/大雁塔3DTiles/tileset.json"
        })
      );
      viewer.zoomTo(tileset);

      const fragmentShaderSource = `//计算每个渲染顶点和视点（相机）的距离
      float getDistance(sampler2D depthTexture, vec2 texCoords) 
      { 
          float depth = czm_unpackDepth(texture2D(depthTexture, texCoords)); 
          if (depth == 0.0) { 
              return czm_infinity; 
          } 
          vec4 eyeCoordinate = czm_windowToEyeCoordinates(gl_FragCoord.xy, depth); 
          return -eyeCoordinate.z / eyeCoordinate.w; 
      } 
      //按距离进行插值
      float interpolateByDistance(vec4 nearFarScalar, float distance) 
      { 
          float startDistance = nearFarScalar.x; 
          float startValue = nearFarScalar.y; 
          float endDistance = nearFarScalar.z; 
          float endValue = nearFarScalar.w; 
          float t = clamp((distance - startDistance) / (endDistance - startDistance), 0.0, 1.0); 
          return mix(startValue, endValue, t); 
      } 
      //计算透明度
      vec4 alphaBlend(vec4 sourceColor, vec4 destinationColor) 
      { 
          return sourceColor * vec4(sourceColor.aaa, 1.0) + destinationColor * (1.0 - sourceColor.a); 
      } 

      uniform sampler2D colorTexture; //颜色纹理 内置变量
      uniform sampler2D depthTexture; //深度纹理  内置变量
      varying vec2 v_textureCoordinates;  //屏幕采样点坐标 内置变量

      uniform vec4 fogByDistance; //自定义属性 外部变量
      uniform vec4 fogColor;  //自定义属性 外部变量
      void main(void) 
      { 
          float distance = getDistance(depthTexture, v_textureCoordinates); 
          vec4 sceneColor = texture2D(colorTexture, v_textureCoordinates); 
          float blendAmount = interpolateByDistance(fogByDistance, distance); 
          vec4 finalFogColor = vec4(fogColor.rgb, fogColor.a * blendAmount); 
          gl_FragColor = alphaBlend(finalFogColor, sceneColor); 
      }`;

      const postProcessStage = new Cesium.PostProcessStage({
        //片源着色器
        fragmentShader: fragmentShaderSource,
        uniforms: {
          fogByDistance: new Cesium.Cartesian4(0, 0, 600, 1.0), //距离
          fogColor: Cesium.Color.WHITE //颜色
        }
      });
      viewer.scene.postProcessStages.add(postProcessStage);
    });
  }
};
</script>

<style scoped>
.cesium-map {
  height: calc(100vh - 100px);
}
</style>
