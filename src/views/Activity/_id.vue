<template>
  <div>
    <page-header title="活动详情" back />

    <div v-loading="isLoading">
      <div style="margin-bottom: 16px">
        <el-button style="margin-right: 16px" @click="parentDialog = true">
          查看报名用户
        </el-button>
        <a :href="'/api/sellerctr/getFileByActivityId?id='+id" download style="margin-right: 16px">
          <el-button>下载报名信息</el-button>
        </a>

        <el-button type="danger" @click="handleDelete">
          删除活动
        </el-button>
      </div>
      <act-form
        v-if="origin"
        submit-text="修改活动"
        :origin="origin"
        @submit="onSubmit"
      />
    </div>

    <el-dialog title="报名用户" :visible.sync="parentDialog">
      <el-table :data="parents">
        <el-table-column label="id" prop="id" width="50" />
        <el-table-column label="姓名" prop="name" width="120" />
        <el-table-column label="年龄" prop="age" width="50" />
        <el-table-column label="联系方式" prop="tel" />
        <el-table-column label="报名时间" prop="create_time" />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-popconfirm title="是否取消该用户报名？" @onConfirm="handleCancel(scope.row.id, scope.row.parents_id)">
              <el-button slot="reference" type="danger" size="mini">
                取消报名
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import Axios from 'axios'
import qs from 'querystring'
import ActForm from './components/form'

export default {
  components: { ActForm },
  data () {
    return {
      id: this.$route.params.id,
      origin: null,
      isLoading: false,

      parentDialog: false,
      cur_page: 1,
      parents: []
    }
  },

  created () {
    this.getActivity()

    this.getParents()
  },

  methods: {
    getActivity () {
      this.isLoading = true
      Axios.get('/sellerctr/getActivityById', {
        params: { id: this.id }
      }).then(({ data }) => {
        this.origin = data.data
      }).catch((e) => {
        this.$message.error(`获取活动信息失败: ${e.message || '未知错误'}`)
        console.error(e)
      }).finally(() => {
        this.isLoading = false
      })
    },

    getParents () {
      Axios.get('/sellerctr/getParentsByActivityId', { params: { id: this.id, cur_page: this.cur_page } })
        .then(({ data }) => {
          this.parents = data.data
        }).catch((e) => {
          console.error(e)
          this.$message.error('修改失败: ' + e.message)
        })
    },

    onSubmit (formData) {
      Axios.post('/sellerctr/updateActivity', qs.stringify({
        id: this.id,
        ...formData
      })).then(() => {
        this.$message.success('修改成功')
      }).catch(e => {
        console.error(e)
        this.$message.error('修改失败: ' + e.message)
      })
    },

    handleCancel (activity_apply_id, parents_id) {
      Axios
        .post('/sellerctr/cancelActivity', { activity_id: this.id, activity_apply_id, parents_id })
        .then(this.getParents)
    },

    handleDelete () {
      this.$confirm('是否删除该活动', '提示', { type: 'warning' })
        .then(() => {
          Axios.post('/sellerctr/deleteActivity', { id: this.id })
            .then(() => {
              this.$message.success('删除成功')
              this.$router.back()
            })
            .catch(e => {
              console.error(e)
              this.$message.error('删除失败, ' + e.message)
            })
        })
        .catch(() => {})
    }
  }
}
</script>
