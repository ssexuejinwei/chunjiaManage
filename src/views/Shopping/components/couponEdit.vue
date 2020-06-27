<template>
  <div class="couponEditInfo">
    <page-header title="优惠券详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="coupon"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="优惠券名"
            prop="title"
          >
            <el-input
              v-model="coupon.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="优惠券详细信息"
            prop="descr"
          >
            <el-input
              v-model="coupon.content"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="优惠券数量"
            prop="number"
          >
            <el-input
              v-model="coupon.number"
              autocomplete="off"
            />
          </el-form-item>
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
    coupon: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      defaultcoupon:{},
    }
  },
  created () {
  },
  methods: {
    save () {
      //调API
      Axios.post('/sellerctr/addActivity', qs.stringify(this.coupon))
        .then(() => {
          this.$alert('保存成功', '成功').then(() => {
            this.getData()
            this.isAdd = false
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
      this.$emit('update', true)
    },
    goBack() {
      this.$emit('back', false)
    }
  }
}
</script>

<style lang="scss">
</style>
