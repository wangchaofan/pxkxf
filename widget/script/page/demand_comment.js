
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        supplyer: api.pageParam.user.usermodel[0],
        comment: {
          userid: Helper.getUserId(),
          xqid: api.pageParam.orderId,
          pprid: api.pageParam.user.usermodel[0].lUserId,
          fraction  : 0, // 供应评分
          userscore: 0, // 供应人评分
          describe: ''
        }
        }
    },
    methods: {
      selectGyScore: function(n) {
        this.comment.fraction = n
      },
      selectGpScore: function(n) {
        this.comment.userscore = n
      },
      validate: function() {
        if (this.comment.describe === '') {
          api.toast({msg: '请填写评价内容'}) 
          return false
        } else if (this.comment.jlpj === 0) {
          api.toast({msg: '请给供应评分'}) 
          return false
        } else if (this.comment.rpj === 0) {
          api.toast({msg: '请给供应人评分'}) 
          return false
        }
        return true
      },
      onSubmit: function() {
        if (!this.validate()) return;
        var self = this;
        $.ajax({
          url: BaseService.apiUrl + 'xqpj',
          data: this.comment
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({msg: '评价成功'});
            api.sendEvent({
              name: 'refreshMyDemand'
            });
            setTimeout(function() {
              api.closeWin();
            }, 1000)
          } else {
            api.toast({msg: res.mage})
          }
        }, function(err) {
          alert(JSON.stringify(err))
        })
      }
    }
  })
}
apiready = function(){
  initPage()
}
