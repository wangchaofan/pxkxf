/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      if (this.userid) {
        this.getUserInfo()
      }
    },
    data: function() {
      return {
        userid: Helper.getUserId(),
        userInfo: {
          pheadimgUrl: '../image/default_avatar.png'
        }
      }
    },
    computed: {
      avatarStyle: function() {
        return 'background-image:url('+ this.userInfo.pheadimgUrl +')'
      }
    },
    methods: {
      goPage: function(pageName) {
        if (!this.userid) {
          pageName = 'login'
        }
        api.openWin({
          name: pageName,
          url: 'widget://html/' + pageName + '.html',
          pageParam: {

          }
        })
      },
      getUserInfo: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserinfo',
          data: { uid: self.userid }
        }).then(function(res) {
          self.userInfo = ParseJson(res.data)[0]
        })
      }
    }
  })

  api.addEventListener({
    name: 'loginSuccess'
  }, function(ret, err) {
    if (ret) {
      vm.userid =  Helper.getUserId()
      vm.getUserInfo()
    }
  })
  api.addEventListener({
    name: 'logoutSuccess'
  }, function(ret, err) {
    vm.userid =  Helper.getUserId()
    vm.userInfo.pheadimgUrl = '../image/default_avatar.png'
  });
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