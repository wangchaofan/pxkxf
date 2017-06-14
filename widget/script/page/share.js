function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
    },
    data: function() {
      return {
        content: ''
        // mmoney: api.pageParam.mmoney
      }
    },
    methods: {
      shareTowx: function(scene) {
        var wx = api.require('wx');
        wx.shareWebpage({
          apiKey: 'wx8e9a88ba16112813',
          scene: scene,
          title: '三岔口消防APP',
          description: '全国消防产品、设计、施工供应需求',
          thumb: 'widget://a.jpg',
          contentUrl: 'http://www.sckxiaofang.com/'
        }, function(ret, err) {
          if (ret.status) {
            api.toast({msg: '分享成功'});
          } else {
            api.toast({msg: '分享失败'});
          }
        });
      },
      onSubmit: function() {
        var self = this
        if (_.trim(this.content).length === 0) {
          api.toast({msg: '内容不能为空'});
          return
        }
        $.ajax({
          url: BaseService.apiUrl + 'addFeedback',
          data: {
            userid: Helper.getUserId(),
            content: self.content
          }
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
              msg: '提交成功'
            })
            setTimeout(function() {
              api.closeWin()
            }, 2000)
          } else {
            api.toast({
              msg: res.mage
            });
          }
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
