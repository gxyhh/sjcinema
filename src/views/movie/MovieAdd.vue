<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>新增电影列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>

    <!-- 添加电影表单 -->
    <el-row>
      <el-col :span="12">
        <el-form :rules="rules" ref="form" :model="form" label-width="80px">
          <el-form-item label="封面图片" prop="cover">
            <el-upload
              class="avatar-uploader"
              action="http://localhost:9000/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
            >
              <el-image
                v-if="form.cover"
                :src="form.cover"
                class="avatar"
                fit="contain"
              />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <el-form-item label="电影类别" prop="categoryId">
            <el-radio-group v-model="form.categoryId">
              <el-radio :label="1">热映</el-radio>
              <el-radio :label="2">待映</el-radio>
              <el-radio :label="3">经典</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="电影名称" prop="title">
            <el-input v-model="form.title"></el-input>
          </el-form-item>
          <el-form-item label="电影类型" prop="type">
            <el-select v-model="form.type" multiple placeholder="请选择">
              <el-option
                v-for="item in movieTypes"
                :key="item.id"
                :label="item.typename"
                :value="item.typename"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="电影主演" prop="starActor">
            <el-select
              v-model="form.starActor"
              multiple
              filterable
              remote
              reserve-keyword
              placeholder="请输入电影主演名称"
              :remote-method="loadActorByName"
              :loading="loadingActors"
            >
              <el-option
                v-for="item in actorList"
                :key="item.id"
                :label="item.actor_name"
                :value="item.actor_name"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="上映时间" prop="showingon">
            <el-col :span="11">
              <el-date-picker
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
                v-model="form.showingon"
                style="width: 100%"
              ></el-date-picker>
            </el-col>
            <el-col class="line" :span="2">-</el-col>
          </el-form-item>
          <el-form-item label="电影评分" prop="score">
            <el-input v-model="form.score"></el-input>
          </el-form-item>
          <el-form-item label="电影时长" prop="duration">
            <el-input v-model="form.duration"></el-input>
          </el-form-item>
          <el-form-item label="电影简介" prop="description">
            <el-input type="textarea" v-model="form.description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSubmit">立即添加</el-button>
            <el-button>取消</el-button>
          </el-form-item>
        </el-form></el-col
      >
    </el-row>
  </div>
</template>

<script>
import PersonItem from "@/components/PersonItem.vue";
import myAxios from "@/http/MyAxios";
export default {
  components: { "person-item": PersonItem },
  /**挂载完毕执行的声明周期 */
  data() {
    return {
      actorList: "",
      loadingActors: false, //是否正在加载演员列表
      movieTypes: "",
      form: {
        cover: "",
        categoryId: 1,
        title: "",
        type: "",
        starActor: "",
        showingon: "",
        score: "",
        duration: "",
        description: "",
      },
      rules: {
        cover: [
          {
            required: true,
            message: "请选择封面图片",
            trigger: "blur",
          },
        ],
        title: [
          {
            required: true,
            message: "请填写标题",
            trigger: "blur",
          },
        ],
        type: [
          {
            required: true,
            message: "请填写电影类型",
            trigger: "blur",
          },
        ],
        starActor: [
          {
            required: true,
            message: "请填写主演",
            trigger: "blur",
          },
        ],
        showingon: [
          {
            required: true,
            message: "请选择上映日期",
            trigger: "blur",
          },
        ],
        score: [
          {
            required: true,
            message: "请填写评分",
            trigger: "blur",
          },
        ],
        duration: [
          {
            required: true,
            message: "请填写时长",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "请填写电影简介",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    /**
     * 通过名称模糊查询演员列表
     */
    loadActorByName(query) {
      this.$http.ActorApi.listByName({ name: query }).then((res) => {
        console.log("通过演员名字模糊查询演员列表", res);
        this.actorList = res.data.data;
        this.loadingActors = false;
      });
    },

    //查询电影类型
    loadAllMovieType() {
      this.$http.MovieApi.listAllMovieType().then((res) => {
        console.log("加载电影类型", res);
        if (res.data.code == 200) {
          this.movieTypes = res.data.data;
        }
      });
    },
    // 处理上传成功后的业务，回显图片
    handleAvatarSuccess(res, file) {
      console.log(res);
      if ((res.code = 200)) {
        this.form.cover = res.data;
      }
    },
    // 在上传图片之前执行的业务
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG && !isPNG) {
        this.$message.error("上传头像图片只能是 JPG 或 格式!");
      }

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return (isJPG || isPNG) && isLt2M;
    },
    onSubmit() {
      this.form.type = this.form.type.join("/");
      this.form.starActor = this.form.starActor.join("/");
      this.$refs["form"].validate((valid) => {
        if (valid) {
          console.log("submit!", this.form);
          this.$http.MovieApi.add(this.form).then((res) => {
            console.log("添加电影", res);
            if (res.data.code == 200) {
              this.$message.success("添加成功");
              this.$router.push("/home/movie-list");
            }
          });
        } else {
          this.$message.warning("请完善表单");
        }
      });
    },
  },
  mounted() {
    //加载所有电影类型
    this.loadAllMovieType();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>