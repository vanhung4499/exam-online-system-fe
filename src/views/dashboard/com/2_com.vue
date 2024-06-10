<template>
  <div>
    <div style="display: flex; justify-content: center; margin-top: 3em">
      <div class="left">
        <el-card class="box-card">
          Login Duration
          <div ref="charts" class="chart-div" />
        </el-card>
      </div>
      <div class="right">
        <el-card class="box-card">
          Latest Announcements
          <div v-infinite-scroll="load" style="overflow: auto">
            <el-collapse v-model="activeNames" @change="handleChange" accordion>
              <div v-for="(item, index) in data.records">
                <el-collapse-item :title="item.title" :name="index">
                  <div v-html="item.content"></div>
                  <div class="noticeContent">
                    <div>{{ item.realName }}</div>
                    <div>{{ item.createTime }}</div>
                  </div>
                </el-collapse-item>
              </div>
            </el-collapse>
          </div>

          <!-- <div>
            <el-pagination small layout="prev, pager, next" :total="50"> </el-pagination>
          </div> -->
        </el-card>
      </div>
    </div>
  </div>
</template>

<script>
import { noticeGetNew } from '@/api/notice'
import { getDaily } from '@/api/stat'
export default {
  data() {
    return {
      // Pagination properties
      pageNum: 1,
      pageSize: 10,

      // Data for the chart
      data: {}, // Placeholder for chart data
      dateArray: [], // Array to store dates
      formattedData: [], // Placeholder for formatted data used in the chart

      // Chart configuration options
      option: {
        // Chart title (commented out, can be uncommented if needed)
        // title: { text: '登录时长' },

        // Tooltip configuration
        tooltip: {},

        // X-axis configuration
        xAxis: {
          data: [] // Initialized as empty, later filled with dateArray
        },

        // Y-axis configuration
        yAxis: {},

        // Series configuration
        series: [
          {
            name: 'Login duration (minutes)', // Series name (can be updated to match unit changes)
            type: 'bar',
            data: [] // Initialized as empty, later filled with converted minute data
          }
        ]
      },

      // Default props for the tree component
      defaultProps: {
        children: 'children',
        label: 'label'
      }
    };
  },
  created() {
    this.getDailyFun()

    this.getNotice(this.pageNum, this.pageSize)
  },

  mounted() {
    this.initCharts()
  },

  methods: {
    // Get login duration
    getDailyFun() {
      getDaily().then((res) => {
        if (res.code === 1) {
          const currentDate = new Date();
          // Calculate the date 15 days ago
          const fifteenDaysAgo = new Date(
            currentDate.getTime() - 15 * 24 * 60 * 60 * 1000
          );

          // Generate an array of dates from today to 15 days ago
          for (let i = 0; i <= 14; i++) {
            const date = new Date(currentDate.getTime() - i * 24 * 60 * 60 * 1000);
            this.dateArray.push(date.toISOString().split("T")[0]);
          }
          // Ensure dateArray is in reverse order
          this.dateArray.reverse();

          // Organize the raw data, ensuring that each date has a record, and fill in 0 if there's none
          const dataMap = res.data.reduce((acc, item) => {
            acc[item.loginDate] = item.totalSeconds;
            return acc;
          }, {});

          this.formattedData = this.dateArray.map((date) => {
            const secondsOnDate = dataMap[date] || 0;
            return secondsOnDate / 60; // Convert seconds to minutes
          });

          // Update chart configuration
          this.option.xAxis.data = this.dateArray;
          this.option.series[0].data = this.formattedData;
          this.$nextTick(() => {
            this.initCharts(); // Ensure the DOM is updated before initializing the chart
          });
        }
      });
    },

    // Pagination query
    async getNotice(pageNum, pageSize) {
      const params = { pageNum: pageNum, pageSize: pageSize };
      const res = await noticeGetNew(params);
      this.data = res.data;
      // this.transformData(res);
      // console.log("this.data", this.data);
    },
    initCharts() {
      const myChart = this.$echarts.init(this.$refs.charts);
      // Draw the chart
      myChart.setOption(this.option);
    },
    handleNodeClick(data) {
      // console.log(data);
    },
  },
}
</script>
<style>
.luang {
  margin: auto;
  width: 1100px;
  height: 100vh; /* 100px */
  background-color: rgb(241, 218, 221);
  margin-top: 30px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);
}

.box-card {
  margin-top: 50px;
  width: 60vh;
  height: 60vh;
  margin-left: 85px;
}
.chart-div {
  margin-top: 10px;
  width: 100%;
  height: 50vh;
  border: solid black 1px;
}
.i {
  margin-top: 10px;
  height: 60vh;
  overflow-y: auto; /* Enable vertical scrollbar */
  max-height: 300px; /* Specify maximum height, adjust as needed */
}

.el-tree-node__content {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  height: 47px;
  cursor: pointer;
}
.noticeContent {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-left: 20px;
}
</style>
