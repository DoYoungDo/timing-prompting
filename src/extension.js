const hx = require('hbuilderx');
const nls = require('hxnls');
const localize = nls.loadMessageBundle();

const autoPrompting = require("./auto-prompting");
const userPrompting = require("./user-prompting");

//该方法将在插件激活的时候调用
function activate(context) {
    // 初始化自动提醒
    autoPrompting.activate(context);
    // 初始化用户提醒
    userPrompting.activate(context);
}

//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {
    autoPrompting.deactivate();
    userPrompting.deactivate();
}

module.exports = {
    activate,
    deactivate
}