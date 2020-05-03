<template>
  <div>
    <page-header title="添加活动" back />
    <ActFrom @submit="onSubmit" />
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'querystring'
import ActFrom from './components/form'

export default {
  components: { ActFrom },

  methods: {
    onSubmit (formData) {
      Axios.post('/sellerctr/addActivity', qs.stringify(formData))
        .then(() => {
          this.$alert('添加成功', '成功').then(() => {
            this.$router.go(-1)
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 500px;
}

.cover {
  width: 80px;
  height: 80px;
  object-fit: contain;
  display: block;
}

.cover-uploader {
  &::v-deep .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;

    &:hover {
      border-color: #409EFF;
    }

    .el-icon-plus {
      width: 80px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }
  }
}

</style>
