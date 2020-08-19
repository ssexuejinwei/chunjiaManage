<template>
  <div class="serveUserEditInfo">
    <page-header title="服务人员详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
          <el-form
            :model="serveUser"
            label-width="100px"
            style="width:31.25rem;"
          >
            <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="#"
                :on-change="handleChange"
                :show-file-list="false"
                :auto-upload="false"
                >
                <img v-if="img_url!==''" :src="img_url" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
              </el-upload>
            </el-form-item>
            <el-form-item
              label="姓名"
              prop="name"
            >
              <el-input
                v-model="serveUser.name"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="联系电话"
              prop="phone_number"
            >
            <el-input
              v-model="serveUser.phone_number"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="职位"
              prop="duty"
            >
            <el-input
              v-model="serveUser.duty"
              autocomplete="off"
            />
            </el-form-item>
            <el-form-item
              label="公司"
              prop="company"
            >
            <el-input
              v-model="serveUser.company"
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
    serveUser: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      api:'/api/community/manage/service_group/',
      api_upload:'/api/community/manage/service_group/upload/',
      defaultserveUser:{},
      file:0,
      img_url:''
    }
  },
  created () {
    this.img_url = this.$baseURL +this.serveUser.avatar
  },
  methods: {
    handleChange(file, fileList) {
      this.img_url = URL.createObjectURL(file.raw);
      this.file = file
      
    },
    save () {
      //调API
      if(this.file !== 0) {
        let formData = new FormData()
        formData.append('avatar',this.file.raw)
        formData.append('id',this.serveUser.id)
        Axios.post(this.api_upload,formData).then(response =>{
          console.log(response)
        })
      }
      Axios.put(this.api, qs.stringify(this.serveUser))
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
