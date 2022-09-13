<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>电影管理</el-breadcrumb-item>
      <el-breadcrumb-item>电影列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-divider></el-divider>
    <!-- 查询表单 -->
    <el-form :inline="true" :model="searchForm" class="demo-form-inline">
      <el-form-item label="电影名称">
        <el-input
          v-model="searchForm.movieName"
          placeholder="请输入电影名字"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSearch">查询</el-button>
      </el-form-item>
    </el-form>

    <el-divider content-position="left">电影列表</el-divider>
    <div v-if="tableData">
      <el-table :data="tableData.result" stripe style="width: 100%">
        <el-table-column align="center" prop="cover" label="封面" width="180">
          <template slot-scope="scope">
            <el-image
              :src="scope.row.cover"
              style="width: 90px"
              fit="cover"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="标题" width="180">
        </el-table-column>
        <el-table-column align="center" prop="star_actor" label="主演">
        </el-table-column>
        <el-table-column
          align="center"
          prop="showingon"
          label="上映时间"
          width="180"
        >
        </el-table-column>
        <el-table-column
          align="center"
          prop="duration"
          label="时长"
          width="180"
        >
          <template slot-scope="scope"> {{ scope.row.duration }}分钟 </template>
        </el-table-column>
        <el-table-column align="center" prop="category_id" label="所属类别">
          <template slot-scope="scope">
            {{ scope.row.categoryId }}
            <el-tag v-if="scope.row.category_id == 1" type="danger"
              >热映</el-tag
            >
            <el-tag v-if="scope.row.category_id == 2">待映</el-tag>
            <el-tag v-if="scope.row.category_id == 3" type="success"
              >经典</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="230">
          <template slot-scope="scope">
            <el-button
              @click="showEditActorDialog(scope.row.id)"
              title="配置演员列表"
              type="info"
              icon="el-icon-user"
              circle=""
            ></el-button>
            <el-button
              type="warning"
              title="配置剧照列表"
              icon="el-icon-picture-outline"
              @click="showEditThumbDialog(scope.row.id)"
              circle
            ></el-button>
            <el-button
              type="info"
              title="修改演员信息"
              icon="el-icon-edit"
              circle
              @click="$router.push(`/home/movie-update/${scope.row.id}`)"
            ></el-button>
            <el-button
              @click="deleteMovie(scope.row.id)"
              type="danger"
              icon="el-icon-delete"
              circle
              title="删除演员"
            ></el-button> </template></el-table-column
      ></el-table>
      <el-pagination
        @current-change="changeCurrentPage"
        style="margin: 20px 0px; text-align: right"
        background
        layout="prev, pager, next"
        :total="tableData.total"
        :page-size="tableData.pagesize"
      >
      </el-pagination>
    </div>

    <!-- 设置修改剧照弹窗 -->
    <el-dialog title="配置剧照图片" :visible.sync="dialogThumbVisible">
      <el-upload
        class="upload-demo"
        ref="upload"
        action="http://localhost:9000/upload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :on-success="handleSuccess"
        multiple=""
        :file-list="fileList"
        :auto-upload="false"
      >
        <el-button slot="trigger" size="small" type="primary"
          >选取文件</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          type="success"
          @click="submitUpload"
          >上传到服务器</el-button
        >
        <el-button
          style="margin-left: 10px"
          size="small"
          @click="$router.push('/home/thumb-list/' + currentSelectId)"
          >管理剧照图片</el-button
        >
        <div slot="tip" class="el-upload__tip">
          只能上传jpg/png文件，且不超过500kb
        </div>
      </el-upload>
    </el-dialog>

    <!-- 配置演员列表接口 -->
    <el-dialog :visible.sync="dialogEditActorsVisible" title="配置演员列表">
      <el-transfer
        v-model="transferValue"
        :data="transferData"
        style="text-align: center"
        :titles="['未选择演员', '已选择演员']"
      ></el-transfer>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitActors()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
     

<script>
// import httpApis from "@/http/index.js";
import PersonItem from "@/components/PersonItem.vue";
export default {
  components: { "person-item": PersonItem },
  /**挂载完毕执行的声明周期 */
  mounted() {
    this.loadMovieList();
    this.loadAllActors();
  },

  data() {
    return {
      transferValue: [], //原始数据
      transferData: [], //选中项数据
      dialogEditActorsVisible: false, //绑定是否显示配置演员列表窗口
      currentSelectId: "", //绑定当前选中项的电影id
      fileList: [], //绑定上传文件列表
      dialogThumbVisible: false, //是否显示修改剧照图片窗口
      searchForm: {
        movieName: "",
      },
      tableData: [], //存储表格所需数组{page,pagesize,total,result}
    };
  },
  methods: {
    // 提交穿梭狂收集的演员数据
    submitActors() {
      let movie_id = this.currentSelectId;
      let actor_ids = this.transferValue.toString();
      this.$http.MovieApi.bindActors({ movie_id, actor_ids }).then((res) => {
        console.log("为电影绑定演员列表", res);
        if (res.data.code == 200) {
          this.$message.success("演员列表绑定完成");
          this.dialogEditActorsVisible = false;
        }
      });
    },
    // 加载所有演员
    loadAllActors() {
      this.$http.ActorApi.list({ page: 1, pagesize: 10000 }).then((res) => {
        console.log("加载所有演员", res);
        //将res.data.data中的演员数据保存到this.transferData
        if (res.data.code == 200) {
          let mdata = [];
          res.data.data.forEach((item) => {
            mdata.push({
              key: item.id,
              label: item.actor_name,
            });
          });
          this.transferData = mdata;
        }
      });
    },
    /**
     * 显示配置演员列表窗口
     */
    showEditActorDialog(id) {
      this.dialogEditActorsVisible = true;
      this.currentSelectId = id;
      //发送请求，获取当前电影下的所有演员
      this.$http.ActorApi.listByMovieId({ movie_id: id }).then((res) => {
        console.log("获取当前电影的所有演员", res);
        if (res.data.code == 200) {
          res.data.data.forEach((item) => {
            this.transferValue.push(item.actor_id);
          });
        }
      });
    },

    //显示修改剧照对话框
    showEditThumbDialog(id) {
      this.dialogThumbVisible = true;
      this.currentSelectId = id;
    },
    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    //处理上传成功后业务
    handleSuccess(res) {
      console.log(res);
      let url = res.data;
      let movie_id = this.currentSelectId;
      //发送请求新增剧照配置
      this.$http.MovieThumbApi.add({ url, movie_id }).then((res) => {
        console.log("上传剧照结果", res);
      });
    },
    deleteMovie(id) {
      this.$http.MovieApi.del({ id }).then((res) => {
        console.log("删除电影", res);
        if (res.data.code == 200) {
          this.loadMovieList();
        }
      });
    },
    onSearch() {
      let name = this.searchForm.movieName.trim();
      if (!name) {
        this.loadMovieList();
      } else {
        this.$http.MovieApi.listByName({ name, page: 1, pagesize: 2 }).then(
          (res) => {
            console.log("模糊查询电影列表", res);
            if (res.data.code == 200) {
              this.tableData = res.data.data;
            }
          }
        );
      }
    },
    //点击分页按钮
    changeCurrentPage(val) {
      console.log(val);
      let name = this.searchForm.movieName.trim();
      if (!name) {
        // name为空
        this.$http.MovieApi.list({ page: val, pagesize: 2 }).then((res) => {
          console.log("加载所有电影列表", res);
          this.tableData = res.data.data;
        });
      } else {
        this.$http.MovieApi.listByName({ name, page: val, pagesize: 2 }).then(
          (res) => {
            console.log("模糊查询电影列表", res);
            if (res.data.code == 200) {
              this.tableData = res.data.data;
            }
          }
        );
      }
    },
    loadMovieList() {
      this.$http.MovieApi.list({ page: 1, pagesize: 2 }).then((res) => {
        console.log("加载所有电影列表");
        this.tableData = res.data.data;
      });
    },
  },
};
</script>

<style lang="scss">
.el-transfer-panel {
  text-align: left;
}
</style>