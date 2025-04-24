// index.js
Page({
  data: {
    runDegs: 0,
    List: [{
      name: '​​坎',
      deg: 22.5 + 'deg'
    }, {
      name: '​​艮',
      deg: 67.5 + 'deg'
    }, {
      name: '​​震',
      deg: 112.5 + 'deg'
    }, {
      name: '​​巽',
      deg: 157.5 + 'deg'
    }, {
      name: '​​离',
      deg: 202.5 + 'deg'
    }, {
      name: '​坤​​',
      deg: 247.5 + 'deg'
    }, {
      name: '​兑',
      deg: 292.5 + 'deg'
    }, {
      name: '​​乾',
      deg: 337.5 + 'deg'
    }],
    start: '开始',
    content: '',
    content2: '',
    result:'',
    display: false,
  },
  onInput(e) {
    this.data.content = e.detail.value.trim();
    if (e.detail.value === '') {
      this.setData({
        display: false,
      })
    }
  },
  // 点击开始或再来一次执行的函数
  go() {
    if (this.data.content !== '') {
      const animation = wx.createAnimation({
        duration: 5000,
        timingFunction: "ease"
      });
      const award = Math.floor(Math.random() * 8 + 1)
      console.log('第' + award + '个');
      // 旋转到随机的结果
      this.runDegs = this.runDegs || 0;
      this.runDegs = this.runDegs + (360 - this.runDegs % 360) + (360 * 8 - award * (45)) + 22.5;
      animation.rotate(this.runDegs).step();
      this.setData({
        animationData: animation.export(),
      });
      // 旋转结束时跳出结果弹窗
      setTimeout(() => {
        wx.showModal({
          title: '',
          content: '结果为：' + this.data.List[award - 1].name,
          showCancel: false
        });
        this.setData({
          start: '再来一次',
          result:this.data.List[award - 1].name,
          content2: this.data.content,
          content: '',
          display: true,
        });
      }, 5000);
    } else {
      wx.showModal({
        title: '',
        content: "请输入内容！",
        showCancel: false
      });
      this.setData({
        input:""
      })
    }
  },
  toAskDS() {
    wx.navigateTo({
      url: `/pages/ai/index?content=${this.data.content2}&result=${this.data.result}`,
    })
  }
})