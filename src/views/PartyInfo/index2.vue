<template>
  <div>
    <div v-if='!isEdit' class ='PartyStylelist'>
      <page-header title="党员风采信息管理"/>
      <el-container>
        <el-main>
          <el-table
            :data="PartyStyleTableData"
            @selection-change="handleSelect"
            highlight-current-row
            :border="true"
          >
            <el-table-column
              type="selection"
            />
            <el-table-column
              prop="name"
              label="名称"
              align="center"
            />
            <!-- <el-table-column
              prop="grid"
              label="所属网格"
              align="center"
            >
            <template slot-scope="scope" v-for="(value,index) in gridOptions">
              <span v-if="PartyStyleTableData[scope.$index].">{{options}}</span>
            </template>
            </el-table-column> -->
            <el-table-column
              prop="deed"
              label="先进事迹"
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
          <el-row style="margin-top:1.5rem; ">
            <el-col :span="3">
              <el-button @click='isAdd = true'>添加风采</el-button>
            </el-col>
            <el-col :span="5">
              <el-button @click="deletePartyStyles">
                删除风采
              </el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
      <el-dialog
        title="风采信息"
        :visible.sync="isAdd "
      >
        <el-form
          :model="PartyStyleForm"
          label-width="100px"
          style="width:31.25rem;"
        >
          <el-form-item
            label="名称"
            prop="name"
          >
            <el-input
              v-model="PartyStyleForm.name"
              autocomplete="off"
            />
          </el-form-item>
          <!-- <el-form-item
            label="所属网格"
          >
          <el-select v-model="PartyStyleForm.grid_id" placeholder="请选择">
              <el-option
                v-for="item in gridOptions"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item
            label="先进事迹"
            prop="deed"
          >
          <el-input type="textarea" rows="15" v-model="PartyStyleForm.deed"></el-input>
          </el-form-item>
          <!-- <el-form-item label="照片">
            <el-upload
              class="upload-demo"
              action="#"
              :http-request="handleUpload"
              :on-success="handleUploadSuccess"
              :on-change="handleUploadChange"
              :file-list="fileList"
              list-type="picture">
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-form-item> -->
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isAdd = false">取 消</el-button>
            <el-button type="primary" @click="addPartyStyle">确 定</el-button>
          </span>
        </el-dialog>
    </div>
    <div v-if="isEdit" class ='PartyStyleInfo'>
      <PartyStyleEdit :PartyStyle='PartyStyle' @update="handleEditFinish" @back="backHome"></PartyStyleEdit>
    </div>
  </div>
</template>

<script>
  //这里的跳转有问题
import PartyStyleEdit from './components/partyStyleEdit'
import Axios from 'axios'
import qs from 'qs'
export default {
  components: {
    PartyStyleEdit
  },
  data () {
    return {
      api:'/api/community/manage/party_style/',
      api_grid:'/api/user/manage/info_list/',
      PartyStyle:{},
      isEdit: false,
      isAdd: false,
      PartyStyleTableData:[],
      PartyStyleForm:{},
      gridOptions:[],
      fileList:{},
      selectedPartyStyles:[]
    }
  },
  created () {
    // this.getGridItem()
    this.getData()
  },
  methods: {
    getGridItem() {
      Axios.get(this.api_grid).then(response => {
        this.gridOptions = this.response.data.data.grid
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
      }).finally(() => { console.log('1') })
    },
    getData () {
      Axios.get(this.api).then(response => {
        console.log(response)
        this.PartyStyleTableData = response.data.data
      }).catch(e => {
        console.error(e)
        this.$message.error(`获取信息列表失败: ${e.message || '未知错误'}`)
        this.PartyStyleTableData = []
      }).finally(() => { this.loading = false })
    },
    handleEditFinish (val) {
      if (val) {
        //获取新数据
        this.getData()
        this.isEdit = false
      }
    },
    backHome (val) {
      this.isEdit = val
      this.getData()
    },
    handleEdit(index,row) {
      this.isEdit = true
      this.PartyStyle = 
      this.PartyStyle = {
        ...this.PartyStyleTableData[index],
        options:this.gridOptions
      }
      console.log(index,row)
    },
    addPartyStyle() {
      console.log(this.PartyStyleForm)
      Axios.post(this.api,qs.stringify({
        ...this.PartyStyleForm,
      }))
        .then(() => {
          this.$alert('添加成功', '成功').then(() => {
            this.getData()
            this.isAdd = false
          })
        }).catch(e => {
          console.error(e)
          this.$alert(`错误原因: ${e.message || '未知错误'}`, '添加失败')
        })
    },
    deletePartyStyle (PartyStyle) {
      console.log('PartyStyle', PartyStyle)
      const data = {
        id: PartyStyle.id
      }
      return Axios.delete(this.api, {data:qs.stringify(data)})
    },
    deletePartyStyles () {
      this.$confirm('是否删除选中的风采', '提示', { type: 'warning' }).then(() => {
        Promise.all(this.selectedPartyStyles.map(this.deletePartyStyle))
          .then(() => this.$alert('删除成功', '成功', { type: 'success' }) .then(()=>{
            this.getData()
          }), (e) => {
            this.$alert('删除失败', '错误', { type: 'error' })
          })
         
      })
    },
    handleSelect (val) {
      this.selectedPartyStyles = val
    },
    handleUpload (param) {
      const file = param.file
      this.PartyStyleForm.images.push(file)
    //   const formData = new FormData()
    //   formData.append('image_url', file)
    
    //   return Axios.post('/sellerctr/save', formData, {
    //     onUploadProgress: param.onProgress
    //   })
    },
    handleUploadSuccess (res, rawFile) {
      if (res?.data?.data?.fileName) {
        rawFile.url = process.env.VUE_APP_UPLOAD_PUBLIC_URL + res?.data?.data?.fileName
      }
    },
    handleUploadChange (file, fileList) {
      this.fileList = fileList
    }
  }
}
</script>

<style lang="scss">
</style>
