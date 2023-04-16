const nls = require('hxnls');
let localize = nls.loadMessageBundle();

module.exports = {
    dialogTitle: localize("dialogTitle", "添加定时提醒"),
    pleaseInputPromptingTextContent: localize("pleaseInputPromptingTextContent", "请输入提醒内容"),
    customTime: localize("customTime", "自定义时间"),
    pleaseInputCustomTime: localize("pleaseInputCustomTime", "请输入自定义时间,单位分钟"),
    needCloseByHand: localize("needCloseByHand", "需要手动关闭"),
    minute: localize("minute", "分钟"),
    minutes: localize("minutes", "分钟"),
    btnOkText: localize("btnOkText", "确定(&O)"),
    btnCancelText: localize("btnCancelText", "取消(&C)"),
    promptingTextCannotBeEmpty: localize("promptingTextCannotBeEmpty", "提醒内容不能为空"),
    pleaseInputValidTime: localize("pleaseInputValidTime", "请输入正确的时间，只能输入 正 整数或小数，小数最多保留三位小数点"),
    promptingTitle: localize("promptingTitle", "提醒"),
    btnOkText1: localize("btnOkText1", "确定"),
    viewAllPrompting: localize("viewAllPrompting", "查看所有定时提醒"),
    stopPrompting: localize("stopPrompting", "停止提醒"),
    stopPromptingTip: (successedCount, failedCount) => {
        return localize("successedStopPromptingTip", "成功停止{0}个提醒", successedCount) +
            ((failedCount > 0) ? localize("failedStopPromptingTip", "，{0}个已经完成提醒，无法停止", failedCount) : "");
    },
    stillNoPrompting: localize("stillNoPrompting", "还没有提醒，快去添加一个吧"),
    stopAllPromptingDone: localize("stopAllPromptingDone", "已经停止所有提醒"),
    createTime: localize("createTime", "创建时间："),
    setTime: localize("setTime", "设置时长："),
    promptingAfter: localize("promptingAfter", " 分钟后提醒")
}