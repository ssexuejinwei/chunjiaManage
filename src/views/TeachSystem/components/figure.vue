<template>
  <div class="figure">
    <!-- 雷达图 -->
    <div class="radarChart">
      <el-row>
        <h1>
          学年末体测成绩与测试幼儿平均成绩
        </h1>
      </el-row>
      <el-row>
        <el-col
          v-if="title.length === 1"
          :span="8"
        >
          <div
            id="radar1"
            style="width: 600px;height: 400px;"
          />
          <br>
          <el-row>
            <el-col :span="8" :offset="16">
              <span>
                {{ title[0] }}
              </span>
            </el-col>
          </el-row>
        </el-col>
        <el-col
          v-if="title.length === 2"
          :span="8"
        >
          <div
            id="radar2"
            style="width: 600px;height: 400px;"
          />
          <br>
          <p>
            {{ title[1] }}
          </p>
        </el-col>
        <el-col
          v-if="title.length === 3"
          :span="8"
        >
          <div
            id="radar3"
            style="width: 600px;height: 400px;"
          />
          <br>
          <p>
            {{ title[2] }}
          </p>
        </el-col>
      </el-row>
    </div>
    <!-- 直方图 -->
    <div v-if="false" class="histogram">
      <el-row>
        <h1>
          全学年健康数据（幼儿个人）
        </h1>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-image
            style="width: 100px; height: 100px"
            :src="imgUrl"
          />
          <br>
        </el-col>
        <el-col :span="12">
          <el-image
            style="width: 100px; height: 100px"
            :src="imgUrl"
          />
          <br>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-image
            style="width: 100px; height: 100px"
            :src="imgUrl"
          />
          <br>
        </el-col>
        <el-col :span="12">
          <el-image
            style="width: 100px; height: 100px"
            :src="imgUrl"
          />
          <br>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import echarts from 'echarts'

export default {
  props: {
    star: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      charts: '',
      title: [],
      title1: '',
      title2: '',
      title3: '',
      opinionData: [
        {
          value: [],
          name: '最高'
        },
        {
          value: [],
          name: '平均'
        }
      ],
      indicator: [],
      indicatorBody: [
        { name: '速度', max: 4 },
        { name: '柔韧', max: 4 },
        { name: '平衡', max: 4 },
        { name: '协调', max: 4 },
        { name: '灵敏', max: 4 },
        { name: '力量', max: 4 }
      ],
      indicatorTechnical: [
        { name: '独立', max: 4 },
        { name: '团结', max: 4 },
        { name: '尊重', max: 4 },
        { name: '友爱', max: 4 },
        { name: '专注', max: 4 }
      ],
      indicatorSense: [
        { name: '独立', max: 4 },
        { name: '团结', max: 4 },
        { name: '尊重', max: 4 },
        { name: '友爱', max: 4 },
        { name: '专注', max: 4 },
        { name: '谦虚', max: 4 }
      ],
      imgUrl: 'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
    }
  },
  created () {
    const maxStar = this.star.star_max
    const avgStar = this.star.star_ave
    const star = []
    for (let i = 0; i < maxStar.length; i++) {
      if (maxStar[i].id === avgStar[i].id) {
        star.push({
          id: maxStar[i].id,
          name: maxStar[i].name,
          title: maxStar[i].title,
          max: maxStar[i].score,
          avg: avgStar[i].score
        })
      }
    }
    const b = {}
    star.forEach(v => {
      b[v.title] || (b[v.title] = [])
      b[v.title] && b[v.title].push(v)
    })
    let i = 0
    this.opinionData = [
      {
        value: [],
        name: '最高'
      },
      {
        value: [],
        name: '平均'
      }
    ]
    for (const key of Object.keys(b)) {
      this.indicator.push([])
      this.title.push(b[key][0].title)
      for (const item of b[key]) {
        this.indicator[i].push({
          name: item.name,
          max: 5
        })
        this.opinionData[0].value.push(item.max)
        this.opinionData[1].value.push(item.avg)
      }
      i++
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.drawPie('radar1')
      this.drawPie('radar2')
    })
  },
  methods: {
    drawPie (id) {
      this.charts = echarts.init(document.getElementById(id))
      this.charts.setOption({
        title: {
          text: '',
          padding: [4, 4, 4, 4]
        },
        tooltip: {},
        legend: {
          data: ['最高', '平均']
        },
        radar: {
          // shape: 'circle',
          name: {
            textStyle: {
              color: '#000',
              backgroundColor: '#fff',
              borderRadius: 3,
              padding: [1, 2]
            }
          },
          indicator: this.indicator[Number(id.split('radar')[1]) - 1]
        },
        series: [{
          name: '',
          type: 'radar',
          // areaStyle: {normal: {}},
          data: this.opinionData
        }]
      })
    },
    getRadarChart () {

    },
    getHistogram () {

    }
  }
}
</script>

<style lang="scss">
  .figure{
    .radarChart{
      h1{
        text-align: center;
      }
      p{
        text-align:center;
      }
    }
    .histogram{
      h1{
        text-align: center;
      }
    }
  }

</style>
