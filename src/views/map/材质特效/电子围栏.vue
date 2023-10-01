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

      function DynamicWallMaterialProperty(color, duration) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = color;
        this.duration = duration;
        this._time = new Date().getTime();
      }

      Object.defineProperties(DynamicWallMaterialProperty.prototype, {
        isConstant: {
          get: function () {
            return false;
          }
        },
        definitionChanged: {
          get: function () {
            return this._definitionChanged;
          }
        },
        color: Cesium.createPropertyDescriptor("color")
      });

      DynamicWallMaterialProperty.prototype.getType = function () {
        return "DynamicWall";
      };
      DynamicWallMaterialProperty.prototype.getValue = function (time, result) {
        if (!Cesium.defined(result)) {
          result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(
          this._color,
          time,
          Cesium.Color.WHITE,
          result.color
        );
        result.image = Cesium.Material.DynamicWallImage;
        result.time =
          ((new Date().getTime() - this._time) % this.duration) / this.duration;
        ((new Date().getTime() - this._time) % this.duration) / this.duration;
        return result;
      };
      DynamicWallMaterialProperty.prototype.equals = function (other) {
        return (
          this === other ||
          (other instanceof DynamicWallMaterialProperty &&
            Property.equals(this._color, other._color))
        );
      };

      const modifiedCesium = Object.assign(
        { DynamicWallMaterialProperty },
        Cesium
      );
      // Cesium.DynamicWallMaterialProperty = DynamicWallMaterialProperty;
      modifiedCesium.Material.DynamicWallType = "DynamicWall";
      modifiedCesium.Material.DynamicWallImage =
        prePath + "RasterImage/图片/color.png"; //图片
      modifiedCesium.Material.DynamicWallSource = `czm_material czm_getMaterial(czm_materialInput materialInput)
            {
                float time = czm_frameNumber/100.0;
                czm_material material = czm_getDefaultMaterial(materialInput);
                vec2 st = materialInput.st;
                vec4 colorImage = texture2D(image, vec2(fract(1.0*st.t - time), st.t));
                material.alpha = colorImage.a * color.a;
                material.diffuse = (colorImage.rgb+color.rgb)/2.0;
                return material;
            }`; //由上到下

      //添加自定义材质
      modifiedCesium.Material._materialCache.addMaterial(
        modifiedCesium.Material.DynamicWallType,
        {
          fabric: {
            //纹理类型
            type: modifiedCesium.Material.DynamicWallType,
            //传递给着色器的外部属性
            uniforms: {
              color: new modifiedCesium.Color(0.0, 0.0, 0.0, 1),
              image: modifiedCesium.Material.DynamicWallImage,
              time: 0
            },
            //纹理资源
            source: modifiedCesium.Material.DynamicWallSource
          },
          //是否透明
          translucent: function () {
            return true;
          }
        }
      );

      const dynamicWall = viewer.entities.add({
        wall: {
          positions: modifiedCesium.Cartesian3.fromDegreesArrayHeights([
            118.286419, 31.864436, 20000.0, 119.386419, 31.864436, 20000.0,
            119.386419, 32.864436, 20000.0, 118.286419, 32.864436, 20000.0,
            118.286419, 31.864436, 20000.0
          ]),
          material: new DynamicWallMaterialProperty(
            modifiedCesium.Color.fromBytes(255, 200, 10).withAlpha(0.8),
            3000
          )
        }
      });
      viewer.flyTo(dynamicWall);
      return {
        viewer
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
