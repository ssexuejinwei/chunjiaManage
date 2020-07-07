<template>
  <div class="PartyStyleEditInfo">
    <page-header title="党员风采详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="PartyStyle"
          label-width="80px"
          style="width:62.5rem;"
        >
          <el-form-item label="姓名">
            <el-input v-model="PartyStyle.name" />
          </el-form-item>
          <el-form-item label="先进事迹">
            <el-input type="textarea" rows="10" v-model="PartyStyle.deed"></el-input>
          </el-form-item>
          <el-form-item label="上传图片">
            <el-upload
              action="#"
              ref="upload"
              list-type="picture-card"
              :file-list="fileList"
              :on-remove="handleRemove"
              :on-change="handleChange"
              :auto-upload="false"
              >
               <i class="el-icon-plus"></i>
            </el-upload>
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
    PartyStyle: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      baseURL:'http://47.101.181.233:8000',
      api:'/api/community/manage/party_style/',
      api_upload:'/api/community/manage/party_style/upload/',
      defaultPartyStyle:{},
      fileList:[],
      dialogImageUrl:[],
      images:[]
    }
  },
  created () {
    console.log(this.PartyStyle)
    this.PartyStyle.images.forEach((value,index) => {
      this.dialogImageUrl.push(this.baseURL+value)
      this.fileList.push({
        name: this.baseURL+value,
        percentage: 0,
        raw: {},
        size: 33049,
        status: "ready",
        uid: 1593915945347+index,
        url: this.baseURL+value,
      })
    })
  },
  methods: {
    handleChange(file, fileList) {
      console.log('change')
      this.images.push(file.raw)
    },
    save () {
      //调API
      let formData = new FormData()
      this.images.forEach((value,index) =>{
        formData.append('images',value)
      })
      formData.append('id',this.PartyStyle.id)
      Axios.post(this.api_upload,formData).then(response =>{
        console.log(response)
      })
      Axios.put(this.api, qs.stringify({
        id:this.PartyStyle.id,
        name:this.PartyStyle.name,
        deed:this.PartyStyle.deed
      })).then(() => {
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
    },
    handleRemove(file, fileList) {
      this.dialogImageUrl.forEach((value,index) => {
        if(value == file.url) {
          this.dialogImageUrl.splice(index,1)
        }
      })
    },
    handleUpload (params) {
      const file = params.file
      const formData = new FormData()
      formData.append('images', file)
      formData.append('id', this.PartyStyle.id)
      console.log(formData)
      return Axios.post(this.api_upload, formData, {
        onUploadProgress: params.onProgress
      })
    },
    submitUpload (){
      this.$refs.upload.submit();
    },
    handleUploadSuccess (res, rawFile) {
      if (res?.data?.data?.fileName) {
        rawFile.url = process.env.VUE_APP_UPLOAD_PUBLIC_URL + res?.data?.data?.fileName
      }
    },
    handleUploadChange (file, fileList) {
      this.dialogImageUrl.push(file.raw);
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
