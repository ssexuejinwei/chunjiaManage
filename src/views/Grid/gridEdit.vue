<template>
  <div class="gridEditInfo">
    <page-header title="网格详细信息" />
    <el-page-header @back="goBack" />
    <br>
    <br>
    <el-container style="width: 100%;">
        <el-main>
        <el-form
          ref="form"
          class="form"
          :model="grid"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item label="网格">
            <el-input v-model="grid.name" />
          </el-form-item>
          <el-form-item label="网格长">
            <el-select v-model="form.admin_id" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <el-button type="primary" @click="isChoose=true">选择候选人员</el-button>
          </el-form-item>
          <el-form-item label="网格员">
            <el-select v-model="form.member_id" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="居民组长">
            <el-select v-model="form.leader_id" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="辅警">
            <el-select v-model="form.police_id" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="党员先锋户">
            <el-select v-model="form.pioneer_id" placeholder="请选择">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
          </el-form-item>
          <el-form-item size="large">
            <el-button @click="save" type="success">
              保存
            </el-button>
          </el-form-item>
        </el-form>
        </el-main>
    </el-container>
    <el-dialog
      title="人员信息"
      :visible.sync="isChoose "
    >
      <el-table
        :data="UserTableData"
        highlight-current-row
        :border="true"
      >
        <el-table-column
          type="selection"
        />
        <el-table-column
          prop="name"
          label="姓名"
          align="center"
        />
        <el-table-column
          label="性别"
          align="center"
        >
          <template slot-scope="scope">
            <span v-if="scope.row.sex==1">男</span>
            <span v-if="scope.row.sex==0">女</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone_number"
          label="联系电话"
          align="center"
        />
        <el-table-column
          prop="politics_status"
          label="政治面貌"
          align="center"
        />
        <el-table-column
          prop="address"
          label="住址"
          align="center"
        />
        <el-table-column
          prop="grid"
          label="所属网格"
          align="center"
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="medium"
              @click="handleChoose(scope.$index,scope.row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right;">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :current-page.sync="cur_page"
        />
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button @click="isChoose = false">取 消</el-button>
          <el-button type="primary" @click="isChoose=false">确 定</el-button>
      </span>
    </el-dialog>
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
    grid: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      UserTableData:[],
      isChoose:false,
      defaultgrid:{},
      total_page:100,
      cur_page:1,
      options:[],
      form:{},
    }
  },
  created () {
    this.form = {
      grid_id:this.grid.id,
      name:this.grid.name,
      admin_id:0,
      member_id:0,
      leader_id:0,
      police_id:0,
      pioneer_id:0
    }
  },
  watch: {
    cur_page(newValue, oldValue) {
      this.getData()
    }
  },
  methods: {
    handleChoose(index,row) {
      this.options.push({
        value:this.UserTableData[index].id,
        label:this.UserTableData[index].name
      })
    },
    getData () {
      Axios.get('getUser', {
        params: {
          page_index: this.cur_page,
        }
      }).then(response => {
        this.UserTableData = response.data.data.list
        this.total = response.data.data.page_number
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取用户列表失败: ${e.message || '未知错误'}`)
        this.UserTableData = []
        this.total_page = 0
      }).finally(() => { this.loading = false })
    },
    save () {
      //调API
      Axios.post('/updateGrid', qs.stringify(this.form))
        .then(() => {
          this.$alert('保存成功', '成功').then(() => {
            this.$emit('update', true)
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '保存失败')
        })
      this.$emit('update', true)
    },
    goBack() {
      this.$emit('back', false)
    }
  }
}
</script>

<style lang="scss">
</style>
