<template>
  <div>
    <!-- 搭建主体结构 -->
    <el-container>
      <el-header class="header"
        >世纪影城后台管理系统
        <div class="userInfo" v-if="$store.state.user">
          {{ $store.state.user.nickname }}
          <span @click="logout">[注销]</span>
        </div>
        <div v-else class="userInfo">登录</div>
      </el-header>
      <el-container>
        <el-aside width="200px" class="aside scroll-container">
          <!-- 垂直导航 -->
          <el-menu
            router
            unique-opened
            :default-active="$route.path"
            style="border-right: none"
            background-color="#333"
            text-color="#ddd"
            active-text-color="#fff"
          >
            <el-submenu index="/home/actor-list">
              <template slot="title">
                <i class="el-icon-user-solid"></i>
                <span slot="title">演员管理</span>
              </template>
              <el-menu-item index="/home/actor-list">
                <i class="el-icon-menu"></i>
                <span>演员列表</span>
              </el-menu-item>
              <el-menu-item index="/home/actor-add">
                <i class="el-icon-menu"></i>
                <span>新增演员列表</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="/home/director-list">
              <template slot="title">
                <i class="el-icon-s-custom"></i>
                <span slot="title">导演管理</span>
              </template>
              <el-menu-item index="/home/director-list">
                <i class="el-icon-menu"></i>
                <span>导演列表</span>
              </el-menu-item>
              <el-menu-item index="/home/director-add">
                <i class="el-icon-menu"></i>
                <span>新增导演列表</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="/home/movie-list">
              <template slot="title">
                <i class="el-icon-video-camera-solid"></i>
                <span slot="title">电影管理</span>
              </template>
              <el-menu-item index="/home/movie-list">
                <i class="el-icon-menu"></i>
                <span>电影列表</span>
              </el-menu-item>
              <el-menu-item index="/home/movie-add">
                <i class="el-icon-menu"></i>
                <span>新增电影列表</span>
              </el-menu-item>
            </el-submenu>
            <el-submenu index="/home/cinema-list">
              <template slot="title">
                <i class="el-icon-s-marketing"></i>
                <span slot="title">电影院管理</span>
              </template>
              <el-menu-item index="/home/cinema-list">
                <i class="el-icon-menu"></i>
                <span>电影院列表</span>
              </el-menu-item>
              <el-menu-item index="/home/cinema-add">
                <i class="el-icon-menu"></i>
                <span>新增电影院列表</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </el-aside>
        <el-main class="main">
          <!-- 嵌套路由，匹配二级路由 -->
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  methods: {
    logout() {
      //调用vuex的方法注销用户信息
      this.$store.commit("clearUserState");
      this.$router.push("/user/login");
    },
  },
};
</script>


<style scoped>
.header {
  background-color: #333;
  color: #fff;
  line-height: 60px;
  font-size: 1.3em;
}
.aside {
  background-color: #333;
  height: calc(100vh - 60px);
  user-select: none;
}
.main {
  height: calc(100vh - 60px);
}
.el-menu-item.is-active {
  font-weight: bold;
}
.userInfo {
  color: white;
  float: right;
  font-size: 15px;
}
.userInfo span:hover {
  color: #999;
  cursor: pointer;
}
</style>