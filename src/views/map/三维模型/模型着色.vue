<!--
 * @Author: bigFace2019 599069310@qq.com
 * @Date: 2023-10-03 21:03:13
 * @LastEditors: bigFace2019 599069310@qq.com
 * @LastEditTime: 2023-10-05 18:43:18
 * @FilePath: \pure-admin-thin\src\views\map\三维模型\单体化.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <div class="cesium-map" id="cesiumContainer" />
    <div id="toolbar">
      <table>
        <tbody>
          <tr>
            <td>Model Color</td>
          </tr>
          <tr>
            <td>Mode</td>
            <td>
              <select id="mode" @change="changeMode()">
                <option value="Highlight">Highlight</option>
                <option value="Replace">Replace</option>
                <option value="Mix">Mix</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Color</td>
            <td>
              <select id="color" @change="changeColor()">
                <option value="White">White</option>
                <option value="Red">Red</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Yellow">Yellow</option>
                <option value="Gray">Gray</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Alpha</td>
            <td>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                value="1"
                id="alpha"
                @input="changeAlpha()"
              />
              <input
                type="text"
                size="5"
                value="1"
                id="alphaValue"
                @change="changeAlpha2()"
              />
            </td>
          </tr>
          <tr>
            <td>Mix</td>
            <td>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                value="0.5"
                id="mix"
                @input="changeMix()"
              />
              <input
                type="text"
                size="5"
                value="0.5"
                id="mixValue"
                @change="changeMix2()"
              />
            </td>
          </tr>
          <tr>
            <td>Model Silhouette</td>
          </tr>
          <tr>
            <td>Color</td>
            <td>
              <select id="sColor" @change="changeSColor()">
                <option value="Red">Red</option>
                <option value="Green">Green</option>
                <option value="Blue">Blue</option>
                <option value="Yellow">Yellow</option>
                <option value="Gray">Gray</option>
              </select>
            </td>
          </tr>
          <tr>
            <td>Alpha</td>
            <td>
              <input
                type="range"
                min="0.0"
                max="1.0"
                step="0.01"
                value="1"
                id="sAlpha"
                @input="changeSAlpha()"
              />
              <input
                type="text"
                size="5"
                value="1"
                id="sAlphaValue"
                @change="changeSAlpha2()"
              />
            </td>
          </tr>
          <tr>
            <td>Size</td>
            <td>
              <input
                type="range"
                min="0.0"
                max="10.0"
                step="0.01"
                value="2"
                id="size"
                @input="changeSSize()"
              />
              <input
                type="text"
                size="5"
                value="2"
                id="sizeValue"
                @change="changeSSize2()"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
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
    let entity = null;
    onMounted(() => {
      viewer = new Cesium.Viewer("cesiumContainer", {
        infoBox: false,
        selectionIndicator: false,
        shadows: true,
        shouldAnimate: true,
        animation: false, //是否显示动画工具
        timeline: false //是否显示时间轴工具
      });

      const mode = document.getElementById("mode"); //颜色模式
      const color = document.getElementById("color"); //填充色
      const alpha = document.getElementById("alpha"); //填充色透明度
      const mix = document.getElementById("mix"); //混合比例
      const sColor = document.getElementById("sColor"); //边框颜色
      const sAlpha = document.getElementById("sAlpha"); //边框透明度
      const size = document.getElementById("size"); //边框尺寸

      entity = viewer.entities.add({
        name: "飞机",
        position: Cesium.Cartesian3.fromDegrees(104, 40, 5),
        model: {
          uri: prePath + "3D格式数据/glb/Cesium_Air.glb",
          minimumPixelSize: 2,
          maximumScale: 200,
          color: getColor(color.value, alpha.value),
          colorBlendMode: getColorBlendMode(mode.value),
          colorBlendAmount: parseFloat(mix.value),
          silhouetteColor: getColor(sColor.value, sAlpha.value),
          silhouetteSize: parseFloat(size.value)
        }
      });
      viewer.zoomTo(entity);

      //#endregion
    });
    function getColorBlendMode(colorBlendMode) {
      return Cesium.ColorBlendMode[colorBlendMode.toUpperCase()];
    }

    function getColor(colorName, alpha) {
      const color = Cesium.Color[colorName.toUpperCase()]; //将字符串转为大写
      return Cesium.Color.fromAlpha(color, parseFloat(alpha));
    }
    //#region 各种相应事件

    //改变colorBlendMode
    const changeMode = () => {
      entity.model.colorBlendMode = getColorBlendMode(mode.value);
    };

    //模型颜色

    const changeColor = () => {
      entity.model.color = getColor(color.value, alpha.value);
    };

    //模型颜色透明度滑动条
    const changeAlpha = () => {
      //拿到滑动条当前值
      const modelAlpha = Number(alpha.value);
      //文本框显示当前值
      alphaValue.value = modelAlpha;
      entity.model.color = getColor(color.value, modelAlpha);
    };
    //模型颜色透明度文本框

    const changeAlpha2 = () => {
      const modelAlpha = Number(alphaValue.value);
      alpha.value = modelAlpha;
      changeAlpha();
    };

    //混合时颜色强度滑动条

    const changeMix = () => {
      //拿到滑动条当前值
      const modelMix = Number(mix.value);
      //文本框显示当前值
      mixValue.value = modelMix;
      entity.model.colorBlendAmount = parseFloat(modelMix);
    };
    //混合时颜色强度文本框

    const changeMix2 = () => {
      const modelMix = Number(mixValue.value);
      mix.value = modelMix;
      changeMix();
    };

    //外轮廓线颜色

    const changeSColor = () => {
      entity.model.silhouetteColor = getColor(sColor.value, sAlpha.value);
    };

    //外轮廓线透明度滑动条

    const changeSAlpha = () => {
      //拿到滑动条当前值
      const silhouetteAlpha = Number(sAlpha.value);
      //文本框显示当前值
      sAlphaValue.value = silhouetteAlpha;
      entity.model.silhouetteColor = getColor(sColor.value, silhouetteAlpha);
    };
    //外轮廓线透明度文本框

    const changeSAlpha2 = () => {
      const silhouetteAlpha = Number(sAlphaValue.value);
      sAlpha.value = silhouetteAlpha;
      changeSAlpha();
    };

    //外轮廓线尺寸滑动条

    const changeSSize = () => {
      const silhouetteSize = Number(size.value);
      sizeValue.value = silhouetteSize;
      entity.model.silhouetteSize = parseFloat(silhouetteSize);
    };
    //外轮廓线尺寸文本框

    const changeSSize2 = () => {
      const silhouetteSize = Number(sizeValue.value);
      size.value = silhouetteSize;
      entity.model.silhouetteSize = parseFloat(silhouetteSize);
    };
    return {
      changeSSize2,
      changeSSize,
      changeSAlpha2,
      changeSColor,
      changeMix2,
      changeAlpha2,
      changeColor,
      changeMode
    };
  }
};
</script>

<style scoped>
#toolbar {
  position: absolute;
  top: 4px;
  background: rgb(245 240 240 / 80%);
  border-radius: 4px;
}

#toolbar input {
  padding-top: 2px;
  padding-bottom: 2px;
  vertical-align: middle;
}

.cesium-map {
  height: calc(100vh - 100px);
}
</style>
