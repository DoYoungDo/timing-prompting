const hx = require('hbuilderx');

//该方法将在插件激活的时候调用
function activate(context) {
    context.subscriptions.push(hx.commands.registerCommand('add.custom.prompting', async (param) => {
        function getFormItems(options) {
            const dialogTitle = ""
            const dialogFooter = ""
            return {
                title: dialogTitle,
                footer: dialogFooter,
                formItems: [{
                        type: "input",
                        name: "projectName",
                        label: "普通输入框",
                        placeholder: "这是一个普通输入框",
                        value: "",
                        disabled: false
                    },
                    {
                        type: "comboBox",
                        name: "functionNameInput",
                        items: ["item1", "item2", "item3"],
                        index: 0
                    },
                    {
                        type: "checkBox",
                        name: "checkBox1",
                        label: "复选框",
                        value: false
                    },
                    {
                        type: "input",
                        name: "projectName1",
                        label: "普通输入框",
                        placeholder: "这是一个普通输入框",
                        value: "",
                        disabled: false
                    }
                ]
            }
        }
        const btnCancelText = "取消(&C)"
        const btnOkText = "确定(&O)"

        const res = await hx.window.showFormDialog({
            ...getFormItems(),
            width: 400,
            height: 300,
            customButtons: [{
                text: btnCancelText
            }, {
                text: btnOkText,
                role: "accept"
            }],
            onOpened: async function() {},
            onChanged: async function(name, value, data) {},
            validate: async function() {}
        })
    }));
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
    activate,
    deactivate
}