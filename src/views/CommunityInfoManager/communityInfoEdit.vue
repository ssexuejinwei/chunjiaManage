<template>
  <div class="communityInfoEditInfo">
    <page-header title="详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
          <el-form
            v-if="type==1"
            :model="communityInfo"
            label-width="100px"
            style="width:31.25rem;"
          >
            <!-- <el-form-item label="头像">
              <el-upload
                class="avatar-uploader"
                action="#"
                accept="image/*"
                :limit="3"
                :http-request="handleUpload"
                :on-success="handleUploadSuccess"
                :on-change="handleUploadChange"
                :show-file-list="false"
              >
                <img
                  v-if="squareImageUrl==''?false:true"
                  :src="squareImageUrl"
                  class="avatar"
                >
                <i
                  v-else
                  class="el-icon-plus avatar-uploader-icon"
                />
              </el-upload>
            </el-form-item> -->
            <el-form-item
              label="姓名"
              prop="name"
            >
              <el-input
                v-model="communityInfo.name"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="职位"
              prop="duty"
            >
              <el-input
                v-model="communityInfo.duty"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item size="large">
              <el-button @click="save" type="success">
                保存
              </el-button>
            </el-form-item>
          </el-form>
          <el-form
            v-if="type==2"
            :model="communityInfo"
            label-width="100px"
            style="width:31.25rem;"
          >
            <el-form-item
              label="支部名"
              prop="name"
            >
              <el-input
                v-model="communityInfo.name"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="支部书记"
              prop="chairman"
            >
              <el-input
                v-model="communityInfo.chairman"
                autocomplete="off"
              />
            </el-form-item>
            <el-form-item
              label="联系电话"
              prop="phone_number"
            >
              <el-input
                v-model="communityInfo.phone_number"
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
    communityInfo: {
      type: Object,
      default: () => {}
    },
    type: {
      type: String,
      default: () => {}
    }
  },
  data () {
    return {
      api_com:'/api/community/manage/commission/',
      api_party:'/api/community/manage/party_branch/',
      defaultcommunityInfo:{},
      squareImageUrl:'',
      fileList:{},
      formData:{},
    }
  },
  created () {
    console.log(this.communityInfo)
    this.squareImageUrl = this.communityInfo.avatar
  },
  methods: {
    save () {
      //调API
      let form = {}
      if(this.type == 1){ 
        form = {
          id:this.communityInfo.id,
          name:this.communityInfo.name,
          avatar:'xxxx',
          duty:this.communityInfo.duty
        }
      }
      else {
        form = {
          id:this.communityInfo.id,
          name:this.communityInfo.name,
          chairman:this.communityInfo.chairman,
          phone_number:this.communityInfo.phone_number
        }
      }
      
      Axios.put(this.type==1?this.api_com:this.api_party, qs.stringify(form))
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
    },
    handleUpload (param) {
      const file = param.file
      
      this.formData = new FormData()
      this.formData.append('avatar', file)
      console.log(this.formData)
    },
    handleUploadSuccess (res, rawFile) {
      if (res?.data?.data?.fileName) {
        rawFile.url = process.env.VUE_APP_UPLOAD_PUBLIC_URL + res?.data?.data?.fileName
      }
    },
    handleUploadChange (file, fileList) {
      this.fileList = fileList
      this.squareImageUrl = this.fileList[this.fileList.length - 1].url
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
