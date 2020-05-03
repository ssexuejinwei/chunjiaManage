<template>
  <div v-loading="isLoading">
    <header>
      <el-input
        v-model="search.value"
        placeholder="请输入内容"
        style="width: 500px"
      >
        <el-select
          slot="prepend"
          v-model="search.key"
          placeholder="请选择"
          style="width: 100px"
        >
          <el-option label="用户名" value="name" />
          <!-- <el-option label="手机号码" value="tel" /> -->
          <el-option label="微信支付订单号" value="transaction_id" />
          <el-option label="商品订单号" value="out_trade_no" />
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
    </header>
    <br>
    <el-table :data="data" :border="true">
      <el-table-column
        prop="parents_name"
        label="用户名"
      />
      <el-table-column
        prop="total_fee"
        label="充值积分"
      />
      <el-table-column
        prop="_type"
        label="充值方式"
      />
      <el-table-column
        prop="create_time"
        label="充值时间"
        width="180"
      />
      <el-table-column
        prop="transaction_id"
        label="微信支付订单号"
        width="240"
      />
      <el-table-column
        prop="out_trade_no"
        label="商户订单编号"
        width="180"
      />
      <el-table-column
        prop="operator"
        label="经办人"
      />
    </el-table>
    <footer>
      <el-pagination
        hide-on-single-page
        :current-page.sync="cur_page"
        :total="total"
        layout="prev, pager, next"
      />
    </footer>
  </div>
</template>

<script>
import Axios from 'axios'

const TYPE = {
  0: '小程序',
  1: 'h5',
  2: '人工充值'
}

export default {
  data () {
    return {
      search: {
        key: 'name',
        value: ''
      },
      isLoading: false,
      data: [],
      cur_page: 1,
      total: 0
    }
  },

  watch: {
    cur_page () {
      this.getData()
    }
  },

  created () {
    this.getData()
  },

  methods: {
    handleClearSearch () {
      this.search.value = ''
      this.cur_page = 1
      this.getData()
    },
    async handleSearch () {
      this.cur_page = 1
      this.getData()
    },
    async getData () {
      this.isLoading = true
      try {
        const { data } = await Axios.get(
          this.search.value
            ? '/sellerctr/searchPayRecords'
            : '/sellerctr/getPayRecords',
          {
            params: {
              cur_page: this.cur_page,
              key: this.search.key,
              value: this.search.value
            }
          })
        this.data = data.data.data.map(d => ({
          ...d,
          _type: TYPE[d.type],
          operator: d.operator || '无'
        }))
        this.total = data.data.total
        console.log(data)
      } catch (error) {
        console.error(error)
        this.$message.error('获取数据失败')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>
