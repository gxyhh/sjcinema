/**
 * 封装响应对象
 */
const response={
ok:(data)=>{
    return{
        code:200,
        msg:'ok',
        data:data
    }
},
error:(code,errmsg)=>{
    return{
        code:code,
        msg:errmsg
    }
}

}

module.exports=response