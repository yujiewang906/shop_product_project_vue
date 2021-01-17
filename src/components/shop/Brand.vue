<template>
    <div>
      <div id="brandTable">


        <el-button  type="success"   @click="addFormFlag=true">新增</el-button>

          <el-table
            :data="brandData"
            style="width: 100%">

            <el-table-column
              prop="id"
              label="序号"
              width="180">
            </el-table-column>

            <el-table-column
              prop="name"
              label="品牌名称"
              width="180">
            </el-table-column>

            <el-table-column
              prop="bandE"
              label="首字母"
              width="180">
            </el-table-column>

            <el-table-column
              prop="imgpath"
              label="图片">
            </el-table-column>

            <el-table-column
              prop="bandDesc"
              label="品牌介绍">
            </el-table-column>

            <el-table-column prop="imgpath"  label="图片">
              <template slot-scope="scope">
                <img height="60px" :src="scope.row.imgpath"/>
              </template>
            </el-table-column>


            <el-table-column
              prop="ord"
              label="排序字段">
            </el-table-column>

            <el-table-column
              prop="isDel"
              label="是否展示">
            </el-table-column>

            <el-table-column
              prop="createDate"
              label="创建时间">
            </el-table-column>

            <el-table-column
              prop="updateDate"
              label="修改时间">
            </el-table-column>

            <el-table-column
              prop="id"
              label="操作"
            width="180%">

              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="updateBrand(scope.row)">修改</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="deleteBrand(scope.row)">删除</el-button>
              </template>


            </el-table-column>

          </el-table>

          <el-pagination

            @current-change="handleCurrentChange"
            @size-change="handleSizeChange"
            :page-sizes="sizes"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
          </el-pagination>

      </div>




      <!--新增弹框-->
      <el-dialog title="录入品牌信息" :visible.sync="addFormFlag">
        <!--rules用于验证表单-->
        <el-form :model="addBrandForm" ref="addBrandForm" :rules="rule"  label-width="80px">

          <el-input type="hidden" v-model="addBrandForm.id"/>

          <el-form-item label="名称" prop="name">
            <el-input v-model="addBrandForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="品牌首字母" prop="bandE">
            <el-radio-group v-model="addBrandForm.bandE">
              <el-input v-model="addBrandForm.bandE" autocomplete="off" ></el-input>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="图片">

            <el-upload
              class="avatar-uploader"
              action="http://localhost:8080/api/brand/uploadFile"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload">
              <img v-if="imageUrl" :src="imageUrl" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>

          </el-form-item>


          <el-form-item label="品牌介绍" prop="bandDesc">
            <el-radio-group v-model="addBrandForm.bandDesc">
              <el-input type="textarea" v-model="addBrandForm.bandDesc" autocomplete="off" ></el-input>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="排序字段" prop="ord">
            <el-input  v-model="addBrandForm.ord"></el-input>
          </el-form-item>

          <el-form-item label="是否展示" prop="isDel">
            <el-radio-group v-model="addBrandForm.isDel">
              <el-radio label="0">是</el-radio>
              <el-radio label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="操作人" prop="author">
            <el-input  v-model="addBrandForm.author"></el-input>
          </el-form-item>

        </el-form>


        <div slot="footer" class="dialog-footer">
          <el-button @click="addFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="addForm">确 定</el-button>
        </div>

      </el-dialog>



    </div>
</template>

<script>
  export default {
      name: "Brand",
      data() {
        return {
          brandData: [],
          count: 0,
          sizes: [2, 3, 5, 10],
          size: 5,
          addBrandForm:{
              id:"",
              name:"",
              bandE:"",
              bandDesc:"",
              imgpath:"",
              ord:"",
              isDel:"",
              author:""
          },

          imageUrl:"",

          addFormFlag:false,
          rule:{ //验证规则
            name:[
              { required: true, message: '请输入名称', trigger: 'blur' },
              { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
            ]
          }
        }
    },
    methods:{
          handleAvatarSuccess(res, file) {
            //打断点 看怎么取返回值
            this.addBrandForm.imgpath=res.data;
            //显示赋值
            this.imageUrl=res.data;
          },
          beforeAvatarUpload(file) {
            //限制类型    name  来限制
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 4;

            if (!isJPG) {
              this.$message.error('上传头像图片只能是 JPG 格式!');
            }
            if (!isLt2M) {
              this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isJPG && isLt2M;
          },
          deleteBrand:function(row){
              this.$ajax.delete("http://localhost:8080/api/brand/deleteBrand?id="+row.id).then(res=>{
                this.queryBrandData(1);
              })
          },
          updateBrand:function(row){
              console.log(row);
              this.addBrandForm = row;
              this.addFormFlag = true;
          },

          queryBrandData:function(page){
              this.$ajax.get("http://localhost:8080/api/brand/queryData?currPage="+this.size+"&page="+page).then(res=> {
                  this.brandData = res.data.data.data;
                  this.count = res.data.data.count;
                }
              ).catch(function (err) {
                  console.log(err);
                }
              )

          },
          handleCurrentChange:function(page){ //跳转页面
              console.log(page);
              this.queryBrandData(page);
            },
          handleSizeChange:function(size){ //跳转页面
            this.size=size;
            this.queryBrandData(1);
          },
          /*判断新增还是修改*/
          addForm:function () {
              /*修改*/
            if (this.addBrandForm.id!= null && this.addBrandForm.id!=""){
              //取得验证结果
              this.$refs['addBrandForm'].validate(res => {
                if (res == true) {
                  this.$ajax.post("http://localhost:8080/api/brand/updateBrand", this.$qs.stringify(this.addBrandForm)).then(res => {
                    this.addFormFlag = false;
                    this.queryBrandData(1);
                  }).catch(err => console.log(err));
                }
              });

            }else {
                /*新增*/
                //取得验证结果
                this.$refs['addBrandForm'].validate(res => {
                  if (res == true) {
                    this.$ajax.post("http://localhost:8080/api/brand/addBrand", this.$qs.stringify(this.addBrandForm)).then(res => {
                      this.addFormFlag = false;
                      this.queryBrandData(1);
                    }).catch(err => console.log(err));
                  }
                });
            }
          },

    },
    created:function () {
      this.queryBrandData(1);
    }


  }
</script>

<style scoped>

</style>
