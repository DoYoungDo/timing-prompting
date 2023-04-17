const os = require("os")
const fs = require("fs")
const path = require("path")

const configDir = path.join(os.homedir(), ".timing-prompting");
if (!fs.existsSync(configDir)) {
	fs.mkdirSync(configDir)
}

const configPath = path.join(configDir, "config.json")
let configCache = null;

function init() {
	try {
		if (!fs.existsSync(configPath)) {
			configCache = {}
			fs.writeFileSync("{}")
		} else {
			configCache = JSON.parse(fs.readFileSync(configPath).toString())
		}
	} catch (e) {
		console.log(e);
	}
}

function saveConfig() {
	try {
		fs.writeFileSync(configPath, JSON.stringify(configCache))
	} catch (e) {
		//TODO handle the exception
	}
}

/**
 * @param string key
 * - CONFIG_KEY_CREATE_PROMPTING_DIALOG 添加定时提醒界面数据
 */
function getConfig(key) {
	if (configCache === null) {
		init()
	}
	return configCache[key]
}

function setConfig(key, value, save = false) {
	if (configCache === null) {
		init()
	}
	configCache[key] = value
	if (save) {
		saveConfig()
	}
}

module.exports = {
	getConfig,
	setConfig
}