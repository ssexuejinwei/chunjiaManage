<template>
  <div class="activity">
    <page-header title="全店活动" />
    <div
      v-loading="isLoading"
      class="content"
    >
      <div class="type">
        <el-radio-group v-model="type">
          <el-radio-button label="0">
            全部活动
          </el-radio-button>
          <el-radio-button label="1">
            报名中
          </el-radio-button>
          <el-radio-button label="2">
            报名结束
          </el-radio-button>
          <el-radio-button label="3">
            进行中
          </el-radio-button>
          <el-radio-button label="4">
            活动结束
          </el-radio-button>
          <el-radio-button label="5">
            未上架
          </el-radio-button>
        </el-radio-group>
      </div>
      <div class="list">
        <router-link
          v-for="(activity) in activities"
          :key="activity.id"
          class="list-item"
          :to="'/activity/'+activity.id"
        >
          <a-card
            :start="activity.activity_start_time"
            :end="activity.activity_end_time"
            :count="activity.apply_num"
            :capacity="activity.people_num"
            :score="activity.score"
            :status="activity.status"
            :img="activity.coverimage"
          />
        </router-link>
        <router-link
          class="list-item"
          to="/activity/add"
        >
          <a-card-add />
        </router-link>
        <!--占位-->
        <i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i /><i />
      </div>
      <div class="pagination">
        <el-pagination
          layout="prev, pager, next"
          :total="total"
          :current-page.sync="cur_page"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Axios from 'axios'
import ACard from './components/card'
import ACardAdd from './components/card-add'

export default {
  components: { ACard, ACardAdd },
  data () {
    return {
      type: 0,
      cur_page: 1,
      total: 0,
      activities: [],
      isLoading: false
    }
  },

  computed: {
    query () {
      return [this.cur_page, this.type].join()
    }
  },

  watch: {
    query () {
      this.getActivites()
    }
  },

  created () {
    this.getActivites()
  },

  methods: {
    async getActivites () {
      this.isLoading = true
      try {
        const { data } = await Axios.get('/sellerctr/getActivity', {
          params: {
            type: this.type,
            cur_page: this.cur_page
          }
        })
        this.activities = data.data.data
        this.total = data.data.total
      } catch (error) {
        console.log(error)
        this.$message.error('获取活动失败')
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.content {
  // display: flex;
}

.type {
  margin-bottom: 1em;
}

.list {
  $gap: 1rem;

  display: flex;
  flex-wrap: wrap;

  justify-content: space-between;

  margin-left: -$gap;
  margin-right: -$gap;

  &-item {
    width: 150px;
    margin: 0 $gap $gap;

    text-decoration: none;
    color: initial;
  }

  > i {
    width: 150px;
    margin: 0 $gap 0;
  }
}

</style>
