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
          label-width="120px"
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
          >
          <el-input type="textarea" autosize maxlength="80" v-model="coupon.descr"> </el-input>
          <span>(80字以内)</span>
          </el-form-item>
          <el-form-item
            label="优惠券数量"
            prop="left_number"
          >
            <el-input
              v-model="coupon.left_number"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item label="状态">
            <el-radio-group v-model="coupon.status">
                <el-radio :label="0">生效中</el-radio>
                <el-radio :label="1">过期</el-radio>
            </el-radio-group>
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
      api:'/api/community/manage/coupon/',
      defaultcoupon:{},
    }
  },
  created () {
    console.log(this.coupon)
  },
  methods: {
    save () {
      //调API
      Axios.put(this.api, qs.stringify({
        id:this.coupon.id,
        title:this.coupon.title,
        descr:this.coupon.descr,
        number:this.coupon.left_number,
        status:this.coupon.status
      }))
        .then(() => {
          this.$alert('保存成功', '成功').then(() => {
            this.$emit('update', true)
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '保存失败')
        })
    },
    goBack() {
      this.$emit('back', false)
    }
  }
}
</script>

<style lang="scss">
</style>
