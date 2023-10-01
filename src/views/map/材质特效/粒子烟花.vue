<template>
  <div class="cesium-map">
    <div class="toolbar">
      <select id="dropdown" @change="change">
        <option value="snow">雪</option>
        <option value="rain">雨</option>
        <option value="null">null</option>
      </select>
    </div>
    <div class="cesium-map" id="cesiumContainer" />
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

    onMounted(() => {
      viewer = new Cesium.Viewer("cesiumContainer", {
        animation: false, //是否显示动画工具
        timeline: false, //是否显示时间轴工具
        fullscreenButton: false, //是否显示全屏按钮工具
        shouldAnimate: true //必须开启,自动播放动画
      });

      /* Cesium.Math.setRandomNumberSeed(315); */

      //东北天到指定原点变换矩阵,将粒子系统从模型坐标转换为世界坐标
      const modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(
        Cesium.Cartesian3.fromDegrees(114.39664, 30.52052)
      );
      //粒子发射器高度
      const emitterInitialLocation = new Cesium.Cartesian3(0.0, 0.0, 100.0);

      //粒子贴图
      let particleCanvas;
      //绘制图形
      function getImage() {
        if (!Cesium.defined(particleCanvas)) {
          particleCanvas = document.createElement("canvas");
          particleCanvas.width = 20;
          particleCanvas.height = 20;
          const context2D = particleCanvas.getContext("2d");
          context2D.beginPath();
          //圆心x 圆心y 半径 起始角度 终止角度 逆时针
          context2D.arc(10, 10, 8, 0, Cesium.Math.TWO_PI, true);
          context2D.closePath();
          context2D.fillStyle = "rgba(255, 255, 255, 1)";
          context2D.fill();
        }
        return particleCanvas;
      }

      /* var radar = viewer.entities.add({
			rectangle: {
				coordinates: Cesium.Rectangle.fromDegrees(114.40072, 30.51952, 114.40572, 30.52452),
				material: new Cesium.ImageMaterialProperty({
					//image: new Cesium.CallbackProperty(drawCanvas, false),
					image:getImage(),
					//transparent: true
				}),
			}
		}); */

      /* const minimumExplosionSize = 30.0; //最小爆炸尺寸
    const maximumExplosionSize = 100.0;  //最大爆炸尺寸 */
      const particlePixelSize = new Cesium.Cartesian2(7.0, 7.0); //粒子大小
      const burstNum = 400.0; //爆炸粒子个数
      const lifetime = 10.0; //粒子系统发射粒子的时间
      const numberOfFireworks = 20.0; //烟花个数

      //创建烟花函数
      function createFirework(offset, color, bursts) {
        const position = Cesium.Cartesian3.add(
          emitterInitialLocation,
          offset,
          new Cesium.Cartesian3()
        );
        //从发射位置创建表示转换的Matrix4
        const emitterModelMatrix = Cesium.Matrix4.fromTranslation(position);

        //随机设置烟花的生命周期
        /* const size = Cesium.Math.randomBetween(
        minimumExplosionSize,
        maximumExplosionSize
      );
      const normalSize =
        (size - minimumExplosionSize) /
        (maximumExplosionSize - minimumExplosionSize);
      const minLife = 0.3;
      const maxLife = 1.0;
      const life = normalSize * (maxLife - minLife) + minLife; */

        viewer.scene.primitives.add(
          new Cesium.ParticleSystem({
            image: getImage(), //粒子贴图
            startColor: color, //粒子在其生命初期的颜色
            endColor: color.withAlpha(0.0), //粒子在其生命结束的颜色
            //particleLife: life, //粒子生命周期
            particleLife: 1, //粒子生命周期
            speed: 100.0, //粒子扩散速度
            imageSize: particlePixelSize, //粒子像素大小
            emissionRate: 0, //每秒要发射的粒子数
            emitter: new Cesium.SphereEmitter(0.1), //系统粒子发射器
            bursts: bursts, //粒子爆炸,ParticleBurst 的数组
            lifetime: lifetime, //粒子系统发射粒子的时间
            //updateCallback: force,  //每帧都要调用一次回调函数以更新粒子
            modelMatrix: modelMatrix, //将粒子系统从模型转换为世界坐标的4x4转换矩阵。
            emitterModelMatrix: emitterModelMatrix, //在粒子系统局部坐标系内转换粒子系统发射器的4x4转换矩阵
            loop: true //粒子循环爆发
          })
        );
      }

      //粒子发射器偏移量范围
      const xMin = -100.0;
      const xMax = 100.0;
      const yMin = -80.0;
      const yMax = 100.0;
      const zMin = -50.0;
      const zMax = 50.0;

      //设置随机颜色选项数组
      const colorOptions = [
        {
          minimumRed: 0.75,
          green: 0.0,
          minimumBlue: 0.8,
          alpha: 1.0
        },
        {
          red: 0.0,
          minimumGreen: 0.75,
          minimumBlue: 0.8,
          alpha: 1.0
        },
        {
          red: 0.0,
          green: 0.0,
          minimumBlue: 0.8,
          alpha: 1.0
        },
        {
          minimumRed: 0.75,
          minimumGreen: 0.75,
          blue: 0.0,
          alpha: 1.0
        }
      ];

      //创建烟花
      for (let i = 0; i < numberOfFireworks; ++i) {
        const x = Cesium.Math.randomBetween(xMin, xMax);
        const y = Cesium.Math.randomBetween(yMin, yMax);
        const z = Cesium.Math.randomBetween(zMin, zMax);
        const offset = new Cesium.Cartesian3(x, y, z);
        //使用提供的选项创建随机颜色
        const color = Cesium.Color.fromRandom(
          colorOptions[i % colorOptions.length]
        );
        //粒子爆炸,ParticleBurst 的数组,在周期时间发射粒子爆发
        const bursts = [];
        for (let j = 0; j < 3; ++j) {
          bursts.push(
            new Cesium.ParticleBurst({
              time: Cesium.Math.nextRandomNumber() * lifetime, //粒子系统生命周期开始后以秒为单位的时间，将发生爆发
              minimum: burstNum, //爆发中发射的最小粒子数。
              maximum: burstNum //爆发中发射的最大粒子数。
            })
          );
        }
        //传参，创建烟花
        createFirework(offset, color, bursts);
      }

      viewer.scene.camera.setView({
        destination: Cesium.Cartesian3.fromDegrees(114.39664, 30.52052, 2000)
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
