<template>
  <div>
    <div class="content">
      <header style="display: flex">
        <el-radio-group v-model="state" class="menu">
          <el-radio-button label="1">
            全部订单
          </el-radio-button>
          <el-radio-button label="2">
            待发货订单
          </el-radio-button>
          <el-radio-button label="3">
            待收货订单
          </el-radio-button>
          <el-radio-button label="4">
            已完成订单
          </el-radio-button>
          <el-radio-button label="5">
            退/换货订单
          </el-radio-button>
          <el-radio-button label="6">
            历史订单
          </el-radio-button>
        </el-radio-group>
        <div style="margin-left: 32px">
          <el-input
            v-model="search.value"
            placeholder="请输入内容"
            style="width: 450px"
          >
            <el-select
              slot="prepend"
              v-model="search.key"
              placeholder="请选择"
              style="width: 120px"
            >
              <el-option label="商品名称" value="g.name" />
              <el-option label="收货地址" value="address" />
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
      </header>

      <div
        v-loading="isLoading"
        class="table"
      >
        <el-table
          :data="data"
          border
        >
          <el-table-column
            prop="order_number"
            label="订单号"
          />
          <el-table-column label="商品名称">
            <template slot-scope="scope">
              <span>
                <div>{{ scope.row.goods_name }} {{ scope.row.goods_id }}</div>
                <div>尺码 {{ scope.row.size }}</div>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            prop="score"
            label="消耗积分"
          />
          <el-table-column
            prop="address_str"
            label="收货地址"
          />
          <el-table-column
            prop="created"
            label="创建时间"
          >
            <template slot-scope="scope">
              {{ scope.row.create_time }}
            </template>
          </el-table-column>
          <el-table-column label="交易状态">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="handleOpenDialog(scope.row)"
              >
                <span v-if="scope.row.state === '0'">
                  <el-tag>待发货</el-tag>
                </span>
                <span v-else-if="scope.row.state === '1'">
                  <el-tag>已取消</el-tag>
                </span>
                <span v-else-if="scope.row.state === '2'">
                  <el-tag type="success">已发货</el-tag>
                </span>
                <span v-else-if="scope.row.state === '3'">
                  已完成
                </span>
                <span v-else-if="scope.row.state === '4'">
                  已退货
                </span>
                <span v-else-if="scope.row.state === '5'">
                  <el-tag type="warning">退货中</el-tag>
                </span>
                <span v-else>unknown</span>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="table-action">
          <div>
            <el-pagination
              layout="prev, pager, next"
              hide-on-single-page
              :page-count="pages"
              :current-page.sync="current"
            />
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="订单详情"
      :visible.sync="dialogVisible"
      :before-close="handleCloseDialog"
    >
      <div v-if="dialogOrder">
        <el-form
          label-width="150px"
          disabled
        >
          <el-form-item label="创建时间">
            <el-input :value="dialogOrder.create_time" />
          </el-form-item>
          <el-form-item label="订单号">
            <el-input :value="dialogOrder.order_number" />
          </el-form-item>
          <el-form-item label="所消耗积分">
            <el-input :value="dialogOrder.score" />
          </el-form-item>
          <el-form-item label="商品基础信息">
            <el-input :value="[dialogOrder.goods_name, dialogOrder.goods_id, dialogOrder.color, dialogOrder.size].join(' ')" />
          </el-form-item>
          <el-form-item label="商品数量">
            <el-input :value="dialogOrder.num" />
          </el-form-item>
          <el-form-item label="用户名称">
            <el-input :value="dialogOrder.parents_name" />
          </el-form-item>
          <el-form-item label="联系方式">
            <el-input :value="dialogOrder.address && dialogOrder.address.tel" />
          </el-form-item>
          <el-form-item
            v-if="dialogOrder.express_number"
            label="物流单号"
          >
            <el-input :value="[dialogOrder.express_name, dialogOrder.express_number].join(' ')" />
          </el-form-item>
          <el-form-item
            v-if="dialogOrder.return_express_number"
            label="退货物流单号"
          >
            <el-input :value="dialogOrder.return_express_number" />
          </el-form-item>
          <el-form-item
            v-if="dialogOrder.message"
            label="原因"
          >
            <el-input :value="dialogOrder.message" />
          </el-form-item>
          <!-- <el-form-item label="是否享有折扣">
            <el-input></el-input>
          </el-form-item>
          <el-form-item label="是否使用抵用券">
            <el-input></el-input>
          </el-form-item> -->
        </el-form>
        <div style="text-align: center">
          <template v-if="dialogOrder.state === '0'">
            <el-button
              type="primary"
              @click="updateExpressNumber"
            >
              发货
            </el-button>
            <el-button
              type="danger"
              @click="cancelOrder"
            >
              取消订单
            </el-button>
          </template>
          <template v-if="dialogOrder.state === '2'">
            <el-button type="danger" @click="openReturnDialog">
              退/换货
            </el-button>
            <el-dialog
              title="填写退货信息"
              :visible.sync="returnDialogVisible"
              append-to-body
              width="500px"
            >
              <el-form ref="returnDialogForm" :model="returnDialogForm" label-width="120px">
                <el-form-item required label="退货原因" prop="message">
                  <el-input v-model="returnDialogForm.message" placeholder="填写退货原因" />
                </el-form-item>
                <el-form-item required label="退货快递单号" prop="return_express_number">
                  <el-input v-model="returnDialogForm.return_express_number" placeholder="快递公司 快递单号" />
                </el-form-item>
              </el-form>
              <span slot="footer">
                <el-button @click="returnDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="returnOrder">确认</el-button>
              </span>
            </el-dialog>
          </template>
          <template v-if="dialogOrder.state === '5'">
            <el-button type="primary" @click="returnOrderDone">
              完成
            </el-button>
          </template>
          <el-button @click="() => dialogVisible = false">
            关闭
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// 0:已支付，订单处理中，1：订单已取消，2：已发货，3：已完成，4：已退货 5：退货中
import Axios from 'axios'
import _ from 'lodash'
import qs from 'querystring'

export default {
  data () {
    return {
      data: [],
      // 分页
      current: Number(this.$route.query.current) || 1,
      pages: 1,
      // pageSize: 5,
      state: this.$route.query.state || '1',

      isLoading: false,

      // 对话框
      dialogVisible: false,
      dialogOrder: null,

      returnDialogVisible: false,
      returnDialogForm: {
        message: '',
        return_express_number: ''
      },

      search: {
        key: 'g.name',
        value: ''
      }
    }
  },

  watch: {
    state (v) {
      this.current = 1
      this.$router.replace({
        query: {
          ...this.$route.query,
          state: v
        }
      })
      this.debouncedGetOrder()
    },
    current (v) {
      this.$router.replace({
        query: {
          ...this.$route.query,
          current: v
        }
      })
      this.debouncedGetOrder()
    }
  },
  created () {
    this.debouncedGetOrder = _.debounce(this.getOrders, 100)
    this.debouncedGetOrder()
  },

  methods: {
    async getOrders () {
      this.isLoading = true
      try {
        const { data } = await Axios.get(
          this.search.value ? '/sellerctr/searchOrder' : '/sellerctr/getOrder', {
            params: {
              cur_page: this.current,
              state: this.state,
              ...this.search
            }
          })

        console.log(data)

        data.data.data.forEach(d => {
          d.address = JSON.parse(d.address)
          if (d.address) {
            d.address.address = JSON.parse(d.address.address)
          }
        })

        this.pages = data.data.last_page
        this.data = data.data.data.map(d => ({
          ...d,
          address_str: [d.address?.address?.region?.label, d.address?.address?.detailed, d.address?.name, d.address?.tel].join(' ')
        }))
      } catch (e) {
        console.error(e)
      } finally {
        this.isLoading = false
      }
    },

    handleClearSearch () {
      this.search.value = ''
      this.cur_page = 1
      this.debouncedGetOrder()
    },

    async handleSearch () {
      this.cur_page = 1
      this.debouncedGetOrder()
    },

    updateOrder (order, data) {
      return Axios.post('/sellerctr/updateOrder', qs.stringify({
        id: order.id,
        state: order.state,
        express_number: order.express_number,
        ...data
      }))
    },

    handleSelect (key) {
      this.state = key
    },

    handleOpenDialog (v) {
      this.dialogVisible = true
      this.dialogOrder = v
    },
    handleCloseDialog (done) {
      this.dialogOrder = null
      done()
    },

    // 发货
    updateExpressNumber () {
      if (!this.dialogOrder) return
      this.$prompt('填写物流单号(格式: 快递公司 快递单号)', '提示', {
        inputPattern: /\S+ \d+/,
        inputErrorMessage: '请填写正确的物流单号'
      }).then(({ value }) => {
        this.updateOrder(this.dialogOrder, {
          express_number: value,
          state: '2'
        }).then(() => {
          this.$message.success('操作成功')
        }).catch(e => {
          console.error(e)
          this.$message.error('操作失败')
        }).then(this.getOrders)
      }).catch(() => {})
    },

    cancelOrder () {
      this.$confirm('是否取消订单', '提示').then(() => {
        Axios.post('/sellerctr/updateOrder', qs.stringify({
          id: this.dialogOrder.id,
          state: '1',
          express_number: this.dialogOrder.express_number
        })).then(() => {
          this.$message.success('取消成功')
        }).catch(e => {
          console.error(e)
          this.$message.error('操作失败')
        }).then(this.getOrders)
      }).catch(() => {})
    },

    openReturnDialog () {
      this.returnDialogVisible = true
      this.returnDialogForm = {
        message: '',
        return_express_number: ''
      }
    },

    returnOrder () {
      this.$refs.returnDialogForm.validate(valid => {
        if (!valid) return
        Axios.post('/sellerctr/updateOrder', qs.stringify({
          id: this.dialogOrder.id,
          state: '5',
          ...this.returnDialogForm
        })).then(() => {
          this.$message.success('操作成功')
          this.returnDialogVisible = false
        }).catch(e => {
          console.error(e)
          this.$message.error('操作失败')
        }).then(this.getOrders)
      })
    },

    returnOrderDone () {
      this.$confirm('退货完成，积分将返还到账户', '提示')
        .then(() => {
          Axios.post('/sellerctr/returnGoods', qs.stringify({ id: this.dialogOrder.id }))
            .then(() => {
              this.$message.success('成功')
            }).catch(e => {
              console.error(e)
              this.$message.error('操作失败')
            }).then(this.getOrders)
        }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
// .content {
//   display: flex;

.menu {
  margin-bottom: 16px;
}

//   .table {
//     flex: 1;
//   }
// }

.table-action {
  margin-top: 2rem;
  display: flex;
  justify-content: space-between;
}
</style>
