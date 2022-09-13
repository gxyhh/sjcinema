<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
      <el-breadcrumb-item>放映厅列表</el-breadcrumb-item>
      <el-breadcrumb-item>排片计划列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <p>
      <span style="color: #409eff; font-weight: bold"
        >{{ cinemaRoomInfo.cinema_name }} </span
      >的
      <span style="color: #409eff; font-weight: bold"
        >{{ cinemaRoomInfo.cinema_room_name }}（{{
          cinemaRoomInfo.cinema_room_type
        }}）</span
      >排片计划
    </p>
    <el-divider></el-divider>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="title" label="电影名称" width="180">
      </el-table-column>
      <el-table-column prop="showingon_date" label="放映时间" width="180">
      </el-table-column>
      <el-table-column prop="showingon_time" label="场次" width="120">
      </el-table-column>
      <el-table-column prop="price" label="票价" width="120"> </el-table-column>
      <el-table-column prop="status" label="是否已发布" width="120">
        <template slot-scope="scope">
          <el-switch
            active-value="1"
            inactive-value="0"
            v-model="scope.row.status"
            @change="changeStatus(scope.row.plan_id, scope.row.status)"
          >
          </el-switch
        ></template>
      </el-table-column>
      <el-table-column prop="title" label="操作" width="180">
        <template slot-scope="scope">
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            title="删除排片"
            @click="delPlan(scope.row.plan_id)"
          ></el-button
        ></template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
export default {
  data() {
    return {
      cinema_room_id: this.$route.params.id,
      cinemaRoomInfo: {},
      tableData: [], //拍片计划
    };
  },
  methods: {
    changeStatus(id, val) {
      if (val == 0) {
        this.noPublishPlan(id);
      } else {
        this.publishPlan(id);
      }
    },
    /**
     * 将排片计划设置为未发布
     */
    noPublishPlan(id) {
      this.$http.ShowingonPlanApi.noPublish({ id }).then((res) => {
        console.log("设置排片计划未发布", res);
        if (res.data.code == 200) {
          this.$message.warning("已经成功阻止该计划的发布");
        }
      });
    },

    /**
     * 发布排片计划
     */
    publishPlan(id) {
      this.$http.ShowingonPlanApi.publish({ id }).then((res) => {
        console.log("发布排片计划", res);
        if (res.data.code == 200) {
          this.$message.success("该计划成功发布");
        }
      });
    },

    /**
     * 删除排片计划
     */
    delPlan(id) {
      this.$http.ShowingonPlanApi.delete({ id }).then((res) => {
        console.log("删除排片计划", res);
        if (res.data.code == 200) {
          this.$message.success("删除该计划成功");
          this.loadShowingonPlans();
        }
      });
    },

    // 加载放映厅基本信息
    loadCurrentCinemaRoom() {
      this.$http.CinemaRoomApi.queryById({ id: this.cinema_room_id }).then(
        (res) => {
          console.log("加载放映厅的基本信息", res);
          if (res.data.code == 200) {
            this.cinemaRoomInfo = res.data.data;
          }
        }
      );
    },
    //加载当前放映厅排片计划
    loadShowingonPlans() {
      this.$http.ShowingonPlanApi.queryByRoomId({
        room_id: this.cinema_room_id,
      }).then((res) => {
        console.log("加载当前放映厅排片计划表", res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
    },
  },
  mounted() {
    // 加载放映厅基本信息
    this.loadCurrentCinemaRoom();
    //加载当前放映厅排片计划
    this.loadShowingonPlans();
  },
};
</script>