<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>放映厅列表</el-breadcrumb-item>
      <el-breadcrumb-item>配置座位模板</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 配置座位模板内容 -->
    <el-container>
      <el-aside>
        <!-- 配置时间线 -->
        <el-timeline>
          <!-- 第一步 -->
          <el-timeline-item>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>编辑坐标系</span>
              </div>
              <el-form label-width="60px">
                <el-form-item label="行数">
                  <el-input
                    v-model="rows"
                    placeholder="请输入行数"
                    size="small"
                  ></el-input>
                </el-form-item>
                <el-form-item label="列数">
                  <el-input
                    v-model="cols"
                    placeholder="请输入列数"
                    size="small"
                  ></el-input>
                </el-form-item>
                <el-button
                  @click="step1()"
                  type="primary"
                  plain
                  style="width: 100%"
                  size="small"
                  >生成座位模板</el-button
                >
              </el-form>
            </el-card>
          </el-timeline-item>
          <!-- 第二步 -->
          <el-timeline-item>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>选择座位区域（框选）</span>
              </div>
              <el-button
                type="primary"
                plain
                style="width: 100%"
                size="small"
                @click="step2()"
                >撤销选中</el-button
              >
            </el-card>
          </el-timeline-item>
          <!-- 第三步 -->
          <el-timeline-item>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>选择座位类型</span>
              </div>
              <el-button
                type="primary"
                plain
                style="width: 100%"
                size="small"
                @click="step3_1()"
                >普通座位</el-button
              >
              <br />
              <el-button
                type="primary"
                plain
                style="width: 100%"
                size="small"
                @click="step3_2()"
                >过道</el-button
              >
            </el-card>
          </el-timeline-item>
          <!-- 第四步 -->
          <el-timeline-item>
            <el-card class="box-card">
              <div slot="header" class="clearfix">
                <span>确认模板</span>
              </div>
              <el-button
                type="success"
                style="width: 100%"
                size="small"
                @click="step4()"
                >选好了</el-button
              >
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-aside>
      <el-main>
        <div class="tip" style="">
          <div class="tip-item" style="background: #36d6"></div>
          未选择座位 &nbsp;&nbsp;
          <div class="tip-item" style="background: #36d"></div>
          已选择座位&nbsp;&nbsp;
          <div class="tip-item" style="background: #a11"></div>
          普通座位&nbsp;&nbsp;

          <div class="tip-item" style="background: #3333"></div>
          过道
        </div>
        <el-divider></el-divider>
        <el-divider>电影荧屏</el-divider>

        <canvas id="canvas"></canvas>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import SeatSelector from "@/libs/SeatSelector.js";
export default {
  data() {
    return {
      rows: 0,
      cols: 0,
      seatSelector: null, //座位模板对象
      id: this.$route.params.id, //放映厅id
    };
  },
  methods: {
    /** 点击生成座位模板 */
    step1() {
      let row = parseInt(this.rows);
      let col = parseInt(this.cols);
      this.seatSelector = new SeatSelector(row, col, "canvas"); //创建SeatSelector对象，传入行数，列数，canvas
      this.seatSelector.draw(); //将座位模板绘制在canvas
    },
    /**撤销选中 */
    step2() {
      if (this.seatSelector) {
        this.seatSelector.setNoSelect();
      }
    },
    /**设置座位为普通座位 */
    step3_1() {
      if (this.seatSelector) {
        this.seatSelector.setSelectedSeatToNormalSeats();
      }
    },
    /**设置座位为过道 */
    step3_2() {
      if (this.seatSelector) {
        this.seatSelector.setSelectedSeatToGangway();
      }
    },
    /**选好了 */
    step4() {
      if (this.seatSelector) {
        try {
          let seat_template = this.seatSelector.getSeatTemplateJsonString();
          console.log(seat_template);
          let room_size = this.seatSelector.getSeatCount();
          let id = this.id;
          //发送请求，更新座位模板
          this.$http.CinemaRoomApi.updateSeatTemplate({
            id,
            seat_template,
            room_size,
          }).then((res) => {
            console.log("更新座位模板", res);
            if (res.data.code == 200) {
              this.$message.success("更新座位模板完成");
              this.$router.go(-1);
            }
          });
        } catch (error) {
          this.$message.error(error);
        }
      }
    },
  },

  mounted() {},
};
</script>
<style scoped>
#canvas {
  border: 1px dashed #999;
  border-radius: 4px;
  display: none;
  margin: 0 auto;
  /* width: 200px;
  height: 220px; */
}
.tip {
  text-align: center;
  margin-bottom: 20px;
}
.tip-item {
  display: inline-block;
  width: 20px;
  height: 20px;
  vertical-align: middle;
}
</style>

