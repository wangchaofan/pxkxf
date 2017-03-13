/**
 * Created by chaofanw on 2017/1/9.
 */
var ALI_PAY_CODE = {
  9000: '支付成功',
  4000: '系统异常',
  4001: '数据格式不正确',
  4003: '该用户绑定的支付宝账户被冻结或不允许支付',
  4004: '该用户已解除绑定',
  4005: '绑定失败或没有绑定',
  4006: '订单支付失败',
  4010: '重新绑定账户',
  6000: '支付服务正在进行升级操作',
  6001: '用户中途取消支付操作',
  0001: '缺少商户配置信息（商户id，支付公钥，支付密钥）',
  0002: '缺少参数（subject、body、amount、tradeNO）',
  0003: '签名错误（公钥私钥错误）'
}

var WX_PAY_CODE = {
  NOAUTH: '商户无此接口权限',
  NOTENOUGH: '余额不足',
  ORDERPAID: '商户订单已支付',
  ORDERCLOSED: '订单已关闭',
  SYSTEMERROR: '系统错误',
  APPID_NOT_EXIST: 'APPID不存在',
  MCHID_NOT_EXIST: 'MCHID不存在',
  APPID_MCHID_NOT_MATCH: 'appid和mch_id不匹配',
  LACK_PARAMS: '缺少参数',
  OUT_TRADE_NO_USED: '商户订单号重复',
  SIGNERROR: '签名错误',
  XML_FORMAT_ERROR: 'XML格式错误',
  REQUIRE_POST_METHOD: '请使用post方法',
  POST_DATA_EMPTY: 'post数据为空',
  NOT_UTF8: '编码格式错误',
}

function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function () {
      return {
        money: '',
        payType: 'ali'
      }
    },
    computed: {
      canSubmit: function () {
        return this.money >= 0.01
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
      paySuccessCallback: function (money) {
        $.ajax({
            url: BaseService.apiUrl + 'zfje',
            data: {
              userid: Helper.getUserId(),
              money: money
            }
          })
          .always(function () {
            setTimeout(function () {
              api.sendEvent({
                name: 'refreshWallet',
              });
              api.closeToWin({
                name: 'mywallet'
              });
            }, 1000);
          });
      },
      sxpaySuccessCallback: function(money) {
        $.ajax({
          url: BaseService.apiUrl + 'Wxzfje',
          data: {
            userid: Helper.getUserId(),
            money: money
          }
        })
        .always(function () {
          setTimeout(function () {
            api.sendEvent({
              name: 'refreshWallet',
            });
            api.closeToWin({
              name: 'mywallet'
            });
          }, 1000);
        });
      },
      getWxPayOrder: function() {
        return $.ajax({
          url: BaseService.apiUrl + 'Wxzf',
          data: {
            userid: Helper.getUserId(),
            money: this.money
          }
        })
      },
      payByWx: function () {
        var self = this;
        this.getWxPayOrder().then(function(res) {
          var data = JSON.parse(res.data)
          var wxPay = api.require('wxPay');
          wxPay.config({
            apiKey: 'wx8e9a88ba16112813',
            mchId: '1436559402',
            partnerKey: '85f1Y2WRbntf4i8taCIqRvHW9oWb3lb6',
            notifyUrl: 'http://120.26.116.143:809/WebServer/Callback.aspx'
          }, function(ret, err) {
            if (ret.status) {
              wxPay.pay({
                description: data.description,
                totalFee: Number(data.totalFee) * 100,
                tradeNo: data.tradeNo,
                spbillCreateIP: '196.168.1.1',
                // deviceInfo: '013467007045764',
                // detail: data.detail,
                // attach: data.attach,
                feeType: 'CNY',
                // timeStart: 2017031214121010,
                // timeExpire: 2017031214151010,
                // goodsTag: 'WXG',
                // productId: '12235413214070356458058',
                // openId: 'oUpF8uMuAJO_M2pxb1Q9zNjWeS6o'
              }, function (ret, err) {
                if (ret.status) {
                  api.alert({
                    title: '提示',
                    msg: '充值成功',
                    buttons: ['确定']
                  })
                  self.sxpaySuccessCallback(data.totalFee)
                } else {
                  if (err.msg) {
                    api.toast({msg: WX_PAY_CODE[err.msg]})
                  } else if (err.code == -2) {
                    api.toast({msg: '取消支付'})
                  } else if (err.code == -1) {
                    api.toast({msg: '未知错误'})
                  }
                }
              })
            } else {
              alert(err.code);
            }
          })
        }, function(err) {
          console.log(JSON.stringify(err))
        })
      },
      payByAli: function () {
        var self = this
        $.ajax({
            url: BaseService.apiUrl + 'zf',
            data: { userid: Helper.getUserId(), money: self.money }
          })
          .then(function (res) {
            if (res.key === 'true') {
              var data = JSON.parse(res.data);
              var aliPay = api.require('aliPay');
              aliPay.pay({
                subject: data.subject,
                body: data.body,
                amount: data.total_amount,
                tradeNO: data.out_trade_no,
                passback_params: Helper.getUserId()
              }, function (ret, err) {
                if (ret.code == 9000) {
                  api.alert({
                    title: '提示',
                    msg: '充值成功',
                    buttons: ['确定']
                  })
                  self.paySuccessCallback(data.total_amount);
                } else {
                  api.toast({msg: ALI_PAY_CODE[ret.code]})
                }
              });
            } else {
              api.toast({ msg: res.mage })
            }
          }, function (err) {
            api.toast({ msg: err.message });
          })
      }
    }
  })
}

apiready = function () {
  initPage()
}
