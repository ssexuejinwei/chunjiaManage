<template>
  <div>
    <el-container>
      <el-main>
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
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                size="medium"
                @click="handleEdit(scope.$index,scope.row)"
              >
                修改
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
              @click="deleteUsers"
            >
              删除用户
            </el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </div>
</template>

<script>
export default {
  data () {
    return {
      UserTableData:[
        {
          name:'张三',
          sex:'男',
          age:'38',
          tel:'1382831391'
        },
        {
          name:'李四',
          sex:'女',
          age:'32',
          tel:'1382831312'
        },
        {
          name:'王五',
          sex:'女',
          age:'22',
          tel:'1362734391'
        },
        {
          name:'叶六',
          sex:'男',
          age:'2',
          tel:'138415991'
        }
      ]
    }
  },
  created () {
  },
  methods: {
    handleEdit(index,row) {
      console.log(index,row)
    },
    deleteUsers(){
      
    }
  }
}
</script>

<style lang="scss">
$Green: #69bc38;
$Gray: #cdcdcb;
$Red : #92535e;
$pink : #FE8083;
.teachHeader  {
  padding: 0.5rem 1rem;
  margin-bottom: 2rem;
  background: $pink;
  display: flex;
  justify-content: space-between;

  a {
    color: inherit;
    text-decoration: none;
  }

  h1 {
    font-size: 1rem;
    margin: 0;
  }
}
  .chooseMenu{
    margin-left: 1.25rem;
    width:12.5rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
  }
  .chooseMenu .el-menu-item.is-active {
    background-color: $Green ;
    font-size: x-large !important;
    border: 1px solid !important;
  }
</style>
