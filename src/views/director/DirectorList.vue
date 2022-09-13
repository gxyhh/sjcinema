<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>导演管理</el-breadcrumb-item>
      <el-breadcrumb-item>导演列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 查询表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="姓名">
        <el-input
          v-model="searchForm.directorName"
          placeholder="请输入导演名字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <el-divider content-position="left">导演列表</el-divider>

    <person-item
      v-for="item in directorList"
      :key="item.id"
      :id="item.id"
      :name="item.director_name"
      :avatar="item.director_avatar"
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
    this.loaddirectorList();
  },
  data() {
    return {
      directorList: null,
      searchForm: {
        directorName: "",
      },
    };
  },
  methods: {
    onSearch() {
      if (!this.searchForm.directorName.trim()) {
        //填写的是空字符串
        this.loaddirectorList();
        return;
      }
      //发送请求，模糊查询导演
      let name = this.searchForm.directorName;
      this.$http.DirectorApi.listByName({ name }).then((res) => {
        console.log("模糊查询请求");
        if (res.data.code == 200) {
          this.directorList = res.data.data;
        }
      });
    },
    onDelete(id) {
      //发送http请求，实现删除业务
      this.$http.DirectorApi.delete({ id: id }).then((res) => {
        console.log("删除导演", res);
        if (res.data.code == 200) {
          this.$message.success("删除成功");
          this.loaddirectorList();
        }
      });
    },
    loaddirectorList() {
      this.$http.DirectorApi.list({ page: 1, pagesize: 100 }).then((res) => {
        console.log("加载导演列表", res);
        if (res.data.code == 200) {
          this.directorList = res.data.data;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>