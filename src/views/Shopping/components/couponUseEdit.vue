<template>
  <div class="couponUseEditInfo">
    <page-header title="优惠券使用详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="couponUse"
          label-width="80px"
          style="width:31.25rem;"
        >
          <el-form-item label="商家名">
            <el-input v-model="couponUse.name" />
          </el-form-item>
          <el-form-item label="全部">
            <el-input v-model="couponUse.all" />
          </el-form-item>
          <el-form-item label="已使用">
            <el-input v-model="couponUse.use" />
          </el-form-item>
<!--          <el-form-item label="优惠券">
            <el-input v-model="couponUse.coupon" />
          </el-form-item> -->
          <el-form-item size="large">
            <el-button @click="save" type="success">
              保存
            </el-button>
          </el-form-item>
        </el-form>
        </el-main>
    </el-container>
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'qs'
import VDistpicker from 'v-distpicker'
export default {
  components: {
    VDistpicker
  },
  props: {
    couponUse: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      defaultcouponUse:{},
    }
  },
  created () {
  },
  methods: {
    save () {
      //调API
      this.$emit('update', true)
    },
    goBack() {
      this.$emit('back', false)
    }
  }
}
</script>

<style lang="scss">
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
