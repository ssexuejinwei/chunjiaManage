<template>
  <div class="medicalServiceEditInfo">
    <page-header title="医疗服务人员详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
          <el-form
            :model="medicalService"
            label-width="100px"
            style="width:31.25rem;"
          >
            <el-form-item
              label="姓名"
            >
              <el-input
                v-model="medicalService.doctor"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="联系电话"
            >
            <el-input
              v-model="medicalService.phone_number"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="职位"
            >
            <el-input
              v-model="medicalService.position"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="擅长"
            >
            <el-input
              v-model="medicalService.skill"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="地点"
            >
            <el-input
              v-model="medicalService.service_address"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="服务时间"
            >
            <el-input
              v-model="medicalService.service_time"
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
    medicalService: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      api:'/api/community/manage/medical_service/',
      defaultmedicalService:{},
    }
  },
  created () {
    this.medicalService.name = this.medicalService.doctor
  },
  methods: {
    save () {
      //调API
      Axios.put(this.api, qs.stringify({
        id:this.medicalService.id,
        name:this.medicalService.doctor,
        position:this.medicalService.position,
        skill:this.medicalService.skill,
        service_time:this.medicalService.service_time,
        service_address:this.medicalService.service_address,
        phone_number:this.medicalService.phone_number,
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
