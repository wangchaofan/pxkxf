/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        userid: Helper.getUserId(),
        usedpwd: '',
        newpwd: '',
        qrpwd: ''
      }
    },
    methods: {
      onSubmit: function() {
        $.ajax({
          url: BaseService.apiUrl + 'updatepwd',
          data: _.pick(this, ['userid', 'usedpwd', 'newpwd', 'qrpwd'])
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
              msg: '修改密码成功'
            })
            setTimeout(function() {
              api.closeWin()
            }, 2000)
          } else {
            api.toast({
              msg: res.mage
            })
          }
        }, function(err) {

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
