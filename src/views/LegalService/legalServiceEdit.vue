<template>
  <div class="legalServiceEditInfo">
    <page-header title="服务人员详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
          <el-form
            :model="legalService"
            label-width="100px"
            style="width:31.25rem;"
          >
            <el-form-item
              label="姓名"
            >
              <el-input
                v-model="legalService.name"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="联系电话"
            >
            <el-input
              v-model="legalService.phone_number"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="职位"
            >
            <el-input
              v-model="legalService.position"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="服务时间"
            >
            <el-input
              v-model="legalService.service_time"
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
    legalService: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      api:'/api/community/manage/legal_service/',
      defaultlegalService:{},
    }
  },
  created () {
    this.legalService.name = this.legalService.staff
  },
  methods: {
    save () {
      //调API
      Axios.put(this.api, qs.stringify({
        id:this.legalService.id,
        name:this.legalService.name,
        phone_number:this.legalService.phone_number,
        service_time:this.legalService.service_time,
        position:this.legalService.position,
        service_time:this.legalService.service_time,
      }))
        .then(() => {
          this.$alert('保存成功', '成功').then(() => {
            this.$emit('update', true)
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
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
