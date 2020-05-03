<template>
  <div>
    <page-header title="商品管理" />
    <div style="display: flex; align-items: center">
      <el-radio-group v-model="type">
        <el-radio-button
          v-for="(value, key) in C_TYPES_TO_STR"
          :key="key"
          :label="key"
        >
          {{ value }}
        </el-radio-button>
      </el-radio-group>
      <div style="margin-left: 16px">
        <el-input
          v-model="search.value"
          placeholder="请输入搜索关键词"
          size="small"
          style="width: 350px"
        >
          <el-select
            slot="prepend"
            v-model="search.key"
            size="mini"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option label="商品名称" value="name" />
          <!-- <el-option label="等级" value="level"></el-option> -->
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="handleSearch" />
        </el-input>
        <el-button
          v-show="search.value"
          style="margin-left: 16px"
          type="text"
          @click="handleClearSearch"
        >
          清空搜索结果
        </el-button>
      </div>
      <span style="margin-left: auto">
        <router-link to="/product/add">
          <el-button
            type="primary"
          >
            新增商品
          </el-button>
        </router-link>
      </span>
    </div>
    <el-table
      v-loading="loading"
      :data="products"
      @selection-change="handleSelect"
    >
      <el-table-column
        type="selection"
        width="55"
      />
      <el-table-column
        label="商品名称"
        min-width="240"
      >
        <template slot-scope="scope">
          <div class="product">
            <img
              class="cover"
              :src="scope.row.coverimage"
              decoding="async"
              importance="low"
            >
            <div class="info">
              <div>ID: {{ scope.row.id }}</div>
              <div>{{ scope.row.category }} - {{ scope.row.name }}</div>
              <div>所需积分: {{ scope.row.current_price }}</div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="库存/销量"
        width="120"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.store }} / {{ scope.row.sales }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        prop="create_time"
        width="160"
      />
      <el-table-column
        v-if="type === '2' || type === '3' || type === '4'"
        label="发布时间"
        prop="putaway_time"
        width="160"
      />
      <el-table-column
        v-if="false && type === '0'"
        label="商品状态"
      >
        <template slot-scope="scope">
          <ProductStateTag :product="scope.row" />
        </template>
      </el-table-column>
      <el-table-column
        v-else
        label="操作"
      >
        <template slot-scope="scope">
          <span class="table-actions">
            <router-link :to="`/product/edit/${scope.row.id}`">
              <el-button type="text">编辑商品</el-button>
            </router-link>
            <el-divider direction="vertical" />
            <el-button type="text" @click="delGood(scope.row)">删除商品</el-button>
            <template v-if="type === '1' || type === '2' || type === '4'">
              <el-divider direction="vertical" />
              <el-button type="text" @click="downGood(scope.row)">下架商品</el-button>
            </template>
            <template v-if="type === '3'">
              <el-divider direction="vertical" />
              <el-button type="text" @click="upGood(scope.row)">上架商品</el-button>
            </template>
          </span>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-bottom">
      <div class="action">
        <el-button
          v-if="type === '1' || type === '2' || type === '4'"
          type="primary"
          :disabled="!selectedProducts.length"
          @click="downGoods"
        >
          批量下架
        </el-button>
        <el-button
          v-if="type === '3'"
          type="primary"
          :disabled="!selectedProducts.length"
          @click="upGoods"
        >
          批量上架
        </el-button>
        <el-button
          :disabled="!selectedProducts.length"
          type="danger"
          @click="delGoods"
        >
          批量删除
        </el-button>
      </div>
      <el-pagination
        :page-count="total_page"
        :current-page.sync="page"
        layout="prev, pager, next"
      />
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'querystring'
import _ from 'lodash'

import ProductStateTag from './components/product-state-tag'

const C_TYPES_TO_STR = {
  0: '全部商品',
  1: '出售中商品',
  2: '预售商品',
  3: '未上架商品',
  4: '已售罄商品'
}

export default {
  components: { ProductStateTag },
  data () {
    return {
      total_page: 1,
      products: [],
      selectedProducts: [],
      type: this.$route.query.type || '0',
      page: this.$route.query.page || 1,
      loading: false,

      search: {
        key: 'name',
        value: ''
      },

      C_TYPES_TO_STR
    }
  },

  watch: {
    type (v) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          type: v
        }
      })
      this.page = 1
      this.debouncedFetchProduct()
    },

    page (v) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          page: v
        }
      })
      this.debouncedFetchProduct()
    }
  },

  created () {
    this.debouncedFetchProduct = _.debounce(this.fetchProduct, 200)
    this.debouncedFetchProduct()
  },

  methods: {
    fetchProduct () {
      this.loading = true
      Axios.get(this.search.value ? '/sellerctr/searchGoods' : '/sellerctr/getGoods', {
        params: {
          cur_page: this.page,
          type: this.type,
          key: this.search.key,
          value: this.search.value
        }
      }).then(response => {
        console.debug(response.data)
        this.products = response.data.data.data
        this.total_page = response.data.data.total_pages
        this.selectedProducts = []
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取商品列表失败: ${e.message || '未知错误'}`)
        this.products = []
        this.total_page = 0
        this.selectedProducts = []
      }).finally(() => { this.loading = false })
    },

    // 下架商品
    takeOffProduct (good) {
      return Axios.post('/sellerctr/updateGoods', qs.stringify({
        id: good.id,
        name: good.name,
        original_price: good.original_price,
        current_price: good.current_price,
        desc: good.desc,
        state: '1',
        type: good.type
      }))
    },

    // 上架商品
    takeOnProduct (good) {
      return Axios.post('/sellerctr/updateGoods', qs.stringify({
        id: good.id,
        name: good.name,
        original_price: good.original_price,
        current_price: good.current_price,
        desc: good.desc,
        state: '0',
        type: good.type
      }))
    },

    // 删除商品
    deleteProduct (good) {
      return Axios.post('/sellerctr/deleteGoods', qs.stringify({ id: good.id }))
    },

    handleSelect (val) {
      this.selectedProducts = val
    },

    handleSearch () {
      this.cur_page = 1
      this.debouncedFetchProduct()
    },

    handleClearSearch () {
      this.search.value = ''
      this.cur_page = 1
      this.debouncedFetchProduct()
    },

    downGood (good) {
      this.$confirm('是否确定下架该商品', '提示', { type: 'warning' }).then(() => {
        this.takeOffProduct(good)
          .then(() => this.$alert('下架成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('下架失败', '错误', { type: 'error' })
          })
          .then(this.debouncedFetchProduct)
      })
    },

    downGoods () {
      this.$confirm('是否确定下架选中的商品', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedProducts.map(this.takeOffProduct))
          .then(() => this.$alert('下架成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('下架失败', '错误', { type: 'error' })
          })
          .then(this.debouncedFetchProduct)
      })
    },

    upGood (good) {
      this.$confirm('是否确定上架该商品', '提示', { type: 'warning' }).then(() => {
        this.takeOnProduct(good)
          .then(() => this.$alert('上架成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('上架失败', '错误', { type: 'error' })
          })
          .then(this.debouncedFetchProduct)
      })
    },

    upGoods () {
      this.$confirm('是否确定上架选中的商品', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedProducts.map(this.takeOnProduct))
          .then(() => this.$alert('上架成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('上架失败', '错误', { type: 'error' })
          })
          .then(this.debouncedFetchProduct)
      })
    },

    delGood (good) {
      this.$confirm('是否删除该商品', '提示', { type: 'warning' }).then(() => {
        this.deleteProduct(good)
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
          .then(this.debouncedFetchProduct)
      })
    },

    delGoods () {
      this.$confirm('是否删除选中的商品', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedProducts.map(this.deleteProduct))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }), (e) => {
            console.error(e)
            this.$alert('删除失败', '错误', { type: 'error' })
          })
          .then(this.debouncedFetchProduct)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-bottom {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
}

.product {
  display: flex;
  align-items: flex-start;
  align-content: flex-start;

  .cover {
    width: 100px;
    height: 100px;
    object-fit: cover;

    margin-right: 16px;
    flex: 0 0 100px;
  }
}

.table-actions {
  .el-button + .el-button {
    margin-left: 0;
    margin-top: 4px;
  }
}
</style>
