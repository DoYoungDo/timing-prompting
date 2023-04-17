const fs = require("fs");
const os = require("os");
const path = require("path");
const hx = require('hbuilderx');
const axios = require("axios").default;

function getImageTag(filePath) {
	return `<img src="${filePath}" width="300", height="500">`;
}

function getRandomButtoms() {
	return {
		"摸鱼日历": () => {
			axios.get("https://api.vvhan.com/api/moyu", {
					responseType: 'arraybuffer'
				})
				.then(res => {
					const moyu = path.join(os.tmpdir(), "moyu.png");
					fs.writeFileSync(moyu, res.data);
					hx.window.showInformationMessage(getImageTag(moyu));
				})
		},
		"来一张写真": () => {
			axios.get("https://api.vvhan.com/api/acgimg", {
					responseType: 'arraybuffer'
				})
				.then(res => {
					const moyu = path.join(os.tmpdir(), "girl.png");
					fs.writeFileSync(moyu, res.data);
					hx.window.showInformationMessage(getImageTag(moyu));
				})
		}
	}
}

module.exports = {
	getRandomButtoms
}