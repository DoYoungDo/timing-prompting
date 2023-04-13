const hx = require('hbuilderx');

//该方法将在插件激活的时候调用
function activate(context) {
	// setInterval(()=>{
         // let resultPromise = hx.window.showErrorMessage('是否删除该文件?',['是','否']);
         //    resultPromise.then((result)=>{
         //        if(result == '是'){
         //            console.log("选择了是");
         //        }else if(result === '否'){
         //            console.log("选择了否");
         //        }
         //    });
    // },3000);
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
	activate,
	deactivate
}
