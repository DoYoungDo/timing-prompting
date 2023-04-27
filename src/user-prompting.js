const os = require('os');
const fs = require('fs');
const path = require('path');
const hx = require('hbuilderx');
const {
	nanoid
} = require("nanoid");
const i18n = require("./i18n");
const {
	getConfig,
	setConfig
} = require("./config");
const {
	getRandomButtoms
} = require('./prompting_content_provider');

// 全局保存的提醒 key:uuid value:{createTime:number,duration:number,promptingText:string,closeByHand:boolean}
const g_prompings = new Map();

/* 获取内置时间 */
function getBuiltinTimes() {
	return [
		1000 * 60 * 1,
		1000 * 60 * 5,
		1000 * 60 * 10,
		1000 * 60 * 20,
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
	const customTime = options && options.customTime !== undefined ? options.customTime : "";
	const closeByHand = options && options.closeByHand !== undefined ? options.closeByHand : false;

	const dialogTitle = i18n.dialogTitle;
	const dialogFooter = ""
	return {
		title: dialogTitle,
		footer: dialogFooter,
		focusName: "promptingText",
		formItems: [{
				type: "input",
				name: "promptingText",
				placeholder: i18n.pleaseInputPromptingTextContent,
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
				label: i18n.customTime,
				value: customTimeCheck
			},
			{
				type: "input",
				name: "customTime",
				placeholder: i18n.pleaseInputCustomTime,
				value: customTime,
				disabled: !customTimeCheck
			},
			{
				type: "checkBox",
				name: "closeByHand",
				label: i18n.needCloseByHand,
				value: closeByHand
			}
		]
	}
}

/* 添加提醒 */
async function addPrompting() {
	const builtinTimes = getBuiltinTimes();
	const timeItems = builtinTimes.map((time, index) => {
		return time / (1000 * 60) + " " + (index === 0 ? i18n.minute : i18n.minutes);
	})
	const config = (() => {
		try {
			const cf = getConfig("CONFIG_KEY_CREATE_PROMPTING_DIALOG");
			return cf ? cf : {};
		} catch (e) {
			return {};
		}
	})();

	const btnOkText = i18n.btnOkText;
	const btnCancelText = i18n.btnCancelText;
	const res = await hx.window.showFormDialog({
		...getCreatePromptinDialog({
			timeItems,
			...config
		}),
		width: 440,
		height: 360,
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
				this.showError(i18n.promptingTextCannotBeEmpty);
				return false;
			}
			// 校验用户输入时间的正确性
			if (formData.customTimeCheck) {
				if (!/^\d+(\.\d{1,3})?$/.test(formData.customTime)) {
					this.showError(i18n.pleaseInputValidTime);
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
			customTime,
			closeByHand
		} = res.result;

		try {
			// 写配置文件
			setConfig("CONFIG_KEY_CREATE_PROMPTING_DIALOG", res.result, true);
		} catch (e) {}

		// 计算定时时间
		let time = customTimeCheck ? Number(customTime) * 1000 * 60 : builtinTimes[times];
		// console.log("time", time);
		// 保存到全局
		let id = nanoid();
		g_prompings.set(id, {
			createTime: Date.now(),
			duration: time,
			promptingText,
			closeByHand
		});

		// 定时提示
		setTimeout(() => {
			// 如果已经不存在则不再提醒
			if (!g_prompings.has(id)) {
				return;
			}
			// 判断是否需要手动关闭
			if (closeByHand) {
				hx.window.showMessageBox({
					type: 'info',
					title: i18n.promptingTitle,
					text: promptingText,
					buttons: [i18n.btnOkText1]
				});
			} else {
				const btns = [];
				const randomBtns = (getRandomButtoms)();
				for (btn in randomBtns) {
					btns.push(btn)
				}
				hx.window.showInformationMessage(promptingText, btns).then(result => {
					const callback = randomBtns[result];
					if (callback) {
						callback();
					}
				});
			}
			// 移除已经提醒的项
			g_prompings.delete(id);
		}, time);
	}
}

function promptingToListItems() {
	const {
		format
	} = require('date-fns')

	const items = [];
	for (let [key, value] of g_prompings) {
		const columns = [];
		columns.push({
			label: value.promptingText + ""
		});
		columns.push({
			label: i18n.createTime + format(value.createTime, 'yyyy-MM-dd hh:mm:ss')
		});
		columns.push({
			label: i18n.setTime + (value.duration / (1000 * 60)) + i18n.minute
		});
		columns.push({
			label: (new Date(value.createTime + value.duration - Date.now()).getTime() / (1000 * 60)).toFixed(
				3) + i18n.promptingAfter
		});

		items.push({
			columns,
			key
		});
	}
	return items;
}

/* 查看所有定时提醒 */
async function viewAllPrompting() {
	let dialog = null;
	let items = [];

	function getFormItems(options) {
		items = promptingToListItems();
		const dialogTitle = i18n.viewAllPrompting;
		const dialogFooter = ""
		return {
			title: dialogTitle,
			footer: dialogFooter,
			formItems: [{
				type: "list",
				name: "promptings",
				columnStretches: [1, 1, 1, 1],
				items,
				value: [0],
				refreshable: true,
				multiSelection: true,
				onRefresh: () => {
					if (dialog) {
						dialog.updateForm(getFormItems());
					}
				}
			}]
		}
	}
	const btnCancelText = i18n.btnCancelText;
	const btnOkText = i18n.btnOkText;

	const res = await hx.window.showFormDialog({
		...getFormItems(),
		width: 700,
		height: 550,
		customButtons: [{
			text: i18n.stopPrompting
		}, {
			text: btnOkText,
			role: "accept"
		}],
		onOpened: async function() {
			dialog = this;
		},
		onChanged: async function(name, value, data) {},
		validate: async function(formData) {
			return true;
		}
	})

	if (res && res.code === 0 && res.buttonIndex === 0) {
		const {
			promptings
		} = res.result;
		if (promptings.length > 0) {
			const stopItems = [];
			for (let index of promptings) {
				stopItems.push(items[index]);
			}
			const successed = [];
			const failed = [];
			for (let item of stopItems) {
				if (g_prompings.has(item.key)) {
					g_prompings.delete(item.key);
					successed.push(item.key);
				} else {
					failed.push(item.key);
				}
			}
			hx.window.setStatusBarMessage(i18n.stopPromptingTip(successed.length, failed.length), 3000, 'info');
		}
	}
}

/* 关闭所有提醒 */
function closeAllPrompting() {
	// 如果有则清理，没有则提示添加
	if (g_prompings.size === 0) {
		hx.window.setStatusBarMessage(i18n.stillNoPrompting, 3000, 'warn');
	} else {
		g_prompings.clear();
		hx.window.setStatusBarMessage(i18n.stopAllPromptingDone, 3000, 'info');
	}
}

//该方法将在插件激活的时候调用
function activate(context) {
	context.subscriptions.push(hx.commands.registerCommand('add.custom.prompting', addPrompting));
	context.subscriptions.push(hx.commands.registerCommand('view.all.prompting', viewAllPrompting));
	context.subscriptions.push(hx.commands.registerCommand('close.all.prompting', closeAllPrompting));
	context.subscriptions.push(hx.commands.registerCommand('show.moyu.calendar', ()=>{
        const provider = require("./prompting_content_provider");
        provider.showMoyu();
    }));
	context.subscriptions.push(hx.commands.registerCommand('show.weibo.hot', ()=>{
        const provider = require("./prompting_content_provider");
        provider.showWeiBoHot();
    }));
}
//该方法将在插件禁用的时候调用（目前是在插件卸载的时候触发）
function deactivate() {

}
module.exports = {
	activate,
	deactivate
}