<template>
  <div class="userEditInfo">
    <page-header title="用户详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="user"
          label-width="80px"
          style="width:31.25rem;"
        >
        
          <!-- <el-form-item label="用户头像">
            <el-upload
              class="avatar-uploader"
              action="https://jsonplaceholder.typicode.com/posts/"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item> -->
          <el-form-item label="姓名">
            <el-input v-model="user.name" />
          </el-form-item>
          <el-form-item label="性别">
            <el-radio-group v-model="user.sex">
              <el-radio :label="1">男</el-radio>
              <el-radio :label="0">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电话">
            <el-input disabled v-model="user.phone_number" />
          </el-form-item>
          <el-form-item label="政治面貌">
            <el-select v-model="user.politics_status" placeholder="请选择">
                <el-option
                  v-for="item in selectdPolitical"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="住址">
            <el-input v-model="user.address" />
          </el-form-item>
          <el-form-item label="所属网格">
            <el-select v-model="user.grid" placeholder="请选择">
                <el-option
                  v-for="item in selectedGrid"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="身份证号">
            <el-input
              v-model="user.ID_number"
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
    user: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      api1:'/user/manage/user',
      api2:'/user/manage/info_list/',
      imageUrl:{},
      selectdPolitical:[],
      selectedGrid:[],
      defaultUser:{},
    }
  },
  created () {
  },
  methods: {
    getItem() {
      this.imageUrl = this.$axios.defaults.baseURL+'/'+ this.user.avatar
      
      Axios.get('getItem').then(response => {
        this.selectdPolitical = response.data.data.politics_status
        this.selectedGrid = response.data.data.grid
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
      }).finally(() => { console.log("error") })
    },
    save () {
      //调API
      Axios.put('/updateUser', qs.stringify(this.user))
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
