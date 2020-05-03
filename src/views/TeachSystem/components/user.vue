<template>
  <div>
    <div
      v-if="!isEdit"
      v-loading="isLoading"
      class="User"
    >
      <page-header title="用户管理" />
      <el-container>
        <el-header>
          <el-button
            v-if="false"
            style="margin-right: 10px"
            @click="goBack"
          >
            返回全部用户
          </el-button>
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
              <el-option
                label="用户名"
                value="name"
              />
              <el-option
                label="性别"
                value="sex"
              />
              <el-option
                label="年龄"
                value="age"
              />
              <el-option
                label="电话"
                value="tel"
              />
              <el-option
                label="积分"
                value="score"
              />
              <el-option
                label="加入时间"
                value="create_time"
              />
            </el-select>
            <el-button
              slot="append"
              icon="el-icon-search"
              class="search"
              @click="handleSearch"
            />
          </el-input>
          <el-button
            v-show="search.value"
            style="margind-left: 16px"
            type="text"
            @click="handleClearSearch"
          >
            清空搜索结果
          </el-button>
        </el-header>
        <el-main>
          <el-table
            v-if="isSearch === false"
            :data="UserTableData"
            class="UserTableData"
            highlight-current-row
            :border="true"
            @sort-change="handleSortChange"
            @current-change="handleCurrentChangeTable"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="姓名"
              align="center"
              sortable="custom"
            />
            <el-table-column
              prop="sex"
              label="性别"
              align="center"
              sortable="custom"
            />
            <el-table-column
              prop="age"
              label="年龄"
              align="center"
              sortable="custom"
            />
            <el-table-column
              prop="tel"
              label="电话"
              align="center"
            />
            <el-table-column
              prop="level"
              label="等级"
              align="center"
            />
            <el-table-column
              prop="points"
              label="积分"
              align="center"
              sortable="custom"
            />
            <el-table-column
              prop="date"
              label="加入时间"
              align="center"
              sortable="custom"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  @click="handleEdit(scope.$index,scope.row)"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            v-else
            :data="UserTableData"
            class="UserTableData"
            highlight-current-row
            :border="true"
            @sort-change="handleSortChange"
            @current-change="handleCurrentChangeTable"
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
              prop="sex"
              label="性别"
              align="center"
            />
            <el-table-column
              prop="age"
              label="年龄"
              align="center"
            />
            <el-table-column
              prop="tel"
              label="电话"
              align="center"
            />
            <el-table-column
              prop="level"
              label="等级"
              align="center"
            />
            <el-table-column
              prop="points"
              label="积分"
              align="center"
            />
            <el-table-column
              prop="date"
              label="加入时间"
              align="center"
            />
            <el-table-column
              label="操作"
              align="center"
            >
              <template slot-scope="scope">
                <el-button
                  size="medium"
                  @click="handleEdit(scope.$index,scope.row)"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-main>
        <el-footer>
          <el-row>
            <el-col :span="6">
              <!-- <el-button type='danger' @click='isAdd = true'>添加新用户</el-button> -->
              <el-button
                class="delete-button"
                @click="deleteUser"
              >
                删除用户
              </el-button>
            </el-col>
            <el-col style="text-align: right;">
              <el-pagination
                :page-size="page_size"
                layout="prev, pager, next, jumper"
                :total="total"
                @current-change="handleCurrentChange"
              />
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </div>
    <div
      v-if="isEdit"
      class="userEdit"
    >
      <UserEdit
        :user="user"
        @update="handleEditFinish"
        @back="backHome"
      />
    </div>
  </div>
</template>

<script>
import UserEdit from './userEdit'
import qs from 'qs'
const SORT_MAP = {
  date: 0,
  age: 1,
  sex: 2,
  name: 3,
  points: 4
}

export default {
  components: {
    UserEdit
  },
  data () {
    return {
      isLoading: false,
      search: {
        key: 'name',
        value: ''
      },
      isSearch: false,
      sortkey: null,
      title: '更多',
      chooseID: 0,
      isChoose: false,
      user: {},
      isEdit: false,
      cur_page: 1,
      page_size: 10,
      total: 1,
      activeIndexFilter: '0',
      currentIndex: '',
      Menufilter: ['时间', '年龄', '性别'],
      UserTableData: []
    }
  },
  watch: {
    sortkey (newValue) {
      this.getUser()
    }
  },
  created () {
    this.sortkey = 0
    this.getUser()
  },
  methods: {
    goBack () {
      // this.$router.go(0)
      this.isSearch = false
      this.getUser()
      this.handleClearSearch()
    },
    handleClearSearch () {
      this.search.value = ''
      this.search.key = 'name'
      this.isSearch = false
      this.getUser()
      // @todo
    },
    handleSearch () {
      this.isLoading = true
      let value = ''
      this.isSearch = true
      if (this.search.value) {
        // 处理一下性别的
        if (this.search.key === 'sex') {
          value = this.search.value === '男' ? 0 : 1
        }
        const api = '/sellerctr/searchParents'
        this.$axios.get(api, {
          params: {
            cur_page: 1,
            key: this.search.key,
            value: value === '' ? this.search.value : value
          }
        }).then((response) => {
          const list = response.data.data.data
          this.total = response.data.data.total
          this.UserTableData = []
          for (const user of list) {
            const obj = {
              id: parseInt(user.id),
              nickName: user.nick_name,
              wechat: user.open_id,
              name: user.name,
              date: user.create_time.split(' ')[0],
              sex: String(user.sex) === '0' ? '男' : '女',
              tel: user.tel,
              points: user.score,
              age: user.age,
              level: 'Lv ' + (user.level + 1),
              avatar: user.avatar == null ? '' : user.avatar
            }
            this.UserTableData.push(obj)
            this.activeIndexFilter = ''
          }
          this.isLoading = false
        }).catch(() => {
          this.$alert('error')
        })
      }
      // @todo
    },
    handleEditFinish (val) {
      if (val) {
        this.getUser(this.currentIndex)
      }
    },
    handleEdit (index, row) {
      console.log(index, row)
      for (const user of this.UserTableData) {
        if (user.id === row.id) {
          this.user = user
          break
        }
      }
      this.isEdit = true
    },
    backHome (val) {
      this.isEdit = val
    },
    getUser () {
      this.isLoading = true
      const api = 'sellerctr/getParents'
      this.$axios.get(api, {
        params: {
          cur_page: this.cur_page,
          type: this.sortkey
        }
      }).then((response) => {
        const list = response.data.data.data
        this.total = response.data.data.total
        this.UserTableData = []
        for (const user of list) {
          const obj = {
            id: parseInt(user.id),
            nickName: user.nick_name,
            wechat: user.open_id,
            name: user.name,
            date: user.create_time.split(' ')[0],
            sex: String(user.sex) === '0' ? '男' : '女',
            tel: user.tel,
            points: user.score,
            age: user.age,
            level: 'Lv ' + (user.level + 1),
            avatar: user.avatar == null ? '' : user.avatar
          }
          this.UserTableData.push(obj)
        }
        this.isLoading = false
      })
    },
    handleSortChange ({ column, prop, order }) {
      console.log(column, prop, order)
      const key = SORT_MAP[prop]
      if (key === null) {
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
    handleCurrentChange (val) {
      this.cur_page = val
      this.getUser()
    },
    handleSelect (key) {
      this.currentIndex = key
      this.title = this.Menufilter[key]
      this.getUser(key)
    },
    handleCurrentChangeTable (val) {
      this.chooseID = val.id
      this.isChoose = true
    },
    deleteUser () {
      if (this.isChoose) {
        this.$confirm('确认删除该用户?', '', {
          cancelButtonText: '返回',
          confirmButtonText: '确定',
          type: 'warning'
        }).then(() => {
          const api = '/sellerctr/deleteParents'
          var data = {
            id: this.chooseID
          }
          this.$axios.post(api, qs.stringify(data)
          ).then(() => {
            this.$alert('删除成功', {
              confirmButtonText: '确定'
            }).then(() => {
              this.getUser(this.currentIndex)
            })
          }).catch(() => {
            this.$alert('删除失败')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
      } else {
        this.$alert('请先选择用户', {
          confirmButtonText: '确定'
        })
      }
    }
  }
}

</script>

<style lang="scss">
  $Green: #69bc38;
  $Gray: #cdcdcb;
  $Red : #92535e;
  $pink : #FE8083;
 .User{
   .el-container{
     .el-header{
       .el-menu{
          .el-menu-item.is-active{
             background-color: #52bcf0;
             border-color:#52bcf0  ;
           }
           .el-submenu{
             .el-submenu .is-active{
               background-color: #52bcf0;
               border-color:#52bcf0  ;
             }
             .el-menu-item.is-active{
                background-color: #52bcf0;
                border-color:#52bcf0  ;
              }
           }

       }
       .el-input{
         border-color:#52bcf0 ;
       }
       .search{
          color:#FFFFFF;
          background-color: #52bcf0;
       }
     }
     .el-main{
       .el-table{
         .el-button{
           color:#52bcf0 ;
           border-color: #52bcf0;
         }
       }
     }
     .el-footer{
       .el-button{
         color: #fa7959;
         background-color: #FFFFFF;
         border-color:#fa7959 ;
       }
     }
   }
 }
</style>
