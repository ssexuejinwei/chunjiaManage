<template>
  <div class="activityEditInfo">
    <page-header title="党员活动详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="activity"
          label-width="80px"
          style="width:31.25rem;"
        >
          <el-form-item label="活动名">
            <el-input v-model="activity.name" />
          </el-form-item>
          <el-form-item
            label="活动日期"
            prop="activity_time"
          >
            <el-date-picker
              v-model="activityForm.activity_time"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyy-MM-dd"
              style="width: 100%;"
            />
        </el-form-item>
          <el-form-item label="活动内容">
            <el-input v-model="activity.content" />
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
    activity: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      defaultactivity:{},
    }
  },
  created () {
  },
  methods: {
    save () {
      //调API
      Axios.post('/sellerctr/addActivity', qs.stringify(this.activity))
        .then(() => {
          this.$alert('添加成功', '成功').then(() => {
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
