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
          <el-option label="手机号码" value="tel" />
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
    </header>
    <br>
    <el-table
      v-if="search.value === ''"
      :data="users"
      :border="true"
      @sort-change="handleSortChange"
    >
      <el-table-column
        prop="name"
        label="用户名"
        width="150"
        sortable="custom"
      />
      <el-table-column
        prop="score"
        label="积分"
        width="80"
        sortable="custom"
      />
      <el-table-column prop="level" label="会员等级" width="80">
        <template slot-scope="scope">
          <span>Lv {{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="200"
        sortable="custom"
      />
      <el-table-column
        prop="tel"
        label="手机号码"
        width="200"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openScoreDialog(scope.row)">
            修改积分
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-table v-else :data="users" :border="true">
      <el-table-column
        prop="name"
        label="用户名"
        width="150"
      />
      <el-table-column
        prop="score"
        label="积分"
        width="80"
      />
      <el-table-column prop="level" label="会员等级" width="80">
        <template slot-scope="scope">
          <span>Lv {{ scope.row.level }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="create_time"
        label="创建时间"
        width="200"
      />
      <el-table-column
        prop="tel"
        label="手机号码"
        width="200"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="openScoreDialog(scope.row)">
            修改积分
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <el-pagination
        hide-on-single-page
        :current-page.sync="cur_page"
        :total="total"
        layout="prev, pager, next"
      />
    </footer>

    <el-dialog title="修改积分" :visible.sync="dialogVisible" width="450px">
      <div v-if="dialogUser" v-loading="dialogLoading">
        <p>
          <strong>修改用户：{{ dialogUser.name }}</strong>
        </p>
        <el-input-number
          v-model="dialogScore"
          placeholder="请输入积分"
          :min="0"
          :precision="2"
        />
        <p style="text-align: center">
          <el-button
            :disabled="!!!dialogScore"
            type="primary"
            @click="changeScore('add')"
          >
            加积分
          </el-button>
          <el-button
            :disabled="!!!dialogScore"
            type="info"
            @click="changeScore('sub')"
          >
            减积分
          </el-button>
          <el-button @click="closeScoreDialog">
            取消
          </el-button>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Axios from 'axios'

const SORT_MAP = {
  create_time: 0,
  age: 1,
  sex: 2,
  name: 3,
  score: 4
}

export default {
  data () {
    return {
      users: [],
      isLoading: false,
      cur_page: 1,
      total: 0,
      sortkey: null,

      search: {
        key: 'name',
        value: ''
      },

      dialogVisible: false,
      dialogUser: null,
      dialogScore: 0,
      dialogLoading: false
    }
  },

  watch: {
    cur_page () {
      this.getUser()
    },
    sortkey () {
      this.getUser()
    }
  },

  created () {
    this.getUser()
  },

  methods: {
    async getUser () {
      this.isLoading = true
      try {
        const { data } = await Axios.get(
          this.search.value
            ? '/sellerctr/searchParents'
            : '/sellerctr/getParents',
          {
            params: {
              cur_page: this.cur_page,
              key: this.search.key,
              value: this.search.value,
              type: this.sortkey
            }
          }
        )
        this.users = data.data.data
        this.total = data.data.total
      } catch (error) {
        console.error(error)
        this.$message.error('获取用户列表失败')
      } finally {
        this.isLoading = false
      }
    },

    handleSortChange ({ column, prop, order }) {
      console.log(column, prop, order)
      const key = SORT_MAP[prop]
      if (key == null) {
        throw new Error('sort key not found')
      }

      if (order === 'ascending') {
        this.sortkey = key + 10
      } else if (order === 'descending') {
        this.sortkey = key
      } else {
        this.sortkey = null
      }
    },

    handleClearSearch () {
      this.search.value = ''
      this.cur_page = 1
      this.getUser()
    },

    async handleSearch () {
      this.cur_page = 1
      this.getUser()
    },

    openScoreDialog (user) {
      this.dialogVisible = true
      this.dialogUser = user
      this.dialogScore = 0
    },

    closeScoreDialog () {
      this.dialogVisible = false
      this.dialogUser = null
      this.dialogScore = 0
    },

    changeScore (method = 'add') {
      if (method !== 'add' && method !== 'sub') {
        throw new TypeError('error type value')
      }
      if (!this.dialogUser || !this.dialogScore) return

      this.dialogLoading = true

      return Axios.post(`/sellerctr/${method}Score`, {
        parents_id: this.dialogUser.id,
        score: this.dialogScore
      })
        .then(() => {
          this.$message.success('修改积分成功')
          this.closeScoreDialog()
          // refresh
          this.getUser()
        })
        .catch(e => {
          console.error(e)
          this.$message.error('修改积分失败')
        })
        .finally(() => {
          this.dialogLoading = false
        })
    }
  }
}
</script>
