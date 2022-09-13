<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>演员管理</el-breadcrumb-item>
      <el-breadcrumb-item>演员列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 查询表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input
          v-model="searchForm.actorName"
          placeholder="请输入演员名字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <el-divider content-position="left">演员列表</el-divider>

    <person-item
      v-for="item in actorList"
      :key="item.id"
      :id="item.id"
      :name="item.actor_name"
      :avatar="item.actor_avatar"
      @delete="onDelete(item.id)"
    ></person-item>
  </div>
</template>

<script>
// import httpApis from "@/http/index.js";
import PersonItem from "@/components/PersonItem.vue";
export default {
  components: { "person-item": PersonItem },
  /**挂载完毕执行的声明周期 */
  mounted() {
    this.loadActorList();
  },
  data() {
    return {
      actorList: null,
      searchForm: {
        actorName: "",
      },
    };
  },
  methods: {
    onSearch() {
      if (!this.searchForm.actorName.trim()) {
        //填写的是空字符串
        this.loadActorList();
        return;
      }
      //发送请求，模糊查询演员
      let name = this.searchForm.actorName;
      this.$http.ActorApi.listByName({ name }).then((res) => {
        console.log("模糊查询请求");
        if (res.data.code == 200) {
          this.actorList = res.data.data;
        }
      });
      /**封装前 */
      // this.axios.post("/movie-actors/name", `name=${name}`).then((res) => {
      //   console.log("模糊查询请求");
      //   if (res.data.code == 200) {
      //     this.actorList = res.data.data;
      //   }
      // });
    },
    onDelete(id) {
      //发送http请求，实现删除业务
      this.$http.ActorApi.delete({ id: id }).then((res) => {
        console.log("删除演员", res);
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.loadActorList();
        }
      });
    },
    loadActorList() {
      this.$http.ActorApi.list({ page: 1, pagesize: 100 }).then((res) => {
        console.log("加载演员列表", res);
        if (res.data.code == 200) {
          this.actorList = res.data.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>

</style>