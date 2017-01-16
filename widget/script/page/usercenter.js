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
        },
        dynamic: null,
        skill: null
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
          reload: true,
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
          var data = ParseJson(res.data)[0]
          self.userInfo = data
          console.log(ParseJson(res.data)[0])
          if (data.Dynamicsmodel) {
            self.dynamic = data.Dynamicsmodel[0]
          }
          if (data.skillmodel) {
            self.skill = data.skillmodel[0]
            self.skill.pheadimgUrl = data.pheadimgUrl
          }
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
  })
  api.addEventListener({
      name: 'editAvatarSuccess'
  }, function(ret, err) {
      if (ret) {  
        vm.userInfo.pheadimgUrl = ret.value.avatar
      }
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