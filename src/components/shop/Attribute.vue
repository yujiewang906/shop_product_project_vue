<template>
    <div>

      <el-button  type="success"   @click="addAttribute">新增</el-button>

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
            :formatter="fmtColor"
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
            :formatter="fmtType"
            >
          </el-table-column>

          <el-table-column
            prop="isSKU"
            label="是不是SUK"
            :formatter = "fmtSKU"
          >
          </el-table-column>

          <el-table-column
            prop="isDel"
            label="是否展示"
            :formatter="fmtDel"
          >
          </el-table-column>

          <el-table-column
            prop="createDate"
            label="创建时间">
          </el-table-column>
          <el-table-column
            prop="updateDate"
            label="修改时间">
          </el-table-column>


          <el-table-column prop="id"  label="操作" width="310">
            <template slot-scope="scope">
              <el-button size="mini" @click="updateAttribute(scope.row)">修改</el-button>
              <el-button size="mini" type="danger" @click="deleteAttribute(scope.row)">删除</el-button>
              <el-button size="mini" @click="attributeValue(1,scope.row)">属性值信息</el-button>
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
              <el-radio :label="0">红</el-radio>
              <el-radio :label="1">白</el-radio>
              <el-radio :label="2">蓝</el-radio>
            </el-radio-group>
          </el-form-item>

          <el-form-item label="属性中文名" prop="nameCH">
            <el-input  v-model="addAttributeForm.nameCH"></el-input>
          </el-form-item>

          <el-form-item label="所属商品分类">
            <el-select v-model="addAttributeForm.typeId" placeholder="请选择分类">
              <el-option label="请选择" :value="-1"></el-option>
              <el-option v-for="item in types" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item label="属性的类型" prop="type">
            <el-radio-group v-model="addAttributeForm.type">
              <el-radio :label="0">下拉框</el-radio>
              <el-radio :label="1">单选框</el-radio>
              <el-radio :label="2">复选框</el-radio>
              <el-radio :label="3">输入框</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="是否为SKU" prop="isDel">
            <el-radio-group v-model="addAttributeForm.isSKU">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
            </el-radio-group>
          </el-form-item>


          <el-form-item label="是否展示" prop="isDel">
            <el-radio-group v-model="addAttributeForm.isDel">
              <el-radio :label="0">是</el-radio>
              <el-radio :label="1">否</el-radio>
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



      <!--属性值弹框表格-->

      <el-dialog  :title="valueTitle" :visible.sync="attributeValueFormFlag">
        <div id="attriTableValueTable">

          <el-button  type="success"   @click="showAddAttributeValue">新增</el-button>


          <el-table :data="attributeValueData" style="width: 100%">

            <el-table-column prop="id" label="序号" width="180"></el-table-column>

            <el-table-column prop="name" label="属性值名称" width="180"></el-table-column>

            <el-table-column prop="nameCH" label="中文名称" width="180"></el-table-column>

            <el-table-column prop="id" label="操作" width="180%">
              <template slot-scope="scope">
                <el-button size="mini" type = "info" @click="updateAttributeValue(scope.row)">修改</el-button>
                <el-button size="mini" type="danger" @click="deleteAttributeValue(scope.row)">删除</el-button>
              </template>
            </el-table-column>

          </el-table>

          <el-pagination
            @current-change="attributeValueHandleCurrentChange"
            @size-change="attributeValueHandleSizeChange"
            :page-sizes="sizes"
            :page-size="size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="count">
          </el-pagination>

        </div>
      </el-dialog>


      <!--新增修改属性值弹框新增-->
      <el-dialog title="录入属性值信息" :visible.sync="addAttributeValueFormFlag">
          <el-form :model="attributeValueForm" ref="addAttributeForm" :rules="valuerules"  label-width="80px">

            <el-input type="hidden" v-model="attributeValueForm.id"/>

            <el-form-item label="属性值名称" prop="name">
              <el-input v-model="attributeValueForm.name" autocomplete="off" ></el-input>
            </el-form-item>
            <el-form-item label="属性值中文名称" prop="nameCH">
              <el-input v-model="attributeValueForm.nameCH" autocomplete="off" ></el-input>
            </el-form-item>

          </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button @click="addAttributeValueFormFlag = false">取 消</el-button>
          <el-button type="primary" @click="AddOrUpdateAttributeValue">确 定</el-button>
        </div>

      </el-dialog>



    </div>
</template>

<script>
    export default {
        name: "Attribute",
        data() {

          var checkname = (rule, value, callback) => {
            if (!value) {
              return callback(new Error('属性名不能为空'));
            }
            if(/^[\u4e00-\u9fa5]+$/i.test(value)){
              callback();
            }else{
              callback(new Error('只能输入中文'));
            }
          };

          return {
            /*属性值表头信息*/
            valueTitle:"",
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

            /*商品分类*/
            ajaxTypeData:[],
            typeName:"",
            types:[],


            /*新增属性弹框*/
            addFormFlag:false,
            rule:{ //验证规则
              name:[
                { required: true, message: '请输入名称', trigger: 'blur' },
                { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
              ]
            },

            /*属性值弹框*/
            attributeValueFormFlag:false,
            /*新增属性值弹框*/
            addAttributeValueFormFlag:false,
            /*属性值表格*/
            attributeValueData:[],
            /*属性值表单*/
            attributeValueForm:{
              id:"",
              attrId:"",
              name:"",
              nameCH:""
            },
            /*属性值新增验证*/
            valuerules:{
              nameCH: [
                { required: true, message: '请输入属性值的名称', trigger: 'blur' },
                { max: 10, message: '长度不能超过 10 个字符', trigger: 'blur' },
                { validator:checkname,trigger: 'blur' }
              ],
              name: [
                { required: true, message: '请输入属性值', trigger: 'change' }
              ]},

          }

        },
      methods:{
        /*属性值新增修改确认*/
          AddOrUpdateAttributeValue:function(){
              if (this.attributeValueForm.id!=null&&this.attributeValueForm.id!="") {
                    //修改
                //取校验结果
                this.$refs["addAttributeForm"].validate((valid) => {
                    if (valid) {
                      //发起请求 添加数据
                      this.$ajax.post("http://localhost:8080/api/attrValue/updateAttributeValue",this.$qs.stringify(this.attributeValueForm)).then(res=>{
                        this.$message.success("修改成功");
                        //关闭form表单
                        this.addAttributeValueFormFlag=false;
                        //刷新table
                        this.attributeValue(this.attributeValueForm.attrId);
                        //重新弹出选中的表格
                        this.attributeValueFormFlag = true;
                      })
                    } else {
                      return false;
                    }
                  }
                )

              }else{
                //新增
                //取校验结果
                this.$refs["addAttributeForm"].validate((valid) => {
                  if (valid) {
                    //发起请求 添加数据
                    this.$ajax.post("http://localhost:8080/api/attrValue/addAttributeValue",this.$qs.stringify(this.attributeValueForm)).then(res=>{
                      this.$message.success("新增成功");
                      //关闭form表单
                      this.addAttributeValueFormFlag=false;
                      //刷新table
                      this.attributeValue(this.attributeValueForm.attrId);
                      //重新弹出选中的表格
                      this.attributeValueFormFlag = true;
                    })
                  } else {
                    return false;
                  }
                }
              )}
          },
          /*属性值新增修改表单弹框*/
          showAddAttributeValue:function(row){

            this.attributeValueFormFlag=false;
            this.addAttributeValueFormFlag = true;
            
          },
          /*属性值维护删除*/
          deleteAttributeValue:function(row){

            this.$ajax.delete("http://localhost:8080/api/attrValue/deleteAttributeValue?id="+row.id).then(res=>{
              //刷新表格
              this.attributeValue(1,this.attributeValueForm.attrId);
            })

          },
          /*属性值修改弹框*/
          updateAttributeValue:function(row){

              this.attributeValueForm.name = row.name;
              this.attributeValueForm.nameCH = row.nameCH;
              this.attributeValueForm.id = row.id;

              this.addAttributeValueFormFlag = true;
          },
          /*属性值当前页页数改变监听*/
          attributeValueHandleSizeChange:function(page){
              this.size = size;
              this.attributeValue(1);
          },
          /*属性值每页条数监听*/
          attributeValueHandleCurrentChange:function(page){
              this.attributeValue(page);
          },
          /*属性值展示*/
          attributeValue:function(page,row){
            //属性值标题
            this.valueTitle = row.nameCH+"选项的信息";
            //直接给新增属性值表单的attrid赋值为属性的id;
            this.attributeValueForm.attrId = row.id;

            this.$ajax.get("http://localhost:8080/api/attrValue/getData?currPage="+this.size+"&page="+page+"&id="+row.id).then(res=>{
              this.attributeValueData = res.data.data.data;
              this.count = res.data.data.count;
              this.attributeValueFormFlag=true;
            }).catch(err=>console.log(err))
          },
          /*属性删除*/
          deleteAttribute:function(row){

              this.$ajax.delete("http://localhost:8080/api/attribute/deleteAttribute?id="+row.id).then(res=>{
                  this.queryAttributeData(1);
              })

          },
          /*属性新增的弹框*/
          addAttribute:function(){

            this.addFormFlag=true;
              this.addAttributeForm={
                  id:"",
                  name: "",
                  color: "",
                  nameCH:"",
                  typeId:"",
                  type:"",
                  isSKU:"",
                  isDel:"",
                  author:""
              }

          },
          /*属性修改的回显*/
          updateAttribute:function(row){
           console.log(row.color);
            this.addAttributeForm = row;
            this.addAttributeForm.color = row.color;
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
              //console.log(page);
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
        /*转换属性颜色*/
        fmtColor:function (a,b,c,d) {
            if (c==0){
              return  "红色"
            }if (c==1){
              return  "白色"
            }if (c==2){
              return  "蓝色"
            }
        },
        /*转换属性值类型*/
        fmtType:function (a,b,c,d) {
            if (c==0){
              return "下拉框";
            }if (c==1){
              return "单选框";
            }if (c==2){
              return "复选框";
            }if (c==3){
              return "输入框";
            }
        },
        fmtSKU:function (a,b,c,d) {
          if (c==0){
            return  "是";
          } else {
            return "否";
          }
        },
        fmtDel:function (a,b,c,d) {
          if (c==0){
            return  "是";
          } else {
            return "否";
          }
        },
        //处理商品分类下拉框
        formaterTypeData:function () {
            this.$ajax.get("http://localhost:8080/api/type/getData").then(res=>{
              this.ajaxTypeData = res.data.data.data;
              //找到子节点的数据
              this.getChildrenType();
              //遍历所有的子节点
              for (let i = 0; i <this.types.length; i++) {
                  this.typeName = "";//临时储存
                  //处理子节点的name属性
                this.chandleName(this.types[i]);

                //给name重新赋值
                this.types[i].name = this.typeName.split("/").reverse().join("/");
              }

            })
        },
        chandleName:function(node){
              if (node.pid != 0){ //判断不是根节点

                this.typeName += "/"+node.name;
                //上级节点
                for (let i = 0; i <this.ajaxTypeData.length ; i++) {
                    if (node.pid==this.ajaxTypeData[i].id){
                      this.chandleName(this.ajaxTypeData[i]);
                      break;
                    }
                }
              }else{
                this.typeName +="/"+node.name;
              }
        },
        //获取子节点的数据
        getChildrenType:function () {
          for (let i = 0; i < this.ajaxTypeData.length; i++) {
              let node = this.ajaxTypeData[i];
              this.isChildrenNode(node);
          }
        },
        //判断是不是最终的子节点
        isChildrenNode:function (node) {
          let rs = true;
          for (let i = 0; i <this.ajaxTypeData.length; i++) {
               if (node.id == this.ajaxTypeData[i].pid){
                rs=false;
                 break;
               }
          }

          if (rs==true){
            this.types.push(node);
          }

        }




      },
          created:function () {

            this.queryAttributeData(1);

            //处理商品分类下拉框
            this.formaterTypeData();

          }

    }
</script>

<style scoped>

</style>
