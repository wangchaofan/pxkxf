/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        info: null,
        focused: false
      }
    },
    methods: {
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getexpertuserinfo',
          data: {
            exuserid: api.pageParam.id
            // exuserid: '073cb677-da3b-45ad-8536-9030e3ac5375'
          }
        }).then(function(res) {
          if (res.key === 'true') {
            self.info = ParseJson(res.data)[0]
            console.log(ParseJson(res.data)[0])
          }
        })
      },
      onClickFocus: function() {
        var self = this
        if (this.focused) return
        $.ajax({
          url: BaseService.apiUrl + 'addFriends',
          data: {
            userid: Helper.getUserId(),
            hyuserid: self.info.userID
          }
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
                msg: '关注成功'
            })
            self.focused = true
          } else {
            api.toast({
                msg: res.mage
            });
          }
        })
      },
      goPage: function(pageName) {
        if (!this.info) return
        var pageParam = {
          id: this.info.expertId
        }
        if (pageName === 'professor_intro') {
          pageParam.intro = this.info.eintroduce
        }
        api.openWin({
          name: pageName,
          url: 'widget://html/' + pageName + '.html'  ,
          pageParam: pageParam
        })
      }
    }
  })
}

/* === 测试使用 === */
setTimeout(function() {
  if (!window.api) {
    initPage()
  }
}, 500)

apiready = function(){
  initPage()
}