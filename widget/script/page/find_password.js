/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        step: 1,
        zhpwd: '',
        ms: '',
        sended: false,
        restext: ''
      }
    },
    computed: {
      buttonText: function() {
        return this.step === 3 ? '现在去登录' : '下一步'
      }
    },
    methods: {
      getSmsSuccess: function(res)  {
        if (res.key === 'true') {
          this.sended = true
        }
      },
      doStep_first: function() {
        if (/^1\d{10}$/.test(this.zhpwd)) {
          this.step = this.step + 1
        } else {
          api.toast({msg: '请输入手机号'})
        }
      },
      doStep_sencond: function() {
        var self = this
        if (this.ms === '') {
          api.toast({msg: '请输入验证码'});
          return
        }
        $.ajax({
          url: BaseService.apiUrl + 'zhpwd',
          data: {
            userzh: this.zhpwd,
            ms: this.ms
          }
        }).then(function (res) {
          if (res.key === 'true') {
            self.restext = res.data
            self.step = self.step + 1
          } else {
            api.toast({msg: res.mage})
          }
        }, function(err) {

        })
      },
      doStep_third: function() {
        api.closeToWin({
          name: 'login'
        })
      },
      onSubmit: function() {
        if (this.step === 1) {
          this.doStep_first()
        } else if (this.step === 2) {
          this.doStep_sencond()
        } else {
          this.doStep_third()
        }
      }
    }
  })
}


apiready = function(){
  initPage()
}
