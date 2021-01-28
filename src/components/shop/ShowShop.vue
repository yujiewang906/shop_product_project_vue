<template>
    <div>

      <div id="shopTable">



        <el-table
          :data="shopData"
          style="width: 100%">

          <el-table-column
            prop="id"
            label="序号"
            width="180">
          </el-table-column>

          <el-table-column
            prop="name"
            label="商品名称"
            width="180">
          </el-table-column>

          <el-table-column
            prop="brandId"
            label="品牌"
            width="180">
          </el-table-column>

          <el-table-column
            prop="productdecs"
            label="简介">
          </el-table-column>

          <!--<el-table-column prop="imgPath"  label="图片">
            <template slot-scope="scope">
              <img height="60px" :src="scope.row.imgPath"/>
            </template>
          </el-table-column>-->


          <el-table-column
            prop="price"
            label="价格">
          </el-table-column>

          <el-table-column
            prop="stocks"
            label="库存">
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

            <el-table-column
              label="操作">
              <template slot-scope="scope">
                <el-button @click="updateShop(scope.row)" type="text" size="small">修改</el-button>
                <el-button type="text" size="small" @click="showAttrInfo(scope.row.typeId,scope.row.id)">属性维护</el-button>
              </template>
            </el-table-column>


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



      <el-dialog title="属性信息" :visible.sync="attrShow">

        <el-form :model="productForm2" label-width="100px" class="demo-ruleForm">

          <el-form-item label="分类" prop="typeId">
            <!--  改变 获取属性数据  -->
            <el-select v-model="productForm2.typeId" placeholder="请选择" @change="getAttrData">
              <el-option v-for="b in types" :key="b.id" :label="b.name" :value="b.id"></el-option>
            </el-select>
          </el-form-item>


          <el-form-item v-if="SKUData.length>0" label="商品规格" prop="name">
            <!--  颜色 color   大小  szie  -->
            <el-form-item v-for="a in  SKUData" :key="a.id" :label="a.nameCH">
              <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
              <!--  skuCK0color    skuCK1szie   -->
              <el-checkbox-group  v-model="a.ckValues"  v-if="a.type==2" @change="skuChange">
                <el-checkbox v-for="b in a.values" :key="b.id" :label="b.valueCH"></el-checkbox>
              </el-checkbox-group>


            </el-form-item>


          </el-form-item>


          <el-table
            v-if="tableShow"
            :data="tableSkuData"
            style="width: 100%">
            <!--   动态展示列头  sku属性中文名 -->
            <el-table-column v-for="c in cols" :key="c.id" :label="c.nameCH" :prop="c.name">
            </el-table-column>

            <el-table-column
              label="库存"
              width="180">

              <template slot-scope="scope">
                <el-input v-model="scope.row.storcks"/>
              </template>

            </el-table-column>
            <el-table-column
              label="价格"
              width="180">
              <template slot-scope="scope">
                <el-input v-model="scope.row.pricess"/>
              </template>
            </el-table-column>
          </el-table>

          <el-form-item v-if="attData.length>0" label="商品参数" prop="name">

            <el-form-item v-for="a in  attData" :key="a.id" :label="a.nameCH">
              <template slot-scope="scope">
                <!--  0 下拉框     1 单选框      2  复选框   3  输入框  -->
                <el-input v-if="a.type==3" v-model="a.ckValues"></el-input>

                <el-select v-if="a.type==0" v-model="a.ckValues"  placeholder="请选择">
                  <el-option v-for="b in a.values" :key="b.id"  :label="b.valueCH" value="b.id"></el-option>
                </el-select>

                <el-radio-group  v-if="a.type==1"  v-model="a.ckValues"  >
                  <el-radio v-for="b in a.values" :key="b.id" :label="b.valueCH"></el-radio>
                </el-radio-group>


                <el-checkbox-group   v-if="a.type==2" v-model="a.ckValues" >
                  <el-checkbox v-for="b in a.values" :key="b.id" :label="b.valueCH" name="type"></el-checkbox>
                </el-checkbox-group>


              </template>
            </el-form-item>

          </el-form-item>
        </el-form>


        <div slot="footer" class="dialog-footer">
          <el-button @click="attrShow = false">取 消</el-button>
          <el-button type="primary" @click="dialogFormVisible = false">确 定</el-button>
        </div>
      </el-dialog>





    </div>
</template>

<script>
    export default {
        name: "ShowShop",
      data(){
        return{
          shopData:[],
          count: 0,
          size:5,
          sizes:[2,5,10,20],


          tableData:[],
          attrShow:false,
          /* 第二步相关的数据  */
          productForm2:{},
          ajaxTypeData:[], //接口返回的数据
          typeName:"", //递归拼接子节点的名称
          types:[  //分类的数据
            /* {"id":7,name:"分类/电子产品/手机"},
             {"id":13,name:"分类/家电/冰箱"}*/],

          /* 商品属性模块  */

          attData:[],   //非sku的属性数据
          SKUData:[], //sku属性数据


          tableShow:false, //sku的table是否显示
          cols:[],//skutable的动态表头
          tableSkuData:[],//skutable的动态表头对应的表格数据

        }
      },
      methods:{

            showAttrInfo:function (typeId,pid) {
              this.attrShow=true;
              //初始化分类数据
              this.formaterTypeData();
              //回显分类id
              this.productForm2.typeId=typeId;
              //回显属性数据
              this.getAttrData(typeId,pid);
              //回显table
              this.skuChange();

            },
            /* 笛卡尔积    */
            calcDescartes:function(array) {
              if (array.length < 2) return array[0] || [];
              return [].reduce.call(array, function (col, set) {
                var res = [];
                col.forEach(function (c) {
                  set.forEach(function (s) {
                    var t = [].concat(Array.isArray(c) ? c : [c]);
                    t.push(s);
                    res.push(t);
                  })
                });
                return res;
              });
            },
          //监听sku属性 改变事件
          skuChange:function(){
            //笛卡尔积的参数
            let  kdej=[];
            //清空表格数据
            this.tableSkuData=[];
            //清空动态表头数据
            this.cols=[];
            // console.log(this.SKUData);
            //判断是否要生成笛卡尔积
            let flag=true;

            //遍历sku所有数据
            for (let i = 0; i <this.SKUData.length ; i++) {
              //将sku属性 放入动态表头中
              this.cols.push({"id":this.SKUData[i].id,"nameCH":this.SKUData[i].nameCH,"name":this.SKUData[i].name});

              //将此属性选中的选项值放入笛卡尔积参数中
              //得到当前sku选中的值  颜色  选中的值 [红色,绿色]    尺寸 [l,x]
              kdej.push(this.SKUData[i].ckValues);
              //判断此sku的复选框是否为选中
              if(this.SKUData[i].ckValues.length==0){
                flag=false; // 不能生成笛卡尔积
                break;
              }
            }
            if(flag==true){
              //debugger;
              // alert("生成笛卡尔积");
              //生成table的数据  [[],[],[]]   [{},{},{}]
              let  datas=this.calcDescartes(kdej);
              //遍历数据  [[红色,16g],[绿色,16g],[黑色，16g]]
              for (let i = 0; i <datas.length ; i++) {
                //遍历笛卡尔积 的每一项   [红色,16g]  cols:[{"id":1,"name": ,"nameCH"}]

                let  jsonData={}; //笛卡尔积 转为json的对象
                for (let j = 0; j <datas[i].length ; j++) {
                  //获取数据的key
                  let  key=this.cols[j].name;
                  jsonData[key]=datas[i][j]

                }
                this.tableSkuData.push(jsonData);
              }
              console.log(this.tableSkuData);
              console.log(datas);


            }
            this.tableShow=flag;
          },
        /*   根据typeid 查询属性数据和sku数据  */
        getAttrData:function(typeId,pid){

          //查询回显的属性数据
          this.$ajax.get("http://localhost:8080/api/product/queryProductAttrDataByPid?pid="+pid).then(res=>{
            let datas=res.data.data.data;
            this.SKUData=[];
            this.attData=[];
            //发起请求 拿到属性数据
            this.$ajax.get("http://localhost:8080/api/attr/queeryDataByTypeId?typeId="+typeId).then(res=>{
              // 所有的属性数据
              debugger;
              let attrDatas=res.data.data.data;  // 所有的属性数据    id  name  type   如果为 下拉框 单选框  复选框  values
              //判断分类是否有数据   更新 参数和规格
              if(attrDatas.length>0){
                //初始化  attData      SKUData
                for (let i = 0; i <attrDatas.length ; i++) {
                  //判断是否为sku属性
                  if(attrDatas[i].isSKU==0){

                    if(attrDatas[i].type!=3){

                      //回显
                      if(attrDatas[i].type==2){
                        if(this.getValeu(attrDatas[i].name,datas)==""){
                          attrDatas[i].ckValues=[];
                        }else{
                          attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                        }
                      }else{
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                      }


                      //发起请求 查询此属性对应的选项值
                      this.$ajax.get("http://localhost:8080/api/attrvalue/queryDataByAid?aid="+attrDatas[i].id).then(res=>{
                        attrDatas[i].values=res.data.data;

                        this.attData.push(attrDatas[i]);
                      })
                    }else{
                      attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                      this.attData.push(attrDatas[i]);
                    }

                  }else{
                    if(attrDatas[i].type!=3){

                      //回显
                      if(attrDatas[i].type==2){
                        if(this.getValeu(attrDatas[i].name,datas)==""){
                          attrDatas[i].ckValues=[];
                        }else{
                          attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                        }
                      }else{
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                      }

                      //发起请求 查询此属性对应的选项值
                      this.$ajax.get("http://localhost:8080/api/attrvalue/queryDataByAid?aid="+attrDatas[i].id).then(res=>{
                        attrDatas[i].values=res.data.data;
                        // debugger;
                        attrDatas[i].ckValues=this.getValeu(attrDatas[i].name,datas);
                        this.SKUData.push(attrDatas[i]);
                      })
                    }else{
                      attrDatas[i].ckValues=[];
                      this.SKUData.push(attrDatas[i]);
                    }

                  }
                }
              }else{
                this.SKUData=[];
                this.attData=[];
              }

            })
            console.log(this.attData);
            console.log(this.SKUData);
          })


        },
        getValeu:function(key,data){
          //data 回显数据   [{},{}]
          let  arrValue=[];
          debugger;
          //遍历当前商品对应的所有的属性
          for (let i = 0; i <data.length ; i++) {
            //得到当前属性数据的一个 将字符串转为json
            let  objData=JSON.parse(data[i].attrData);
            // 判断当前的属性数据 是否为想要的属性值
            if(objData[key]!=null){ //找到对应的值了
              //判断当前属性是否为sku
              if(objData.storcks!=null){
                if(arrValue.indexOf(objData[key])==-1){
                  arrValue.push(objData[key]);
                }

              }else{
                return objData[key];
              }

            }
          }
          return arrValue;
        },
        //初始化品牌数据
        initBandData:function(){
          let param={page:1,size:100000000};
          this.$ajax.post("http://localhost:8080/api/band/queryPageData",this.$qs.stringify(param)).then(res=>{
            this.brandDatas=res.data.data.data;
          });
        },
        //处理分类的下拉框   [{id:1,"name":"",pid:2},{}]
        // {"id":7,name:"分类/电子产品/手机"},
        formaterTypeData:function(){
          this.$ajax.get("http://localhost:8080/api/type/getData").then(res=>{

            // [{id:1,"name":"",pid:2},{}]
            this.ajaxTypeData=res.data.data;
            //{"id":7,name:"分类/电子产品/手机"},
            //先找到子节点的数据   this.types;
            this.getChildrenType();
            debugger;
            //遍历所有的子节点
            for (let i = 0; i <this.types.length ; i++) {
              this.typeName=""; // 全局变量   临时存 层级名称
              //处理子节点的name属性
              this.chandleName(this.types[i]);
              //   a/b/c/f/d/e
              //给name重新赋值
              this.types[i].name=this.typeName.split("/").reverse().join("/");
            }

          })
        }, //给我一个节点  得到层级name
        chandleName:function(node){
          if(node.pid!=0){ //临界值
            this.typeName+="/"+node.name;
            //上级节点
            for (let i = 0; i <this.ajaxTypeData.length ; i++) {
              if(node.pid==this.ajaxTypeData[i].id){
                this.chandleName(this.ajaxTypeData[i]);
                break;
              }
            }

          }else{
            this.typeName+="/"+node.name;
          }
        },
        //得到types的数据      遍历所有ajaxtypedata
        getChildrenType:function(){
          //遍历所有的节点数据
          for (let i = 0; i <this.ajaxTypeData.length ; i++) {
            let  node=this.ajaxTypeData[i];
            this.isChildrenNode(node);
          }
        },
        isChildrenNode:function(node){
          let rs=true; //标示
          for (let i = 0; i <this.ajaxTypeData.length ; i++) {
            if(node.id==this.ajaxTypeData[i].pid){
              rs=false;
              break;
            }
          }
          if(rs==true){
            this.types.push(node);
          }
        },
        queryShop:function (page) {
          this.$ajax.get("http://localhost:8080/api/shop/getData?currPage="+this.size+"&page="+page).then(res=>{
            this.shopData = res.data.data.data;
            this.count = res.data.data.count;
          }).catch(function (err) {
            console.log(err);
          })
        },
        handleCurrentChange:function(page){ //跳转页面
          this.queryShop(page);
        },
        handleSizeChange:function(size){ //跳转页面
          this.size=size;
          this.queryShop(1);
        }
      },

      created:function () {
          this.queryShop(1);
      }
    }
</script>

<style scoped>

</style>
