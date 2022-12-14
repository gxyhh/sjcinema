<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影院管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增电影院</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <el-row>
      <el-col :span="12">
        <el-form :rules="rules" ref="form" :model="form" label-width="120px">
          <el-form-item label="电影院名称" prop="cinema_name">
            <el-input v-model="form.cinema_name"></el-input>
          </el-form-item>
          <el-form-item label="选择位置">
            <div
              id="mapContainer"
              style="width: 100%; height: 200px; border: 1px solid #aaa"
            ></div>
          </el-form-item>
          <el-form-item label="详细地址" prop="address">
            <el-input v-model="form.address"></el-input>
          </el-form-item>
          <el-form-item label="省份" prop="province">
            <el-input v-model="form.province"></el-input>
          </el-form-item>
          <el-form-item label="城市" prop="city">
            <el-input v-model="form.city"></el-input>
          </el-form-item>
          <el-form-item label="地区" prop="district">
            <el-input v-model="form.district"></el-input>
          </el-form-item>
          <el-form-item label="经度" prop="longitude">
            <el-input v-model="form.longitude"></el-input>
          </el-form-item>
          <el-form-item label="纬度" prop="latitude">
            <el-input v-model="form.latitude"></el-input>
          </el-form-item>
          <el-form-item label="选择标签" prop="tags">
            <el-select
              v-model="form.tags"
              multiple
              placeholder="请选择"
              style="width: 100%"
            >
              <el-option
                v-for="item in cinemaTags"
                :key="item.id"
                :label="item.tagname"
                :value="item.tagname"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即创建</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import AMapLoader from "@amap/amap-jsapi-loader";
// 设置jscode安全密钥
window._AMapSecurityConfig = {
  securityJsCode: "78c1731ba6f00088287356a0755c958c",
};
export default {
  data() {
    return {
      cinemaTags: [], // 电影院标签数组
      form: {
        // 封装表单数据
        cinema_name: "",
        address: "",
        province: "",
        city: "",
        district: "",
        longitude: "",
        latitude: "",
        tags: "",
      },
      rules: {
        // 定义表单中每一个表单组件的验证规则
        cinema_name: [
          { required: true, message: "请填写电影院名称", trigger: "blur" },
        ],
        address: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        provice: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        city: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        district: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        longitude: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        latitude: [
          { required: true, message: "请在地图中选择地址", trigger: "blur" },
        ],
        tags: [
          {
            required: true,
            message: "请选择该影院支持的标签",
            trigger: "blur",
          },
        ],
      },
    };
  },

  methods: {
    onSubmit() {
      // 将tags转成字符串
      this.form.tags = this.form.tags.toString();
      // 新增电影院
      this.$refs["form"].validate((valid) => {
        if (valid) {
          this.$http.CinemaApi.add(this.form).then((res) => {
            console.log("新增电影院请求", res);
            if (res.data.code == 200) {
              this.$message.success("添加成功");
              this.$router.push("/home/cinema-list");
            }
          });
        } else {
          this.$message.warning("请完善表单");
        }
      });
    },

    /**
     * 初始化显示地图
     */
    initMap() {
      AMapLoader.load({
        key: "e90ea866a7e6aea1911cf824c5f69220", // 申请好的Web端开发者Key，首次调用 load 时必填
        version: "2.0", // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
        plugins: ["AMap.Geocoder"], // 需要使用的的插件列表，如比例尺'AMap.Scale'等
      })
        .then((AMap) => {
          let map = new AMap.Map("mapContainer", {
            zoom: 11, //级别
            center: [116.397428, 39.90923], //中心点坐标
            viewMode: "3D", //使用3D视图
          });
          // 为地图绑定点击事件
          let marker = null;
          map.on("click", (e) => {
            let lnglat = e.lnglat; // 获取点击目标单的经纬度
            console.log("选中的经纬度坐标位置", lnglat);
            // 显示点标记
            if (marker != null) {
              map.remove(marker);
            }
            marker = new AMap.Marker({
              position: new AMap.LngLat(lnglat.lng, lnglat.lat),
            });
            map.add(marker);
            // 通过经纬度，访问逆地址编码接口，获取该经纬度的字符串位置描述
            var geocoder = new AMap.Geocoder();
            geocoder.getAddress([lnglat.KL, lnglat.kT], (status, result) => {
              console.log(status, result);
              if (status == "complete") {
                // 完成表单组件的双向数据绑定
                this.form.address = result.regeocode.formattedAddress;
                this.form.province = result.regeocode.addressComponent.province;
                this.form.city = result.regeocode.addressComponent.city;
                this.form.district = result.regeocode.addressComponent.district;
                this.form.longitude = lnglat.KL;
                this.form.latitude = lnglat.kT;
              } else {
                this.$message.error("地图数据加载失败，请重试");
              }
            });
          });
        })
        .catch((e) => {
          console.log(e);
        });
    },

    /**
     * 初始化所有电影院标签下拉列表框的数据
     */
    loadAllCinemaTags() {
      this.$http.CinemaApi.queryAllTags().then((res) => {
        console.log("所有电影院标签下拉列表框的数据", res);
        if (res.data.code == 200) this.cinemaTags = res.data.data;
      });
    },
  },

  mounted() {
    // 初始化地图
    this.initMap();
    // 初始化所有电影院标签下拉列表框的数据
    this.loadAllCinemaTags();
  },
};
</script>
