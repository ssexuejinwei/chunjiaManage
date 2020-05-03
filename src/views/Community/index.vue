<template>
  <div>
    <!-- <header class='teachHeader'>
      <h1>用户管理</h1>
      <div>
        <el-input placeholder="请输入内容" v-model="search.value" style="width: 500px">
          <el-select v-model="search.key" slot="prepend" placeholder="请选择" style="width: 100px">
            <el-option label="用户名" value="name"></el-option>
            <el-option label="性别" value="sex"></el-option>
            <el-option label="年龄" value="age"></el-option>
            <el-option label="电话" value="tel"></el-option>
            <el-option label="积分" value="score"></el-option>
            <el-option label="加入时间" value="create_time"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch"></el-button>
        </el-input>
        <el-button style="margin-left: 16px" v-show="search.value" type="text" @click="handleClearSearch">
          清空搜索结果
        </el-button>
      </div>
    </header> -->

    <User />
    <!-- <UserAdd v-if='isAdded'/> -->
  </div>
</template>

<script>
import User from './components/user'
export default {
  components: { User },
  data () {
    return {
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style lang="scss">
$Green: #69bc38;
$Gray: #cdcdcb;
$Red : #92535e;
$pink : #FE8083;
.teachHeader  {
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  background: $pink;
  display: flex;
  justify-content: space-between;

  a {
    color: inherit;
    text-decoration: none;
  }

  h1 {
    font-size: 1rem;
    margin: 0;
  }
}
  .chooseMenu{
    margin-left: 1.25rem;
    width:12.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
  .chooseMenu .el-menu-item.is-active {
    background-color: $Green ;
    font-size: x-large !important;
    border: 1px solid !important;
  }
</style>
