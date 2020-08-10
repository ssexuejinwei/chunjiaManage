<template>
  <el-container style="height: 100vh">
    <el-aside
      class="aside"
      :width="sideWidth"
    >
      <div
        class="logo"
        :class="{ 'is-active': !collapse }"
      >
        春嘉邻聚力后台管理系统
      </div>
      <el-menu
        class="menu"
        background-color="#171a2c"
        text-color="#fff"
        active-text-color="#fff"
        router
        :default-active="defaultActive"
        :collapse="collapse"
        :collapse-transition="false"
      >
      <el-menu-item index="/user">
        <template slot="title">
          <i class="el-icon-user"></i>
          <span>用户信息管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/grid">
        <template slot="title">
          <i class="el-icon-s-grid"></i>
          <span>网格信息管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/communityInfo">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>社区信息管理</span>
        </template>
      </el-menu-item>
			<el-menu-item index="/party1">
			  <template slot="title">
			    <i class="el-icon-s-flag"></i>
			    <span>党员活动管理</span>
			  </template>
			</el-menu-item>
      <!-- <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-s-flag"></i>
          <span>党员服务管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/party1">党员活动管理</el-menu-item>
          <el-menu-item index="/party2">党员风采管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
			<el-menu-item index="/legal">
			  <template slot="title">
			    <i class="el-icon-phone"></i>
			    <span>法律服务管理</span>
			  </template>
			</el-menu-item>
			<el-menu-item index="/medical">
			  <template slot="title">
			    <i class="el-icon-circle-plus-outline"></i>
			    <span>医疗服务管理</span>
			  </template>
			</el-menu-item>
      <el-menu-item index="/serveUser">
        <template slot="title">
          <i class="el-icon-s-custom"></i>
          <span>服务人员管理</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/complaint">
        <template slot="title">
          <i class="el-icon-info"></i>
          <span>投诉建议</span>
        </template>
      </el-menu-item>
      <el-menu-item index="/shopping">
        <template slot="title">
          <i class="el-icon-sell"></i>
          <span>优你购管理</span>
        </template>
      </el-menu-item>
      <!-- <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-sell"></i>
          <span>优你购管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/shopping">商家管理</el-menu-item>
          <el-menu-item index="/couponUse">优惠券使用管理</el-menu-item>
          <el-menu-item index="coupon">优惠券管理</el-menu-item>
        </el-menu-item-group>
      </el-submenu> -->
      
      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon-star-on"></i>
          <span>活动/志愿服务管理</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/volunteer1">社区活动</el-menu-item>
          <el-menu-item index="/volunteer2">志愿服务</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      
      <el-menu-item index="/microCommunityInfo">
        <template slot="title">
          <i class="el-icon-house"></i>
          <span>社区微信息</span>
        </template>
      </el-menu-item>
      
      <el-submenu index="7">
        <template slot="title">
          <i class="el-icon-s-comment"></i>
          <span>议事</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/discuss1">我来提议</el-menu-item>
          <el-menu-item index="/discuss2">请你商量</el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      
      <el-menu-item index="/report">
        <template slot="title">
          <i class="el-icon-notebook-2"></i>
          <span>报事</span>
        </template>
      </el-menu-item>
      
      <el-menu-item index="/work">
        <template slot="title">
          <i class="el-icon-edit-outline"></i>
          <span>办事</span>
        </template>
      </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div
          class="collapse-button"
          :class="{ active: collapse }"
          @click="toggleCollapse"
        >
          <i class="el-icon-s-fold" />
        </div>
        <div
          class="logo-2"
          :class="{ 'is-active': collapse }"
        >
          春嘉邻聚力后台管理系统
        </div>
        <div class="right">
          <el-button type="text" @click="logout">
            登出
          </el-button>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import _ from 'lodash'

const menus = [
  // { name: '首页', path: '/' },
  { name: '用户信息管理', path: '/activity', icon: 'el-icon-present' },
  { name: ' ', path: '/product', icon: 'el-icon-goods' },
  { name: '订单管理', path: '/order', icon: 'el-icon-tickets' },
  { name: '教务系统', path: '/teach/student', icon: 'el-icon-date' },
  { name: '用户管理', path: '/user', icon: 'el-icon-user' },
  { name: '积分管理', path: '/score', icon: 'el-icon-coin' },
  { name: '活动管理', path: '/activity', icon: 'el-icon-present' },
  { name: '商品管理', path: '/product', icon: 'el-icon-goods' },
  { name: '订单管理', path: '/order', icon: 'el-icon-tickets' },
  { name: '教务系统', path: '/teach/student', icon: 'el-icon-date' },
  { name: '用户管理', path: '/user', icon: 'el-icon-user' },
  { name: '积分管理', path: '/score', icon: 'el-icon-coin' }
]

export default {
  data () {
    return {
      path:"/user",
      menus,
      collapse: false
    }
  },

  computed: {
    defaultActive () {
      const path = this.$route.path
      const matches = this.menus.filter(m => path.indexOf(m.path) === 0)
      if (matches.length === 0) return ''

      const match = _.maxBy(matches, o => o.path.length)

      return match.path
    },

    sideWidth () {
      return this.collapse ? '80px' : '250px'
    }
  },

  methods: {
    toggleCollapse () {
      this.collapse = !this.collapse
    },

    logout () {
      this.$store.dispatch('user/logout').then(() => {
        this.$router.replace('/auth')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.aside {
  transition: width 200ms ease;
  width: 300px;
}

.logo {
  height: 60px;
  line-height: 60px;
  text-align: center;

  background: #0f1218;
  color: rgba(255,255,255, 0);
  transition: 200ms color;

  font-weight: bold;
  &.is-active {
    color: rgba(255,255,255, 1);
  }
}

.logo-2 {
  color: rgba(255,255,255, 0);
  transition: 200ms color;
  &.is-active {
    color: rgba(255,255,255, 1);
  }
}

.menu {
  height: calc(100vh - 60px);
  border: none;
}

.header {
  height: 60px;
  line-height: 60px;
  background: #1d2033;
  color: #fff;
  padding-left: 0;

  display: flex;

  .right {
    margin-left: auto;
  }
}

.collapse-button {
  width: 60px;
  height: 60px;
  text-align: center;
  transition: background 100ms;
  cursor: pointer;

  margin-right: 8px;

  &:hover {
    background: rgba(255,255,255,0.1)
  }

  &.active i {
    transform: rotate(180deg)
  }
}

.el-main {
  padding: 0 20px 16px;
}

.el-menu-item {
  position: relative;
  &.is-active {
    background-color: #232639 !important;
    color: #fff !important;
    &::before {
      content: ' ';
      position: absolute;
      width: 3px;
      left: 0;
      top: 0;
      bottom: 0;
      background: #52bcf0;
      // height: 100%;
    }
  }
}
</style>
