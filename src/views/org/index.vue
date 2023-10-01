<template>
  <el-container class="container-wrap">
    <el-aside width="200px"
      ><div class="el-tree-wrapper">
        <div class="el-tree-panel" :style="{ width: treePanelWidth + 'px' }">
          <el-tree
            class="tree-wrap"
            :data="treeData"
            node-key="id"
            :props="treeProps"
            :default-expanded-keys="defaultExpandedKeys"
            :expand-on-click-node="false"
            :highlight-current="true"
            :filter-node-method="filterNode"
            @node-click="handleNodeClick"
          />
          <div class="tree-resizer" @mousedown="startResize" />
        </div></div
    ></el-aside>
    <el-main>
      <div class="content">
        <CesiumMap />
      </div>
    </el-main>
  </el-container>
</template>

<script lang="ts">
import CesiumMap from "../map/cluster.vue";
import { defineComponent, ref, onMounted, onUnmounted } from "vue";
import { ElTree } from "element-plus";

export default defineComponent({
  name: "ElTreeComponent",
  components: {
    ElTree,
    CesiumMap
  },
  setup() {
    const onViewerReady = cesiumInstance => {
      cesiumInstance.viewer.camera.setView({
        destination: Cesium.Rectangle.fromDegrees(
          114.591,
          -45.837,
          148.97,
          -5.73
        )
      });
    };
    const treeData = ref([
      {
        id: 1,
        label: "中国",
        children: [
          {
            id: 11,
            label: "重庆",
            children: []
          },
          {
            id: 12,
            label: "Node 1-2",
            children: []
          }
        ]
      },
      {
        id: 2,
        label: "Node 2",
        children: [
          {
            id: 21,
            label: "Node 2-1",
            children: []
          },
          {
            id: 22,
            label: "Node 2-2",
            children: []
          }
        ]
      }
    ]);
    const treePanelWidth = ref(250);
    const defaultExpandedKeys = ref([1]);

    const treeProps = {
      children: "children",
      label: "label"
    };

    const filterNode = (value: string, data: any) => {
      if (!value) {
        return true;
      }
      return data.label.toLowerCase().includes(value.toLowerCase());
    };

    const handleNodeClick = (data: any) => {
      console.log("Node clicked:", data);
    };

    const startResize = (event: MouseEvent) => {
      const startX = event.pageX;
      const startWidth = treePanelWidth.value;

      const handleMouseMove = (event: MouseEvent) => {
        const diff = event.pageX - startX;
        treePanelWidth.value = startWidth + diff;
      };

      const handleMouseUp = () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };

      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    };

    const handleResize = () => {
      // 自适应宽度
      const wrapper = document.querySelector(".el-tree-wrapper");
      const newWidth = wrapper?.clientWidth ?? 0;
      treePanelWidth.value = newWidth;
    };

    onMounted(() => {
      window.addEventListener("resize", handleResize);
    });

    onUnmounted(() => {
      window.removeEventListener("resize", handleResize);
    });

    return {
      onViewerReady,

      treeData,
      treePanelWidth,
      defaultExpandedKeys,
      treeProps,
      filterNode,
      handleNodeClick,
      startResize
    };
  }
});
</script>

<style lang="scss" scoped>
::v-deep {
  .el-tree {
    height: 100%;
    padding-top: 10px;
  }
}

.container-wrap.container-wrap.container-wrap {
  height: calc(100vh - 85px);
  margin: 0;
  overflow: hidden;
}

.el-tree-wrapper {
  display: flex;
  height: 100%;
}

.el-tree-panel {
  position: relative;
  min-width: 200px;
  max-width: 500px;
  overflow: auto;
  border-right: 1px solid #ebeef5;

  .el-tree-node__content {
    padding-left: 20px;
    cursor: pointer;

    &:hover {
      background-color: #f5f7fa;
    }
  }

  .tree-resizer {
    position: absolute;
    top: 0;
    right: -5px;
    width: 10px;
    height: 100%;
    cursor: col-resize;
    background-color: #fff;
  }
}

.content {
  flex: 1;
  padding: 20px;
}
</style>
