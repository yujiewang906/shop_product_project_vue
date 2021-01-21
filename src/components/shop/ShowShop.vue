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

            <template slot-scope="scope">
              <el-button
                size="mini"
                @click="update(scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="danger"
                @click="delete(scope.row)">删除</el-button>

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
          sizes:[2,5,10,20]
        }
      },
      methods:{
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
          },
      },
      created:function () {
          this.queryShop(1);
      }
    }
</script>

<style scoped>

</style>
