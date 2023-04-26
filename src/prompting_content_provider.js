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
        "微博热搜": () => {
            axios.get("https://api.vvhan.com/api/hotlist?type=wbHot")
                .then(res => {
                    const data = res.data;
                    if (data.success) {
                        let text = "";
                        for (let i = 0; i < data.data.length && i < 10; ++i) {
                            const one = data.data[i];
                            text += `<p>标题：${one.title}<br>热度：${one.hot}    <a href='${one.url}'>详情</a></p>`;
                        }
                        hx.window.showInformationMessage(text);
                    }
                })
                .catch(err => {
                    hx.window.setStatusBarMessage('获取热搜榜失败...', 2000, 'error');
                })
        },
        "摸鱼日历": () => {
            axios.get("https://api.vvhan.com/api/moyu", {
                    responseType: 'arraybuffer'
                })
                .then(res => {
                    const moyu = path.join(os.tmpdir(), "moyu.png");
                    fs.writeFileSync(moyu, res.data);
                    hx.window.showInformationMessage(getImageTag(moyu));
                })
                .catch(err=>{
                    hx.window.setStatusBarMessage('获取摸鱼日历失败...', 2000, 'error');
                })
        }
        /* ,
        		"来一张写真": () => {
        			axios.get("/Users/doyoung/MyProject/timing-prompting", {
        					responseType: 'arraybuffer'
        				})
        				.then(res => {
        					const moyu = path.join(os.tmpdir(), "girl.png");
        					fs.writeFileSync(moyu, res.data);
        					hx.window.showInformationMessage(getImageTag(moyu));
        				})
        		} */
    }
}

module.exports = {
    getRandomButtoms
}