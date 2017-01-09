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
        sended: false
      }
    },
    computed: {
      buttonText: function() {
        return this.step === 3 ? '现在去登录' : '下一步'
      }
    },
    methods: {
      getSmsSuccess: function()  {

      },
      doStep_first: function() {
        this.step = this.step + 1
        this.sended = true
      },
      doStep_sencond: function() {
        this.step = this.step + 1

      },
      doStep_third: function() {

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
/* === 测试使用 === */
setTimeout(function() {
  if (!window.api) {
    initPage()
  }
}, 500)

apiready = function(){
  initPage()
}
