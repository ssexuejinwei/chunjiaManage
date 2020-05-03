<template>
  <div>
    <page-header title="商品分类编辑" back />
    <el-table :data="types">
      <el-table-column prop="coverimage" label="图片" width="100">
        <template slot-scope="scope">
          <img class="cover" :src="scope.row.coverimage">
        </template>
      </el-table-column>
      <el-table-column prop="name" label="名称" />
      <el-table-column prop="type" label="值" />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click="editType(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 16px">
      <el-button type="primary" @click="addType">
        新增分类
      </el-button>
    </div>

    <el-dialog
      title="编辑分类"
      :visible.sync="dialogVisible"
      width="500px"
    >
      <el-form
        ref="form"
        :model="form"
        :rules="rules"
        label-width="80px"
      >
        <el-form-item label="封面" prop="coverimage">
          <el-upload
            action="#"
            accept="image/*"
            class="cover-uploader"
            :show-file-list="false"
            :http-request="handleUpload"
            :on-success="handleUploadSuccess"
            :on-change="handleUploadCover"
          >
            <img
              v-if="form.coverimage"
              :src="form.coverimage.url"
              class="cover"
            >
            <i v-else class="el-icon-plus" />
          </el-upload>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="值" prop="type">
          <el-input v-model="form.type" placeholder="值需唯一" />
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Axios from 'axios'
import _ from 'lodash'
import qs from 'querystring'

function reformatImage (url) {
  return url ? {
    name: url.replace(/http:\/\/(.*)\/course\/public\/upload\//, ''),
    url
  } : null
}

export default {
  data () {
    return {
      types: [],

      dialogVisible: false,
      isEdited: false,
      form: {
        coverimage: null,
        name: '',
        type: ''
      },
      rules: {
        coverimage: [{ required: true, trigger: 'blur', message: '图片不能为空' }],
        name: [{ required: true, trigger: 'blur', message: '名称不能为空' }],
        type: [
          { required: true, trigger: 'blur', message: '值不能为空' }
          // {
          //   validator: (r, v, cb) => {
          //     const types = this.types.map(t => t.type)
          //     if (types.includes(v)) cb(new Error())
          //     else cb()
          //   },
          //   trigger: 'change',
          //   message: '值不能重复'
          // }
        ]
      }
    }
  },

  created () {
    this.getTypes()
  },

  methods: {
    handleUpload (param) {
      const file = param.file

      const formData = new FormData()
      formData.append('image_url', file)

      return Axios.post('/sellerctr/save', formData, {
        onUploadProgress: param.onProgress
      })
    },

    handleUploadSuccess (res, rawFile) {
      if (!rawFile.url) {
        this.$set(rawFile, 'url', URL.createObjectURL(rawFile.raw))
      }
      if (res?.data?.data?.fileName) {
        this.$set(rawFile, 'name', res?.data?.data?.fileName)
      }
    },

    handleUploadCover (file, fileList) {
      this.form.coverimage = fileList.slice(-1)[0]
    },

    async getTypes () {
      const { data } = await Axios.get('/sellerctr/getGoodsType')
      this.types = data.data
    },

    addType () {
      this.dialogVisible = true
      this.isEdited = false
      this.form = {
        coverimage: null,
        name: '',
        type: ''
      }
    },

    editType (type) {
      this.dialogVisible = true
      this.isEdited = true
      this.form = {
        ...type,
        coverimage: reformatImage(type.coverimage)
      }
    },

    handleSubmit () {
      this.$refs.form.validate(async valid => {
        if (!valid) return
        try {
          const api = this.isEdited ? '/sellerctr/updateGoodsType' : '/sellerctr/addGoodsType'
          const data = _.pick(this.form, [
            this.isEdited && 'id',
            'name',
            'coverimage',
            'type'
          ].filter(Boolean))
          data.coverimage = this.form.coverimage.name

          await Axios.post(api, qs.stringify(data)).then(this.getTypes)
          this.dialogVisible = false
          this.$message.success('成功')
        } catch (e) {
          console.error(e)
          this.$message.error('操作失败: ' + e.message)
        }
      })
      // const data = qs.stringify(this.isEdited ? {

      // })
    }
  }
}
</script>

<style lang="scss" scoped>
$size: 60px;

.cover {
  width: $size;
  height: $size;
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
      width: $size;
      height: $size;
      line-height: $size;
      text-align: center;
    }
  }
}
</style>
