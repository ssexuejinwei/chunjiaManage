<template>
  <div>
    <page-header title="发布商品" back />
    <el-form
      ref="form"
      class="form"
      :model="form"
      :rules="rules"
      label-width="120px"
    >
      <el-form-item label="商品封面" prop="coverimage">
        <el-upload
          action="#"
          accept="image/*"
          class="cover-uploader"
          :show-file-list="false"
          :limit="1"
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
      <el-form-item label="商品图片" prop="images">
        <el-upload
          action="#"
          list-type="picture-card"
          accept="image/*"
          :file-list="form.images"
          :http-request="handleUpload"
          :on-success="handleUploadSuccess"
          :on-change="handleUploadImages"
        >
          <i class="el-icon-plus" />
        </el-upload>
      </el-form-item>
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" />
      </el-form-item>
      <el-form-item label="商品分类" prop="type">
        <el-radio-group v-model="form.type">
          <el-radio v-for="type in types" :key="type.id" :label="type.type">
            {{ type.name }}
          </el-radio>
        </el-radio-group>
        <router-link style="margin-left: 16px" to="/product/type">
          <el-button type="text">
            编辑
          </el-button>
        </router-link>
      </el-form-item>
      <el-form-item label="小分类" prop="category">
        <el-input v-model="form.category" />
      </el-form-item>
      <el-form-item label="原价" prop="original_price">
        <el-input-number
          v-model="form.original_price"
          :min="0"
          :precision="2"
        />
      </el-form-item>
      <el-form-item label="现价" prop="current_price">
        <el-input-number v-model="form.current_price" :min="0" :precision="2" />
      </el-form-item>
      <el-form-item label="简介" prop="laber">
        <el-input v-model="form.laber" />
      </el-form-item>
      <el-form-item label="详细介绍" prop="desc">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item label="sku" prop="skus">
        <el-table :data="form.skus">
          <el-table-column label="尺码" prop="size" width="90">
            <template slot-scope="scope">
              <el-input v-model="scope.row.size" size="mini" />
            </template>
          </el-table-column>
          <el-table-column label="库存" prop="num" width="150">
            <template slot-scope="scope">
              <el-input-number
                v-model="scope.row.num"
                :min="0"
                :precision="0"
                size="mini"
                controls-position="right"
              />
            </template>
          </el-table-column>
          <el-table-column label="操作" width="230">
            <template slot-scope="scope">
              <el-button
                v-if="scope.$index === form.skus.length - 1"
                size="mini"
                type="primary"
                @click="addSku"
              >
                添加
              </el-button>
              <el-button
                v-if="scope.$index !== 0 || form.skus.length > 1"
                size="mini"
                type="danger"
                @click="delSku(scope.row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item label="是否预售" prop="reserve_time">
        <el-switch v-model="form.reserve" inactive-value="0" active-value="1" />
        <el-date-picker
          v-if="form.reserve === '1'"
          v-model="form.reserve_time"
          style="margin-left: 12px"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item label="是否定时上架" prop="putaway_time">
        <el-switch v-model="form.putaway" />
        <el-date-picker
          v-if="form.putaway"
          v-model="form.putaway_time"
          style="margin-left: 12px"
          type="datetime"
          placeholder="选择日期时间"
        />
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="onSubmit">
          提交
        </el-button>
        <!-- <el-button type="info" @click="onSubmit">预售商品</el-button>
        <el-button type="success" @click="onSubmit">定时上架</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'querystring'
import { format } from 'date-fns'

export default {
  data () {
    return {
      form: {
        name: '',
        original_price: '0.00',
        current_price: '0.00',
        desc: '',
        state: '0', // 状态 0;  //销售中1;//下架
        type: '0', // 类型0：鞋子，1：服饰，2：周边
        coverimage: '',
        laber: '',
        category: '',
        images: [],
        reserve: '0',
        reserve_time: new Date(),
        skus: [{ size: '', num: 0 }],
        putaway: false,
        putaway_time: new Date()
      },
      rules: {
        name: [{ required: true, trigger: 'blur', message: '请输入商品名称' }],
        original_price: [
          { required: true, trigger: 'blur', message: '请输入原价' },
          {
            validator: (r, v, cb) => {
              if (v < this.form.current_price) {
                cb(new Error('原价不能小于现价'))
              } else {
                cb()
              }
            },
            trigger: 'change'
          }
        ],
        current_price: [
          { required: true, trigger: 'blur', message: '请输入现价' },
          {
            validator: (r, v, cb) => {
              if (v > this.form.original_price) {
                cb(new Error('现价不能大于原价'))
              } else {
                cb()
              }
            },
            trigger: 'change'
          }
        ],
        desc: [{ required: true, trigger: 'blur', message: '请输入商品描述' }],
        coverimage: [
          { required: true, trigger: 'change', message: '请上传商品封面' }
        ],
        laber: [{ required: true, trigger: 'blur' }],
        category: [
          { required: true, trigger: 'blur', message: '请输入商品分类' }
        ],
        images: [
          {
            type: 'array',
            required: true,
            trigger: 'change',
            message: '请上传商品图片'
          }
        ],
        skus: [
          {
            validator: (r, v, cb) => {
              if (this.validSkus.length === 0) {
                cb(new Error('请填写 skus 信息'))
              } else {
                cb()
              }
            },
            trigger: 'change'
          }
        ],
        reserve_time: [
          {
            validator: (r, v, cb) => {
              if (this.form.reserve === '1') {
                if (!this.form.reserve_time) {
                  return cb(new Error('请输入预定时间'))
                }
              }
              cb()
            }
          }
        ],
        putaway_time: [
          {
            validator: (r, v, cb) => {
              if (this.form.putaway) {
                if (!this.form.putaway_time) {
                  return cb(new Error('请输入发布时间'))
                }
              }
              cb()
            },
            trigger: 'change'
          }
        ]
      },
      types: []
    }
  },

  computed: {
    formData () {
      const form = {
        ...this.form,
        coverimage: this.form.coverimage.name,
        images: JSON.stringify(this.form.images.map(img => img.name)),
        skus: JSON.stringify(this.validSkus),
        putaway_time: this.form.putaway
          ? format(this.form.putaway_time, 'yyyy-MM-dd HH:mm:ss')
          : format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
        reserve_time:
          this.form.reserve === '1'
            ? format(this.form.reserve_time, 'yyyy-MM-dd HH:mm:ss')
            : format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      }

      delete form.putaway
      return form
    },

    validSkus () {
      return this.form.skus.filter(sku => /* sku.color && */ sku.size)
    }
  },

  async created () {
    const { data } = await Axios.get('/sellerctr/getGoodsType')
    this.types = data.data
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
    handleUploadImages (file, fileList) {
      this.form.images = fileList
    },

    addSku () {
      this.form.skus.push({
        // color: '',
        size: '',
        num: 0
      })
    },

    delSku ($sku) {
      this.form.skus = this.form.skus.filter(sku => sku !== $sku)
    },

    onSubmit () {
      console.log(this.formData)
      this.$refs.form.validate(valid => {
        console.log(valid)
        if (!valid) return
        Axios.post('/sellerctr/addGoods', qs.stringify(this.formData))
          .then(() => {
            this.$alert('添加成功', '成功').then(() => {
              this.$router.go(-1)
            })
          })
          .catch(e => {
            console.error(e)
            this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加商品失败')
          })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
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
      border-color: #409eff;
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
