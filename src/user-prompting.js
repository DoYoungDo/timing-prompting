const hx = require('hbuilderx');

/* 获取内置时间 */
function getBuiltinTimes() {
	return [
		1000 * 60 * 1,
		1000 * 60 * 5,
		1000 * 60 * 10,
		1000 * 60 * 30,
		1000 * 60 * 60,
		1000 * 60 * 120,
	]
}

/* 获取创建提醒的界面 */
function getCreatePromptinDialog(options) {
	const promptingText = options && options.promptingText !== undefined ? options.promptingText : "";
	const timeItems = options && options.timeItems !== undefined ? options.timeItems : [];
	const times = options && options.times !== undefined ? options.times : 0;
	const customTimeCheck = options && options.customTimeCheck !== undefined ? options.customTimeCheck : false;
	const customTime = options && options.customTime !== undefined ? options.customTime : "5";

	const dialogTitle = "添加提醒";
	const dialogFooter = ""
	return {
		title: dialogTitle,
		footer: dialogFooter,
		// focusItem: "promptingText",
		formItems: [{
				type: "input",
				name: "promptingText",
				placeholder: "请输入提醒内容",
				value: promptingText,
			},
			{
				type: "comboBox",
				name: "times",
				items: timeItems,
				index: times,
				disabled: customTimeCheck
			},
			{
				type: "checkBox",
				name: "customTimeCheck",
				label: "自定义时间",
				value: customTimeCheck
			},
			{
				type: "input",
				name: "customTime",
				placeholder: "输入自定义时间,单位分钟",
				value: customTime,
				disabled: !customTimeCheck
			}
		]
	}
}

/* 添加提醒 */
async function addPrompting() {
	const builtinTimes = getBuiltinTimes();
	const timeItems = builtinTimes.map(time => {
		return time / (1000 * 60) + "分钟";
	})

	const btnCancelText = "取消(&C)"
	const btnOkText = "确定(&O)"
	const res = await hx.window.showFormDialog({
		...getCreatePromptinDialog({
			timeItems
		}),
		width: 400,
		height: 300,
		customButtons: [{
			text: btnCancelText
		}, {
			text: btnOkText,
			role: "accept"
		}],
		onOpened: async function() {},
		onChanged: async function(name, value, data) {
			data.timeItems = timeItems;
			if (name === "customTimeCheck") {
				this.updateForm(getCreatePromptinDialog(data));
			}
		},
		validate: async function(formData) {
			// 校验提醒内容
			if (formData.promptingText === "") {
				this.showError("请输入提醒内容");
				return false;
			}
			// 校验用户输入时间的正确性
			if (formData.customTimeCheck) {
				if (!/^\d+(\.\d+)?/g.test(formData.customTime)) {
					this.showError("请输入正确的时间");
					return false;
				}
			}
			return true;
		}
	})

	// console.log(res);
	if (res && res.code == 0 && res.buttonIndex === 1) {
		const {
			promptingText,
			times,
			customTimeCheck,
			customTime
		} = res.result;

		let time = customTimeCheck ? Number(customTime) * 1000 * 60 : builtinTimes[times];
		// console.log("time", time);
		setTimeout(() => {
			hx.window.showInformationMessage(promptingText);
		}, time);
	}
}

//该方法将在插件激活的时候调用
function activate(context) {
	context.subscriptions.push(hx.commands.registerCommand('add.custom.prompting', addPrompting));
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
	activate,
	deactivate
}