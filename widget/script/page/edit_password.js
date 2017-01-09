/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        userid: '',
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
          res = JSON.parse(res)
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
