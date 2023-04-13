/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/auto-prompting.js":
/*!*******************************!*\
  !*** ./src/auto-prompting.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx");

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


/***/ }),

/***/ "./src/extension.js":
/*!**************************!*\
  !*** ./src/extension.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx");
const nls = __webpack_require__(/*! hxnls */ "hxnls");
const localize = nls.loadMessageBundle((__webpack_require__(/*! path */ "path").join)(__dirname, 'extension.js'));
const autoPrompting = __webpack_require__(/*! ./auto-prompting */ "./src/auto-prompting.js");
const userPrompting = __webpack_require__(/*! ./user-prompting */ "./src/user-prompting.js");
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

/***/ }),

/***/ "./src/user-prompting.js":
/*!*******************************!*\
  !*** ./src/user-prompting.js ***!
  \*******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

const hx = __webpack_require__(/*! hbuilderx */ "hbuilderx");

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

/***/ }),

/***/ "hbuilderx":
/*!****************************!*\
  !*** external "hbuilderx" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("hbuilderx");

/***/ }),

/***/ "hxnls":
/*!************************!*\
  !*** external "hxnls" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("hxnls");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/extension.js");
/******/ 	module.exports = __webpack_exports__;
/******/ 	
/******/ })()
;
//# sourceMappingURL=extension.js.map