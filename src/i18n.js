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
}