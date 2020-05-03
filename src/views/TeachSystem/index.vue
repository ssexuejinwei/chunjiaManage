<template>
  <div id="teach">
    <!-- <header class='teachHeader'>
      <h1>教务系统</h1>
      <div>
        <el-input
          size="mini"
          placeholder="输入"
          v-model="search"
          clearable
          prefix-icon="el-icon-search"
        >
        <el-button slot="append" type="text">搜索</el-button>
        </el-input>
      </div>
    </header> -->

    <!-- <br/><br/><br/><br/> -->
    <page-header title="教务管理系统">
      <el-menu
        mode="horizontal"
        active-text-color="#52bcf0"
        text-color="#000000"
        :default-active="this.$route.path"
        router
        @select="handleSelect"
      >
        <el-menu-item
          :key="teachChoose[0]"
          index="/teach/student"
        >
          {{ teachChoose[0] }}
        </el-menu-item>
        <el-menu-item
          :key="teachChoose[1]"
          index="/teach/coach"
        >
          {{ teachChoose[1] }}
        </el-menu-item>
        <el-menu-item
          :key="teachChoose[2]"
          index="/teach/course"
        >
          {{ teachChoose[2] }}
        </el-menu-item>
        <el-menu-item
          :key="teachChoose[3]"
          index="/teach/schedule"
        >
          {{ teachChoose[3] }}
        </el-menu-item>
        <el-menu-item
          :key="teachChoose[4]"
          index="/teach/team"
        >
          {{ teachChoose[4] }}
        </el-menu-item>
      </el-menu>
    </page-header>
    <!--     <el-main>
        <Student v-show="showIndex ==0"></Student>
        <Coach v-show="showIndex ==1"></Coach>
        <Schedule v-show="showIndex ==2"></Schedule>
      </el-main> -->
    <router-view />
  </div>
</template>

<script>
export default {
  data () {
    return {
      showIndex: 0,
      activeChoose: '/teach/student',
      teachChoose: ['学员档案', '教练管理', '课程管理', '排课信息', '队伍管理'],
      search: '',
      tabPosition: 'left'
    }
  },
  created () {
  },
  methods: {
    handleSelect (index) {
      this.showIndex = index
    }
  }
}
</script>

<style lang="scss">
$Green: #69bc38;
$Gray: #cdcdcb;
$Red : #92535e;
$pink : #FE8083;
// .teachHeader  {
//   padding: 0.5rem 1rem;
//   margin-bottom: 2rem;
//   display: flex;
//   justify-content: space-between;

//   a {
//     color: inherit;
//     text-decoration: none;
//   }

//   h1 {
//     font-size: 1rem;
//     margin: 0;
//   }
// }
.teach{
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
  }
</style>
