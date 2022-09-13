<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影院列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <div
      id="cinemaListContainer"
      style="width: 100%; height: 250px; border: 1px solid #aaa"
    ></div>

    <!-- 列表页面 -->
    <el-divider content-position="left">电影院列表</el-divider>

    <el-table :data="tableData" height="350" border style="width: 100%">
      <el-table-column
        align="center"
        prop="cinema_name"
        label="影院名称"
        width="280"
        sortable
      >
      </el-table-column>
      <el-table-column align="center" prop="address" label="影院地址">
      </el-table-column>
      <el-table-column
        sortable
        align="left"
        prop="city"
        label="影院位置"
        width="180"
        :sort-method="sortByLocation"
      >
        <template slot-scope="scope">
          {{ scope.row.city }}{{ scope.row.district }}
        </template>
      </el-table-column>
      <el-table-column align="left" prop="address" label="操作" width="280">
        <template slot-scope="scope">
          <el-button
            type="success"
            title="查看位置"
            icon="el-icon-location-information"
            circle
            @click="showLocation(scope.row.longitude, scope.row.latitude)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-s-unfold"
            circle
            title="查看影院放映厅列表"
            @click="$router.push(`/home/cinema-room-list/${scope.row.id}`)"
          ></el-button>
          <el-button
            type="warning"
            icon="el-icon-edit"
            circle
            title="修改电影信息"
            @click="$router.push(`/home/cinema-update/${scope.row.id}`)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            circle
            title="删除电影院"
            @click="showDeleteDialog(scope.row.id)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
     

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
export default {
  data() {
    return {
      map: null,
      tableData: [],
    };
  },
  methods: {
    // 弹出删除对话框
    showDeleteDialog(id) {
      this.$confirm("此操作将会永久删除该影院，是否确认删除？", "注意").then(
        (res) => {
          console.log("点击了确定");
          return this.$http.CinemaApi.delete({ id }).then((res) => {
            console.log("删除影院", res);
            if (res.data.code == 200) {
              this.$message.success("删除成功");
              this.loadAllCinema();
            }
          });
        }
      );
    },
    // 显示影院位置
    showLocation(lng, lat) {
      if (this.map != null) {
        this.map.setCenter([lng, lat], false, 1000);
        this.map.setZoom(18, false, 1000);
      }
    },

    //影院位置列排序
    sortByLocation(a, b) {
      let astr = a.city + a.district;
      let bstr = b.city + b.district;
      return astr > bstr;
    },
    //加载所有电影院数据
    loadAllCinema() {
      this.$http.CinemaApi.list().then((res) => {
        console.log("加载所有电影院数据", res);
        if (res.data.code == 200) {
          this.tableData = res.data.data;
        }
      });
    },
    initMap() {
      AMapLoader.load({
        key: "e90ea866a7e6aea1911cf824c5f69220", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: [], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          this.map = new AMap.Map("cinemaListContainer", {
            zoom: 11, //级别
            center: [116.397428, 39.90923], //中心点坐标
            viewMode: "3D", //使用3D视图
          });
          console.log("加载地图完成");
          //将所有电影院的位置在地图中以marker的方式显示
          this.tableData.forEach((item) => {
            let lat = item.latitude;
            let lng = item.longitude;
            //创建MARKER，将MARKER添加到地图上
            let marker = new AMap.Marker({
              position: new AMap.LngLat(lng, lat),
            });
            this.map.add(marker);
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },
  },
  mounted() {
    //加载所有电影院数据
    this.loadAllCinema();
    //初始化地图
    this.initMap();
  },
};
</script>

<style lang="scss">
</style>