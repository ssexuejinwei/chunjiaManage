<template>
  <div>
    <page-header title="积分管理">
      <el-menu
        mode="horizontal"
        router
        :default-active="$route.path"
      >
        <el-menu-item index="/score/overview">
          积分总览
        </el-menu-item>
        <el-menu-item index="/score/recharge-record">
          充值记录
        </el-menu-item>
        <el-menu-item index="/score/bill-record">
          消费记录
        </el-menu-item>
        <el-menu-item index="/score/return-record">
          返还记录
        </el-menu-item>
      </el-menu>
    </page-header>
    <div class="content">
      <router-view style="flex: 1" />
    </div>
  </div>
</template>

<style lang="scss" scoped>

.content {
  display: flex;
}
</style>
