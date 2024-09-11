function error(msj,code){
    let e = new Error(msj);
    if(code){
        e.statusCode=code;
    }
    return e;
}

module.exports=error;