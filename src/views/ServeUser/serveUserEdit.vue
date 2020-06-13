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
           label="性别"
           prop="date"
         >
           <el-radio-group v-model="serveUser.sex">
             <el-radio label="男">男</el-radio>
             <el-radio label="女">女</el-radio>
           </el-radio-group>
           
         </el-form-item>
         <el-form-item
           label="联系电话"
           prop="tel"
         >
         <el-input
           v-model="serveUser.tel"
           autocomplete="off"
         />
         </el-form-item>
         <el-form-item
           label="身份证号"
           prop="IDNumber"
         >
         <el-input
           v-model="serveUser.IDNumber"
           autocomplete="off"
         />
         </el-form-item>
         <el-form-item
           label="所属网格"
           prop="grid"
         >
         <el-input
           v-model="serveUser.grid"
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
      defaultserveUser:{},
    }
  },
  created () {
  },
  methods: {
    save () {
      //调API
      this.$emit('update', true)
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
