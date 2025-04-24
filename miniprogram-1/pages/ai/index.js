// pages/ai/index.js
Page({
  data: {
    query: "",
    result: "",
    input: "",
    messages: [],
  },
  // 获取转盘界面传过来的数据
  onLoad(options) {
    const messages = [
      {
        role: "system",
        content:
          "您用易经转盘算“" +
          options.content +
          "”的结果为：" +
          options.result +
          "此对话已接入DeepSeek，欢迎您向我提问！",
      },
    ];
    this.setData({
      messages: messages,
    });
  },
  start() {
    if (this.data.input !== "") {
      const messages = this.data.messages;
      messages.push({
        role: "user",
        content: this.data.input,
      });
      this.setData({
        messages: messages,
        input: "",
      });
      const resTask = wx.request({
        url: "https://api.deepseek.com/chat/completions",
        method: "POST",
        enableChunked: true,
        timeout: 300000,
        header: {
          "Content-Type": "application/json",
          Authorization: "Bearer <Your Key>",
        },
        data: {
          model: "deepseek-chat",
          stream: true,
          messages: this.data.messages,
        },
        success: (res) => {
          console.log("请求成功");
        },
      });
      messages.push({
        role: "system",
        content: "加载中...请稍等",
      });
      this.setData({
        messages: messages,
      });
      var i = 0;
      const state = resTask.onChunkReceived((res) => {
        const uint8Array = new Uint8Array(res.data);
        const decoder = new TextDecoder();
        const str = decoder.decode(uint8Array);
        while (i <= 0) {
          messages[messages.length - 1].content = "";
          this.setData({
            messages: messages,
          });
          console.log("已去除加载");
          i++;
        }
        const lines = str
          .split("\n")
          .filter((item) => item != "")
          .map((item) => {
            try {
              // 移除 "data: " 前缀
              const jsonStr = item.replace(/^data: /, "");
              const content = JSON.parse(jsonStr).choices[0].delta.content;
              messages[messages.length - 1].content += content;
              this.setData({
                messages: messages,
              });
              wx.pageScrollTo({
                scrollTop: 200000,
                duration: 100,
              });
              return content;
            } catch (e) {
              console.error("解析失败:", e.message);
              return null; // 标记无效项
            }
          });
      });
      if (state != undefined) {
      }
    } else {
      wx.showModal({
        title: "",
        content: "请输入内容！",
        showCancel: false,
      });
    }
  },
  onInput(e) {
    this.data.input = e.detail.value.trim();
  },
});
