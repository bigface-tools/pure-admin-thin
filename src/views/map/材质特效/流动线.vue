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
        animation: true, //是否显示动画工具
        timeline: true, //是否显示时间轴工具
        fullscreenButton: false //是否显示全屏按钮工具
      });
      /* console.log('selectionIndicator',viewer.selectionIndicator);
    $(".cesium-viewer-selectionIndicatorContainer").css('display','none'); */

      viewer.scene.fxaa = false;
      viewer.scene.postProcessStages.fxaa.enabled = false;

      const supportsImageRenderingPixelated =
        viewer.cesiumWidget._supportsImageRenderingPixelated;
      if (supportsImageRenderingPixelated) {
        let vtxf_dpr = window.devicePixelRatio;
        while (vtxf_dpr >= 2.0) {
          vtxf_dpr /= 2.0;
        }
        viewer.resolutionScale = vtxf_dpr;
      }

      //创建构造函数
      function PolylineTrailLinkMaterialProperty(color, duration) {
        this._definitionChanged = new Cesium.Event();
        this._color = undefined;
        this._colorSubscription = undefined;
        this.color = color;
        this.duration = duration;
        this._time = new Date().getTime();
      }

      //Object.defineProperties() 方法直接在一个对象上定义新的属性或修改现有属性，并返回该对象。
      //Object.defineProperties(obj, props)
      //obj:在其上定义或修改属性的对象   props:要定义其可枚举属性或修改的属性描述符的对象。
      Object.defineProperties(PolylineTrailLinkMaterialProperty.prototype, {
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

      PolylineTrailLinkMaterialProperty.prototype.getType = function () {
        return "PolylineTrailLink";
      };
      PolylineTrailLinkMaterialProperty.prototype.getValue = function (
        time,
        result
      ) {
        if (!Cesium.defined(result)) {
          result = {};
        }
        result.color = Cesium.Property.getValueOrClonedDefault(
          this._color,
          time,
          Cesium.Color.WHITE,
          result.color
        );
        result.image = Cesium.Material.PolylineTrailLinkImage;
        result.time =
          ((new Date().getTime() - this._time) % this.duration) / this.duration;
        return result;
      };
      PolylineTrailLinkMaterialProperty.prototype.equals = function (other) {
        return (
          this === other ||
          (other instanceof PolylineTrailLinkMaterialProperty &&
            Property.equals(this._color, other._color))
        );
      };
      // 定义新属性
      const modifiedCesium = Object.assign(
        { PolylineTrailLinkMaterialProperty },
        Cesium
      );
      /*     Object.defineProperty(Cesium, "PolylineTrailLinkMaterialProperty", {
        value: PolylineTrailLinkMaterialProperty,
        writable: true,
        enumerable: true,
        configurable: true
      }); */
      /*   Object.setPrototypeOf(Cesium, Object.prototype);
      Cesium.PolylineTrailLinkMaterialProperty =
        PolylineTrailLinkMaterialProperty; */
      //纹理类型
      modifiedCesium.Material.PolylineTrailLinkType = "PolylineTrailLink";
      //纹理图片
      modifiedCesium.Material.PolylineTrailLinkImage =
        prePath + "RasterImage/图片/color.png";
      //纹理资源
      modifiedCesium.Material.PolylineTrailLinkSource =
        "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
            {\n\
                float time = czm_frameNumber/100.0;\n\
                czm_material material = czm_getDefaultMaterial(materialInput);\n\
                vec2 st = materialInput.st;\n\
                vec4 colorImage = texture2D(image, vec2(fract(3.0*st.s - time), st.s));\n\
                material.alpha = colorImage.a * color.a;\n\
                material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
                return material;\n\
            }";
      //time越小，速度越慢
      //colorImage控制纹理
      //fract中 3.0是纹理个数  -time是逆时针 +time是顺时针
      //alpha 透明度
      //diffuse 颜色

      /* "czm_material czm_getMaterial(czm_materialInput materialInput)\n\
    {\n\
        czm_material material = czm_getDefaultMaterial(materialInput);\n\
        vec2 st = materialInput.st;\n\
        vec4 colorImage = texture2D(image, vec2(fract(st.s - time), st.t));\n\
        material.alpha = colorImage.a * color.a;\n\
        material.diffuse = (colorImage.rgb+color.rgb)/2.0;\n\
        return material;\n\
    }" */

      //添加自定义材质
      modifiedCesium.Material._materialCache.addMaterial(
        modifiedCesium.Material.PolylineTrailLinkType,
        {
          fabric: {
            //纹理类型
            type: modifiedCesium.Material.PolylineTrailLinkType,
            //传递给着色器的外部属性
            uniforms: {
              color: new modifiedCesium.Color(0.0, 0.0, 0.0, 1),
              image: modifiedCesium.Material.PolylineTrailLinkImage,
              time: 0
            },
            //纹理资源
            source: modifiedCesium.Material.PolylineTrailLinkSource
          },
          //是否透明
          translucent: function () {
            return true;
          }
        }
      );

      const line = viewer.entities.add({
        name: "PolylineTrailLink",
        polyline: {
          positions: modifiedCesium.Cartesian3.fromDegreesArray([
            118.286419, 31.864436, 119.386419, 31.864436, 119.386419, 32.864436,
            118.686419, 32.864436
          ]),
          width: 10,
          //设置材质为自定义材质
          material: new PolylineTrailLinkMaterialProperty(
            modifiedCesium.Color.fromBytes(255, 0, 0).withAlpha(0.8)
            /* 1000 */
          )
        }
      });
      viewer.flyTo(line);
    });
  }
};
</script>

<style scoped>
.cesium-map {
  height: calc(100vh - 100px);
}
</style>
