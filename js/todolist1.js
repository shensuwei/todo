// 获取模块
var myapp=angular.module("myapp",[]);

myapp.controller("todo",["$scope","$filter",function($scope,$filter){
    //将json的string格式转化为json的object格式
    $scope.data=localStorage.messages?JSON.parse(localStorage.messages):[];
    
    // 当前显示的子内容
    $scope.currentId=$scope.data.length?$scope.data[0].id:null;
    $scope.currentCon=$scope.data.length?$scope.data[getIndex($scope.currentId)]:null;

     // 监控search
    $scope.search="";
    $scope.$watch("search",function(){
        var arr=$filter("filter")($scope.data,$scope.search);
        $scope.currentCon=$scope.data[getIndex(arr[0].id)];
    })

    // 定义一个开关(确定页面右侧的显示内容)
    $scope.isshow=true;


    // 添加列表
    $scope.addList=function(){
        $scope.isshow=true;
        var maxId=getMaxId($scope.data);

        // id--->要添加的那一条列表的id
        var obj={id:maxId+1,title:"新建列表",son:[]};

        // 把新建的列表推进数组中
        $scope.data.push(obj);

        // 更新内存中的数据
        localStorage.messages=JSON.stringify($scope.data);
    }

    // 删除列表
    $scope.removeList=function(id){
        angular.forEach($scope.data,function(val,index){
            if(val.id==id){
                if($scope.data.length==1){
                // 只有一条列表，删除就什么都没有了
                    $scope.currentId=null;
                    $scope.currentCon=[];
                }else if(id==$scope.data[$scope.data.length-1].id){
                    $scope.currentId=$scope.data[$scope.data.length-2].id;
                    $scope.currentCon=$scope.data.length?$scope.data[getIndex($scope.currentId)]:null;
                }
                $scope.data.splice(index,1);
                //将json的object格式转化为json的string格式
                localStorage.messages= JSON.stringify($scope.data);
            }
        })
    }

    // 列表映射(右侧标题与左侧更新的标题一致)
    $scope.focus=function(id){
        $scope.isshow=true;
        $scope.currentId=id;
        $scope.currentCon=$scope.data.length?$scope.data[getIndex($scope.currentId)]:null;
    }

    // 更改列表数据(刷新后页面仍显示添加的列表，不再报错)
    $scope.blur=function(){
        localStorage.messages=JSON.stringify($scope.data);
    }

    // 添加内容
    $scope.addCon=function(){
        $scope.isshow=true;
        var maxId=getMaxId($scope.currentCon.son);

        // id--->要添加的那一条内容的id
        var obj={id:maxId+1,title:"新建内容"};

        // 把新建的内容推进数组中
        $scope.currentCon.son.push(obj);

        // 更新内存中的数据
        localStorage.messages=JSON.stringify($scope.data);
    }

    // 修改内容(刷新后页面仍显示更改的内容，不再报错)
    $scope.blurCon=function(){
        localStorage.messages=JSON.stringify($scope.data);
    }

    // 删除内容
    $scope.removeCon=function(id){
        for(var i=0;i<$scope.currentCon.son.length;i++){
            if(id==$scope.currentCon.son[i].id){
                $scope.currentCon.son.splice(i,1);
            }
        }

        // 更新内存使其从内存中彻底消失
        localStorage.messages= JSON.stringify($scope.data);
    }

    // 已完成
    // 定义一个保存已完成内容的数组
    $scope.success=localStorage.success?JSON.parse(localStorage.success):[];

    $scope.done=function(id){
        // 1.把完成的放入success数组中
        // 通过id获取下标
        var index=getIndex(id,$scope.currentCon.son);
        // 创建一个对象
        var obj=$scope.currentCon.son[index];
        // 给新建的对象定义id
        obj.id=getMaxId($scope.success)+1;
        $scope.success.push(obj);

        // 2.删除原数组中的
        $scope.currentCon.son.splice(index,1);

        localStorage.success=JSON.stringify($scope.success);
        localStorage.messages=JSON.stringify($scope.data);
    }

    // 删除已完成的
    $scope.removeDone=function(id){
        for(var i=0;i<$scope.success.length;i++){
            if($scope.success[i].id==id){
                $scope.success.splice(i,1);
            }
        }
        localStorage.success=JSON.stringify($scope.success);
    }

     // 获取最大id
    function getMaxId(arr){ 
        if(arr.length>0){
            var maxId=arr[0].id;
            for(var i=0;i<arr.length;i++){
                if(maxId<arr[i].id){
                    maxId=arr[i].id;
                }
            }
        }else{
            maxId=0;
        }
        
        // 必须要转化为整数，字符串没办法计算
        return parseInt(maxId);
    }

    // 通过id获取下标
    function getIndex(id,arr){
        var arr=arr||$scope.data;
        for(var i=0;i<arr.length;i++){
            if(id==arr[i].id){
                return i;
            }
        }
    }
}])

   