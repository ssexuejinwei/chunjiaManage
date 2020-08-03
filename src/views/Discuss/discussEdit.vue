<template>
  <div class="discussEditInfo">
    <page-header title="提议详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="discuss"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item label="提议标题">
            <el-input v-model="discuss.title" />
          </el-form-item>
          <el-form-item label="提议内容">
						<el-input type="textarea" autosize maxlength="150" v-model="discuss.content"> </el-input>
						<span>(150字以内)</span>
          </el-form-item>
          <el-form-item label="议题类型">
             <el-select v-model="discuss.type.type" placeholder="请选择">
                <el-option
                  v-for="item in typeOption"
                  :key="item.id"
                  :label="item.type"
                  :value="item.type">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="议题状态">
            <el-radio-group v-model="discuss.status">
                <el-radio :label="0">刚上传</el-radio>
                <el-radio :label="1">已发布</el-radio>
              </el-radio-group>
          </el-form-item>
          <el-form-item label="上传二维码">
            <el-upload
              action="#"
              ref="upload"
              list-type="picture-card"
              :file-list="fileList"
              :on-remove="handleRemove"
              :http-request="handleUpload"
              :on-success="handleUploadSuccess"
              :on-change="handleUploadChange"
              :auto-upload="true"
              >
               <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
          <el-form-item>
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
    discuss: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      baseURL:'https://www.cjshequ.top:8000',
      api:'/api/community/manage/proposal/',
      api_type:'/api/community/manage/proposal_type/',
      api_upload:'/api/community/manage/proposal/upload/',
      defaultdiscuss:{},
      typeOption:[],
      fileList:[],
      dialogImageUrl:[],
      images:[]
    }
  },
  created () {
    console.log(this.discuss)
    this.getTypeList()
    this.fileList.push({
      name: this.baseURL+this.discuss.QR_cod,
      percentage: 0,
      raw: {},
      size: 33049,
      status: "ready",
      uid: 1593915945347,
      url: this.baseURL+this.discuss.QR_code,
    })
  },
  methods: {
    getTypeList() {
      Axios.get(this.api_type).then(response => {
        this.typeOption = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.typeOption = []
      }).finally(() => { })
    },
    save () {
      //调API
      Axios.put(this.api, qs.stringify({
        id:this.discuss.id,
        title:this.discuss.title,
        content:this.discuss.content,
        type:this.discuss.type.id,
        status:this.discuss.status,
        // QR_code:this.discuss.QR_code
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
      formData.append('QR_code', file)
      formData.append('id', this.discuss.id)
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
