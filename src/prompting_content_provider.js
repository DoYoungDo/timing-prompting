const fs = require("fs");
const os = require("os");
const path = require("path");
const hx = require('hbuilderx');
const axios = require("axios").default;

function getImageTag(filePath) {
    return `<img src="${filePath}" width="300", height="500">`;
}

function showWeiBoHot() {
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
}

function showMoyu() {
    axios.get("https://api.vvhan.com/api/moyu", {
            responseType: 'arraybuffer'
        })
        .then(res => {
            const moyu = path.join(os.tmpdir(), "moyu.png");
            fs.writeFileSync(moyu, res.data);
            hx.window.showInformationMessage(getImageTag(moyu), ["保存图片", "关闭"])
                .then(result => {
                    if (result === "保存图片") {
                        const distMoyu = path.join(os.homedir(), "moyu.png");
                        fs.copyFile(moyu, distMoyu, (err) => {
                            if (err) {
                                hx.window.setStatusBarMessage('保存失败...', 2000, 'error');
                            }
                            else {
                                hx.window.setStatusBarMessage('保存成功，图片路径：' + `<a href="file://${distMoyu}">` + distMoyu + "</a>", 5000, 'info');
                            }
                        });
                    }
                });
        })
        .catch(err => {
            hx.window.setStatusBarMessage('获取摸鱼日历失败...', 2000, 'error');
        })
}

function getRandomButtoms() {
    return {
        "微博热搜": showWeiBoHot,
        "摸鱼日历": showMoyu
    }
}

module.exports = {
    getRandomButtoms,
    showWeiBoHot,
    showMoyu
}