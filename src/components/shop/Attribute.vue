<template>
    <div>

      <el-button  type="success"   @click="addFormFlag=true">新增</el-button>

      <div id="attributeTable">

        <el-table
          :data="attributeData"
          style="width: 100%">

          <el-table-column
            prop="id"
            label="序号"
            >
          </el-table-column>

          <el-table-column
            prop="name"
            label="属性名称"
            >
          </el-table-column>

          <el-table-column
            prop="color"
            label="颜色"
            >
          </el-table-column>

          <el-table-column
            prop="nameCH"
            label="中文名称"
            >
          </el-table-column>

          <el-table-column
            prop="typeId"
            label="商品类型"
            >
          </el-table-column>

          <el-table-column
            prop="type"
            label="属性类型"
            >
          </el-table-column>

          <el-table-column
            prop="isSKU"
            label="是不是SUK">
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
            label="操作">

            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="updateAttribute(scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="deleteAttribute(scope.row)">删除</el-button>
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
      <el-dialog title="录入属性信息" :visible.sync="addFormFlag">
        <!--rules用于验证表单-->
        <el-form :model="addAttributeForm" ref="addAttributeForm" :rules="rule"  label-width="80px">

          <el-input type="hidden" v-model="addAttributeForm.id"/>

          <el-form-item label="属性名称" prop="name">
            <el-input v-model="addAttributeForm.name" autocomplete="off" ></el-input>
          </el-form-item>

          <el-form-item label="颜色" prop="color">
            <el-radio-group v-model="addAttributeForm.color">
              <el-radio label="0">红</el-radio>
              <el-radio label="1">白</el-radio>
              <el-radio label="2">蓝</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="属性中文名" prop="nameCH">
            <el-input  v-model="addAttributeForm.nameCH"></el-input>
          </el-form-item>

          <el-form-item label="属性的商品分类" prop="typeId">
            <el-input  v-model="addAttributeForm.typeId"></el-input>
          </el-form-item>

          <el-form-item label="属性的类型" prop="type">
            <el-radio-group v-model="addAttributeForm.type">
              <el-radio label="0">下拉框</el-radio>
              <el-radio label="1">单选框</el-radio>
              <el-radio label="2">复选框</el-radio>
              <el-radio label="3">输入框</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="是否为SKU" prop="isDel">
            <el-radio-group v-model="addAttributeForm.isSKU">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="是否展示" prop="isDel">
            <el-radio-group v-model="addAttributeForm.isDel">
              <el-radio label="1">是</el-radio>
              <el-radio label="2">否</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="操作人" prop="author">
            <el-input  v-model="addAttributeForm.author"></el-input>
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
        name: "Attribute",
        data() {
          return {
            attributeData: [],
            count: 0,
            sizes: [2, 3, 5, 10],
            size: 5,
            /*新增表单内容绑定*/
            addAttributeForm: {
              id:"",
              name: "",
              color: "",
              nameCH:"",
              typeId:"",
              type:"",
              isSKU:"",
              isDel:"",
              author:""
            },
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
          deleteAttribute:function(row){

              this.$ajax.delete("http://localhost:8080/api/attribute/deleteAttribute?id="+row.id).then(res=>{
                  this.queryAttributeData(1);
              })

          },
          updateAttribute:function(row){
            console.log(row);
            this.addAttributeForm = row;

            this.addFormFlag = true;
          },

          queryAttributeData:function(page){
              this.$ajax.get("http://localhost:8080/api/attribute/getData?currPage="+this.size+"&page="+page).then(res=> {
                  this.attributeData = res.data.data.attribute;
                  this.count = res.data.data.count;
                }
              ).catch(function (err) {
                  console.log(err);
                }
              )

            },
            handleCurrentChange:function(page){ //跳转页面
              console.log(page);
              this.queryAttributeData(page);
            },
            handleSizeChange:function(size){ //跳转页面
              this.size=size;
              this.queryAttributeData(1);
            },
        /*判断是修改还是新增修改*/
            addForm:function () {
              /*id不为空则为修改*/
              if (this.addAttributeForm.id != null && this.addAttributeForm != ""){
                this.$ajax.post("http://localhost:8080/api/attribute/updateAttribute",this.$qs.stringify(this.addAttributeForm)).then(res=>{
                    this.addFormFlag=false;
                    this.queryAttributeData(1);
                }).catch(err=>console.log(err));
              }else {
                /*否则就是删除*/
                //取得验证结果
                this.$refs['addAttributeForm'].validate(res => {
                  if (res == true) {
                    this.$ajax.post("http://localhost:8080/api/attribute/addAttribute", this.$qs.stringify(this.addAttributeForm)).then(res => {
                      this.addFormFlag = false;
                      this.queryAttributeData(1);
                    }).catch(err => console.log(err));
                  }
                });
              }
            },


      },
          created:function () {
            this.queryAttributeData(1);
          }

    }
</script>

<style scoped>

</style>
