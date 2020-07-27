<template>
  <div class="workEditInfo"  v-loading="loading"
    element-loading-text="保存中">
    <page-header title="办事详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          :model="work"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="办事名"
            prop="title"
          >
            <el-input
              v-model="work.title"
              autocomplete="off"
            />
          </el-form-item>
          <el-form-item
            label="服务对象"
          >
          <el-input type="textarea" autosize maxlength="150" v-model="work.service_target"> </el-input>
          <span>(150字以内)</span>
          </el-form-item>
          <el-form-item
            label="申请材料"
          >
          <el-input type="textarea" autosize maxlength="500" v-model="work.apply_material"> </el-input>
          <span>(500字以内)</span>
          </el-form-item>
          <el-form-item
            label="办理流程"
          >
          <el-input type="textarea" autosize maxlength="1500" v-model="work.apply_procedure"> </el-input>
          <span>(1500字以内)</span>
          </el-form-item>
          <el-form-item
            label="注意事项"
          >
          <el-input type="textarea" autosize maxlength="500" v-model="work.caution"> </el-input>
          <span>(500字以内)</span>
          </el-form-item>
          <el-form-item
            label="相关政策"
          >
          <el-input type="textarea" autosize maxlength="800" v-model="work.policy"> </el-input>
          <span>(800字以内)</span>
          </el-form-item>
          <el-form-item
            label="附件上传"
          >
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-change="handleChange"
            :file-list="fileList"
            :on-remove="handleRemove"
						:auto-upload="false"
						>
            <el-button size="small" type="primary">点击上传</el-button>
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
    work: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      baseURL:'http://47.101.181.233:8000',
      api:'/api/community/manage/work/',
      api_type:'/api/community/manage/work_type/',
      api_upload:'/api/community/manage/work/upload/',
      api_delete:'/api/community/manage/work/delete/',
      fileList: [],
			files:[],
      defaultwork:{},
      typeOptions:[],
      loading:false
    }
  },
  created () {
    this.getType()
    this.work.attachment.forEach((value,index) => {
      this.fileList.push({
        name:value.name,
        id:value.id,
        url:this.baseURL+value.file
      })
    })
  },
  methods: {
    getType(){
      Axios.get(this.api_type).then(response=>{
        this.typeOptions = response.data.data
      })
    },
    handleChange(file, fileList) {
      console.log('change')
      this.files.push(file)
    },
    handleRemove(file, fileList) {
      if(file.hasOwnProperty('id')){
        Axios.post(this.api_delete, qs.stringify({
          id:this.work.id,
          file_id:file.id,
        }))
          .then(() => {
            this.$alert('删除成功', '成功')
          }).catch(e => {
            this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
          })
      }
      else{
        this.files.forEach((value,index) =>{
            if(file.uid == value.uid){
              this.images.splice(index,1)
              this.$alert('删除成功', '成功')
            } 
        })
      }
    },
    save () {
      //调API
      let formData = new FormData()
      let name = ''
      this.files.forEach((value,index) =>{
        formData.append('files',value.raw)
        name = name +value.name+','
      })
      formData.append('name',name)
      formData.append('id',this.work.id)
      this.loading = true
      Axios.post(this.api_upload,formData).then(response =>{
        Axios.put(this.api, qs.stringify({
          id:this.work.id,
          title:this.work.title,
          type_id:this.work.type.id,
          service_target:this.work.service_target,
          apply_material:this.work.apply_material,
          apply_procedure:this.work.apply_procedure,
          caution:this.work.caution,
          policy:this.work.policy
        }))
          .then(() => {
            this.loading = false
            this.$alert('保存成功', '成功').then(() => {
              this.$emit('update', true)
            })
          }).catch(e => {
            console.error(e)
            this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
          })
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
