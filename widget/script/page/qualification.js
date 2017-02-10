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
        level: 0
      }
    },
    methods: {
      goIdCertify: function() {
        Helper.openWin('certify');
      },
      goMajorCertify: function() {
        Helper.openWin('certify_major');
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserinfo',
          data: {uid: Helper.getUserId()}
        }).then(function(res) {
          var level = ParseJson(res.data)[0].levle
          console.log(level)
          if (level === '实名用户') {
            self.level = 2
          } else if (level === '普通用户') {
            self.level = 1
          } else if (level === '专业用户') {
            self.level = 3
          } else if (level === '专家用户') {
            self.level = 4
          }
        })
      },
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