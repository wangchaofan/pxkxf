/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        money: 1,
        payType: 'ali'
      }
    },
    computed: {
      canSubmit: function() {
        return this.money > 0
      }
    },
    methods: {
      onSelectPayType: function (val) {
        this.payType = val
      },
      onSubmit: function () {
        if (!this.canSubmit) return
        this.payType === 'ali' ? this.payByAli() : this.payByWx()
      },
      payByWx: function () {

      },
      payByAli: function () {
        var self = this
        var aliPay = api.require('aliPay');
        aliPay.config({
          partner: '2088102169313619',
          seller: '2088102169313619',
          rsaPriKey: 'MIIEowIBAAKCAQEA7MYjdpPBEuyruwslMuIPYZe08078DLM8trdALxJ7fPBbN6NPm5UaeOHdD0LHLNNedgZh0AyyLHzAhrzonqHzJsLx39TCiLkC1BUsQt7KFTnPwOcvGk0vzwwFYWe8A8aN+FcF7TPRhKm4Z926shCh7sEQmOdB1PVOdp8dbul9saQHCRjtPA5cmgVq8wKnYlsICzDjzgpcLTFKAftfvWd4ZFrk0+MdCH6CXS7IyU2ZAQ3xoR8b2GqpHHHccikbx447L+l2ifaN1UHDTpuqBTDXYToicz8zogTW8AKqbmmNJEUzdRr/hMKwRPzkuAEVjzxuY9HwmNKBZl68bhFEvobL9wIDAQABAoIBAEdU6hovKVuqMZKIKQzLThb4vWsPwJ+S4Ber3YpQ5yMcxl5ctP8KTI9efFq8o4S9qRellJI5QPRmIRp2jx47bCWhVX05e+H02wVJ26vJstfyMsTK4UXrOxwFYxmVRu9cQikvDnoHwndVKlkgU76RhDeJspZeFVczEBBsn1FqxpNdYuGLduMw13z0Tb+28FyB2B6Vxl1+aY9RRvAxkWTH8c5+YzXSJx2VDFgY4dPjqVD8DLY0W/l6LjSjeCSSqA9QutjipYzTh0FX8la1jlRMrqhs0iMVTz+pIz1qFzJS5whb90U4XKfopAdEnn7yxzE+FB/rm5HoDwzU82pp0iNspQECgYEA+x4dyJ1g6gkD8zUGnc0jTJIz8gOhzYl6ziNIg7EUC8QFU/LEj56oaLg4wD7jvCDoJEmvu4HQm45phs3+VfKe9/O5JVbbL8OL1cunqGgTtcWRXkG5xh1vv6fp5ZDFanbGNCty7TuwGLp3ccui8tXALxNMZKoRDeNdBZ8uS7DAtSUCgYEA8WChNJyAtMX2IFnuIw4iuCXTY6Qst/PbiYr73QDLdKIy5hbH4DELFH64tJAmrve6Xr0TB8hqPRPR0MP5pkXiRMUkThg6ObOJRvE3kkoyQN4ahcAna5YbfAUfjiTf+ADasoOKlqN0Wyw5cgwXhWvUI4qc1xBQ/3sSTqx8HqOSh+sCgYEAhO3YTk4g80J6eM/lBLuGqA3suXv6ttbDz0MWK8AdIG1PdLTaIDyYYXbDc+DWpMu2lx76i4OYbf/hFJ8Ot2iLhi3aIE3uEUauSypXQep2JI7E+ORJ9vm2Ifo88mzEVCszmII3gCVMfoqWmAJ365wC8+h/U/pCtNtabpNo6mBSYpECgYB3XVq64r3/J3pMi0xpR39B42rC9pgqq8wgG3vr0Y3Lcr6K7C8Rng8lpnj+yd5nXhhq60Ny8NggtiFnBNL7N8nqSjdm6zI4AKHdVEIv9MMfMvaYt+qGmKekz//H0lJzmTCNYOFzFwfeYmNSE8q57xXsMYrYC7iSbrEh+Mg0ep1m2wKBgG2h20TMZnTN29Uay9aq76FzqqwaSjx3NqgL4rWaVcaqJBq1WFyDdLnFNM2hNDBWkIDpXHvu0T4rJ4GS2zpGMGZDTnSHdodldztJHARpZHiB7Zavs+3JFT9nEfD17f8qCj2+0PM5sDqUl9R0E0o3oZUOH8GQC5OShhBwmrUaLPcE',
          rsaPubKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAyWK5k9quRUuzdLC49hjzlp9icXj1F5Ek9dmHa6ka3vbl0nwOsauvCDqSikvVGhxvqBJOU8F3DilhmzZfVALXkUeEe9rwMIMdrzp7EMLSW7UmDAHPvEJ3pb99lEgiPBKoF++2TcXYOywFW9aY4fGfmxbSo9TSaUfXRzoFh+MXexMb/dy8rZXPUDqreWhLmvuDZV9yhM0roECYTkMUoLyOJP4RbQcUt5VSAda2bu4+eBfJYuPoMZ7IO5cpNG5wyX8yN2wbPQnJ1pvYAeIqBrrczR+3Hb0ZYWxJItcLhUl+OxuU/vjZYvXCg2Oduoj9XLIMEadRG0Xt9vfkpWhxNjVcSQIDAQAB',
          notifyURL: 'http://120.26.116.143:809/WebServer/Callback.aspx'
        }, function(ret, err) {
          $.ajax({
            url: BaseService.apiUrl + 'zf',
            data: {userid: Helper.getUserId(), money: self.money}
          }).then(function(res) {
            var data = ParseJson(res.data)
            if (res.key === 'true') {
              aliPay.pay({
                subject: data.subject,
                body: data.body,
                amount: data.total_amount,
                tradeNO: data.out_trade_no
              }, function (ret, err) {
                api.alert({
                  title: '支付结果',
                  msg: JSON.stringify(ret),
                  buttons: ['确定']
                });
              });
            }
          })
        });
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