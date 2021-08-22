<template>
  <div class="board-column">
    <div class="board-column-header" :style="{background: headerBgc}">
      <span style="text-align:center;flex-grow:1">{{ headerText }}</span>
      <el-dropdown @command="handleList">
        <span style="color:white; padding-right: 10px"><i class="el-icon-more" /></span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="remove">删 除</el-dropdown-item>
          <el-dropdown-item divided command="addNewMission">新增任务</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <draggable
      :list="list"
      v-bind="$attrs"
      animation="1000"
      class="board-column-content"
      :set-data="setData"
      @update="handleUpdate"
    >
      <div v-for="(element, index) in list" :key="index" class="board-item">
        <a class="close-corner" @click="delItem(index)" />
        <i class="el-icon-close close-icon" @click="delItem(index)" />
        <span style="display:block;text-indent:14px;font-size:14px;margin-bottom:8px">{{ element.content }}</span>
        <span style="display:block;text-align:right;color:gray;font-size:12px">{{ element.at }}</span>
      </div>
    </draggable>
  </div>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  name: 'DragKanbanDemo',
  components: {
    draggable
  },
  props: {
    ind: {
      type: Number,
      default: 0
    },
    headerText: {
      type: String,
      default: 'Header'
    },
    headerBgc: {
      type: String,
      default: '#333'
    },
    options: {
      type: Object,
      default() {
        return {}
      }
    },
    list: {
      type: Array,
      default() {
        return []
      }
    }
  },
  methods: {
    setData(dataTransfer) {
      // to avoid Firefox bug
      // Detail see : https://github.com/RubaXa/Sortable/issues/1012
      dataTransfer.setData('Text', '')
    },
    addItem() {
      this.$emit('add-item', this.ind)
    },
    remove() {
      this.$emit('remove', this.ind)
    },
    delItem(index) {
      this.$emit('del-item', this.ind, index)
    },
    handleUpdate() {
      console.log(8888, this.list)
    },
    handleList(com) {
      if (com === 'remove') {
        this.remove()
      } else {
        this.addItem()
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.board-column {
  width: 300px;
  min-height: 100px;
  height: auto;
  overflow: hidden;
  background: #f0f0f0;
  border-radius: 3px;

  .board-column-header {
    height: 40px;
    line-height: 40px;
    overflow: hidden;
    display: flex;
    text-align: center;
    background: #333;
    color: #fff;
    border-radius: 3px 3px 0 0;
  }

  .board-column-content {
    height: auto;
    overflow: hidden;
    border: 10px solid transparent;
    min-height: 60px;
    display: flex;
    justify-content: flex-start;
    flex-direction: column;
    align-items: center;

    .board-item {
      cursor: pointer;
      width: 100%;
      margin: 5px 0;
      background-color: #fff;
      border-radius: 3px;
      text-align: left;
      padding: 5px 10px;
      box-sizing: border-box;
      box-shadow: 0px 1px 3px 0 rgba(0, 0, 0, 0.2);
      position: relative;
    }
    .close-corner {
      width: 0;
      height: 0;
      border-top: 20px solid red;
      border-left: 20px solid transparent;
      position: absolute;
      top: 0;
      right: 0;
    }
    .close-icon {
      position: absolute;
      top: 0;
      right: 0;
      color: white;
      font-size: 11px;
      font-weight: bold;
    }
  }
}
</style>

