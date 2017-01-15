/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        phonestate: api.pageParam.phonestate
      }
    },
    methods: {
      setPhoneState: function(state) {
        if (state == this.phonestate) return
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'phonstate',
          data: {
            userid: Helper.getUserId(),
            state: state
          }
        }).then(function(res) {
          if (res.key === 'true') {
            self.phonestate = state
          } else {
            api.toast({
              msg: res.mage
            })
          }
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