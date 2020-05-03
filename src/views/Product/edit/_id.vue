<template>
  <div>
    <page-header title="编辑商品" back />
    <div v-loading="isLoading">
      <h3>修改商品信息</h3>
      <el-form
        v-if="product"
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
        <el-form-item label="是否预售">
          <el-switch v-model="form.reserve" inactive-value="0" active-value="1" />
          <el-date-picker
            v-if="form.reserve === '1'"
            v-model="form.reserve_time"
            style="margin-left: 12px"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item label="上架时间">
          <el-date-picker
            v-model="form.putaway_time"
            type="datetime"
            placeholder="选择日期时间"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleUpdate">
            修改
          </el-button>
        </el-form-item>
      </el-form>

      <div v-if="product && product.sku">
        <h3>修改库存</h3>
        <el-table :data="product.sku" style="margin-left: 80px">
          <el-table-column label="尺码" prop="size" width="90" />
          <el-table-column label="库存" prop="num" width="150" />
          <el-table-column label="操作" width="230">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="editSku(scope.row)"
              >
                修改
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          style="margin-left: 80px"
          size="mini"
          type="primary"
          @click="addSku"
        >
          添加
        </el-button>
      </div>
    </div>
    <skuAddModal :visible.sync="skuAddModalVisible" :submit="handleAddSku" />
  </div>
</template>

<script>
import Axios from 'axios'
import _ from 'lodash'
import qs from 'querystring'
import { format, parse } from 'date-fns'

import skuAddModal from './skuAddModal'

function reformatImage (url) {
  return url ? {
    name: url.replace(/http:\/\/(.*)\/course\/public\/upload\//, ''),
    url
  } : null
}

function reformatDate (dateStr) {
  return parse(dateStr, 'yyyy-MM-dd HH:mm:ss', new Date())
}

export default {
  components: { skuAddModal },
  data () {
    return {
      id: this.$route.params.id,
      product: null,
      isLoading: false,
      types: [],

      form: {},
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
        laber: [{ required: true, trigger: 'blur' }],
        category: [
          { required: true, trigger: 'blur', message: '请输入商品分类' }
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
        images: [
          {
            type: 'array',
            required: true,
            trigger: 'change',
            message: '请上传商品图片'
          }
        ],
        coverimage: [
          { required: true, trigger: 'change', message: '请上传商品封面' }
        ]
      },

      skuAddModalVisible: false
    }
  },

  computed: {
    formData () {
      const form = {
        ...this.form,
        coverimage: this.form.coverimage.name,
        images: JSON.stringify(this.form.images.map(img => img.name)),
        putaway_time: format(this.form.putaway_time, 'yyyy-MM-dd HH:mm:ss'),
        reserve_time:
          this.form.reserve === '1'
            ? format(this.form.reserve_time, 'yyyy-MM-dd HH:mm:ss')
            : format(new Date(), 'yyyy-MM-dd HH:mm:ss')
      }

      return _.pick(form, ['name', 'current_price', 'original_price', 'coverimage', 'images', 'desc', 'laber', 'category', 'type', 'reserve', 'reserve_time', 'putaway_time'])
    }
  },

  async created () {
    this.isLoading = true
    await this.fetchTypes()
    await this.fetchGood()
    this.isLoading = false
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
    async fetchTypes () {
      try {
        const { data } = await Axios.get('/sellerctr/getGoodsType')
        this.types = data.data
      } catch (e) {
        console.error(e)
        this.$message.error(`获取商品分类失败: ${e.message || '未知错误'}`)
      }
    },
    async fetchGood () {
      try {
        const { data } = await Axios.get('/sellerctr/getGoodsById', {
          params: { id: this.id }
        })

        this.form = {
          ...data.data,
          coverimage: reformatImage(data.data.coverimage),
          images: data.data.images.map(reformatImage),
          putaway_time: reformatDate(data.data.putaway_time),
          reserve_time: reformatDate(data.data.reserve_time)
        }
        this.product = data.data
      } catch (e) {
        console.error(e)
        this.$message.error(`获取商品信息失败: ${e.message || '未知错误'}`)
      }
    },

    delSku (sku) {},

    editSku (sku) {
      this.$prompt(`请输入尺码${sku.size}的库存`, '修改库存', {
        inputValidator (v) {
          const num = Number(v)
          if (isNaN(num)) return false
          if (!Number.isInteger(num)) return false
          return true
        },
        inputErrorMessage: '请输入整数',
        inputValue: sku.num
      })
        .then(({ value }) => {
          Axios.post(
            '/sellerctr/updateSku',
            qs.stringify({
              id: sku.id,
              goods_id: sku.goods_id,
              num: value
            })
          ).then(() => {
            this.$message.success('修改成功')
            this.fetchGood()
          })
            .catch(e => {
              console.error(e)
              this.$message.error('修改失败: ' + e.message)
            })
        }).catch(() => {})
    },

    addSku () {
      this.skuAddModalVisible = true
    },

    async handleAddSku (form) {
      try {
        await Axios.post('/sellerctr/addSku', qs.stringify({
          ...form,
          goods_id: this.product.id
        }))
        this.$message.success('添加sku成功')
        this.fetchGood()
      } catch (e) {
        console.error(e)
        this.$message.error('添加sku失败')
      }
    },

    async handleUpdate () {
      this.$refs.form.validate(valid => {
        if (!valid) return
        Axios.post('/sellerctr/updateGoods', {
          id: this.id,
          ...this.formData
        }).then(() => {
          this.$message.success('修改成功')
          this.fetchGood()
        }).catch(e => {
          console.error(e)
          this.$message.error('修改失败: ' + e.message)
        })
      })
    }

    // updateProperty (prop, name, options) {
    //   this.$prompt(`修改商品${name}`, '修改', {
    //     ...options,
    //     inputValue: this.product[prop]
    //   }).then(({ value }) => {
    //     Axios.post('/sellerctr/updateGoods', {
    //       id: this.id,
    //       [prop]: value
    //     }).then(() => {
    //       this.$message.success('修改成功')
    //       this.fetchGood()
    //     }).catch(e => {
    //       console.error(e)
    //       this.$message.error('修改失败: ' + e.message)
    //     })
    //   }).catch(() => {})
    // }
  }
}
</script>

<style lang="scss" scoped>
.form {
  width: 600px;
  min-height: 200px;
}

.cover {
  width: 80px;
  height: 80px;
  object-fit: contain;
  display: block;
}

.images {
  display: flex;
  height: 100px;
  flex-wrap: nowrap;
  overflow-x: auto;

  > img {
    height: 100%;
    margin-right: 8px;
  }
}
</style>
