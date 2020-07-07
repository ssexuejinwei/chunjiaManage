<template>
  <div class="communityMicroInfoEditInfo">
    <page-header title="微信息详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="communityMicroInfo"
          label-width="80px"
          style="width:31.25rem;"
        >
          <el-form-item label="标题">
            <el-input v-model="communityMicroInfo.title" />
          </el-form-item>
          <el-form-item label="具体内容">
            <el-input v-model="communityMicroInfo.content" />
          </el-form-item>
          <el-form-item label="发布人">
            <el-input v-model="communityMicroInfo.publisher" />
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
    communityMicroInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      api:'/api/community/manage/micro_community/',
      defaultcommunityMicroInfo:{},
    }
  },
  created () {
  },
  methods: {
    save () {
      //调API
      Axios.put(this.api, qs.stringify(this.communityMicroInfo))
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
