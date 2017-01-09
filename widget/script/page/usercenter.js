/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getUserInfo()
    },
    data: function() {
      return {
        userInfo: {},
      }
    },
    computed: {
      avatarStyle: function() {
        return 'background-image:url('+ this.userInfo.pheadimgUrl +')'
      }
    },
    methods: {
      getUserInfo: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserinfo',
          data: { uid: MockData.userid }
        }).then(function(res) {
          self.userInfo = ParseJson(res.data)[0]
          console.log(ParseJson(res.data)[0])
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