<template>
      <div>
        <h1>商品分类管理</h1>
        <el-tree
          :data="data"
          :props="defaultProps"
          ref="tree"
          show-checkbox
          accordion
          check-strictly="true"
          expand-on-click-node="false"
        >

        </el-tree>
        <!--//新增按钮-->
        <el-button type="primary" icon="el-icon-circle-plus-outline" circle v-on:click="nodeCheckbox"></el-button>
        <!--修改-->
        <el-button type="primary" icon="el-icon-edit" circle v-on:click="updateType"></el-button>
   <!-- //新增弹框表单-->
        <el-dialog
          title="提示"
          :visible.sync="dialogVisible"
          width="50%">

          <el-form :model="typeForm" label-width="80px">

            <el-input v-model="typeForm.id" disabled type="hidden">父节点id</el-input>

            <el-form-item label="父节点名称" >
              <el-input v-model="typeForm.parentname" style="width: 50%"  disabled autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="子节点名称">
              <el-input v-model="typeForm.name" style="width: 50%" autocomplete="off"></el-input>
            </el-form-item>



          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addType">确 定</el-button>
          </span>
        </el-dialog>



        <!-- //修改弹框表单-->
        <el-dialog
          title="提示"
          :visible.sync="updateDialogVisible"
          width="50%">

          <el-form :model="updateForm" label-width="80px">

            <el-input v-model="updateForm.id" disabled type="hidden">节点id</el-input>

            <el-form-item label="子节点名称">
              <el-input v-model="updateForm.name" style="width: 50%" autocomplete="off"></el-input>
            </el-form-item>

            <el-form-item label="子节点">
              <el-radio v-model="updateForm.isDel" label="0">显示</el-radio>
              <el-radio v-model="updateForm.isDel" label="1">不显示</el-radio>
            </el-form-item>

          </el-form>

          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="updateNodes">确 定</el-button>
          </span>
        </el-dialog>



      </div>
</template>

<script>
    export default {
        name: "Type",
      data() {
        return {
          data: [],
          defaultProps:{
              label: 'label',
              children: "children"
          },
          ajaxData:[],
          jsonStr:"",
          dialogVisible:false, //新增弹框的默认关闭
          updateDialogVisible:false,//修改弹框

          typeForm: {
            id: "",
            name: "",
            parentname: "",
            isDel:""
          },
          updateForm:{
            id: "",
            name: "",
            isDel:""
          }
        };
      },
      methods: {
        updateType:function(){
          //获取选中节点的数组
          var  checked =  this.$refs.tree.getCheckedNodes();



          if (checked.length>=2){
            var count = checked.length;
            var id = checked[count].id;
            var name = checked[count].label;

            this.updateForm.name = name;
            this.updateForm.id = id;

            this.updateDialogVisible=true;
          }else {
            alert("没有选择节点");
          }

        },
        updateNodes:function(){
            var bthis = this;
            var updateTypeForm = {id:this.updateForm.id,name:this.updateForm.name,isDel:this.updateForm.isDel};

            this.$ajax.post("http://localhost:8080/api/type/update",this.$qs.stringify(updateTypeForm)).then(res=>{
              bthis.updateDialogVisible=false;
                location.reload();
            }).catch(err=>{

            });

        },
        //新增弹框
        nodeCheckbox:function(){
          debugger;

            var  checked =  this.$refs.tree.getCheckedNodes();

            //alert(this.$refs.tree.getCheckedNodes());

          if(checked.length>1){
            alert("节点选择过多");
            return;
          }
          if (checked.length>0){
                var id = checked[0].id;
                var parentName = checked[0].label;

                this.typeForm.parentname = parentName;
                this.typeForm.id = id;

                this.dialogVisible=true;
          }else {
              alert("没有选择节点");
          }

        },
        addType:function(){
          var  bthis = this;
          var addTypeForm = {pid:this.typeForm.id,name:this.typeForm.name};

            this.$ajax.post("http://localhost:8080/api/type/add",this.$qs.stringify(addTypeForm)).then(res=>{
              bthis.dialogVisible=false;
              location.reload();
            }).catch(err=>console.log(err))
        },



        //转换数据
        changData:function () {
            for (let i = 0; i < this.ajaxData.length; i++) {
              /*debugger*/;
                if (this.ajaxData[i].pid==0){
                    this.diguiNode(this.ajaxData[i]);
                    break;
                }
            }
            
            this.data.push(JSON.parse(this.jsonStr));
              
          },
          diguiNode:function (node) {
            //判断父节点
            /*debugger*/;
            var bf = this.isParent(node);
            if (bf==true){
              this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'","children":[';
              let count = 0;
              for (let i = 0; i < this.ajaxData.length; i++) {
                if (node.id==this.ajaxData[i].pid){
                  count++;
                  //递归
                  this.diguiNode(this.ajaxData[i]);
                  this.jsonStr+=",";
                }
              }
              if (count!=0){
                this.jsonStr=this.jsonStr.substr(0,this.jsonStr.length-1);
              }
              this.jsonStr+=']}';
            }else {
              this.jsonStr+='{"id":'+node.id+',"label":"'+node.name+'"}';
            }
          },
          isParent:function (node) {
            //判断是不是父节点
            /*debugger*/;
            for (var i=0;i<this.ajaxData.length;i++){
              if (node.id==this.ajaxData[i].pid){
                return true;
              }
            }
            return  false;
          }

      },created:function () {
            this.$ajax.get("http://localhost:8080/api/type/getData").then(res=>{
              //debugger;
                this.ajaxData = res.data.data.data;
                //console.log(res.data.data.data);
                this.changData();
          }).catch(err=>console.log(err))
      }
    }
</script>

<style scoped>

</style>
