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
      onSubmit: function() {
        var self = this
        if (_.trim(this.content).length === 0) {
          api.toast({msg: '内容不能为空'})
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
