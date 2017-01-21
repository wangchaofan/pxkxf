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
      onSelectPayType: function(val) {
        this.payType = val
      },
      onSubmit: function () {
        if (!this.canSubmit) return
        this.payType === 'ali' ? this.payByAli() : this.payByWx()
      },
      payByWx: function() {

      },
      payByAli: function() {
        var self = this
        var aliPayPlus = api.require('aliPayPlus');
        aliPayPlus.config({
          appId: '2017011805188526',
          rsaPriKey: 'MIIEpAIBAAKCAQEA6OoxLyShKB9tCuliT3/CtEBHW9DNyPXM162m9I5Dfl2cjPK/TTzV4nqrsGtz4Ki3cucl/XcyChZgxG0/IF1c2m4hFQCZgJrHde4U7tLB5n9UKCnZDV7AvUaPxERC9uW0GHVMAlW9BpOciI4/SRWA5x45Whwf5UShKIsN/Hu5zjkxKoOMgw8P2S97JVNDLaqQ36oxhH+mW96xu/prTE/2d8IoFVWwg1U60OpM9q3Rf56r8JZf0dF/nQVQSBginXsFUnJDnfEzTynppNoTJqi/opPQzjCN70Nxhxc6eyUvX/8Um429uTEx5AFwO7suH+ayWx0nrG8d826FqYepyvMLkQIDAQABAoIBAGOOfxmEkbIhxK1OVuxeUu5TL21Kkjuc/UMPgfa0vJrODrWcqTKtl0roXmzZcT2NQGTH8tAl2+i96fzsKXh/D8p6Gn/ssrBq+GkrLB1tTt5kfKdyQ8nYP5BoEdm1x93bD6EIukWhOlwOSnGARALMQz4HCELBFM0eCbjXv1G13RUNQnPY26eQzkg+lvMuCi8bPxr5zA42FAGWoOogeEniurIt4f3Hq9ORg3ppD8NAksd5bdQjZiK9TXCrmn2dVo4JO+iTaR4nljIHV4EYWqdFC/A4A0au0XHk0Xwv+rzzqJQva6lg7JonVElPXE/1RjPG7q5oB2+6YAeCfDneA7gusbECgYEA+F6M6Dr1mD9yIHCNooN4krE1CFbOe8zphQa+uBSchKrU9/P/PEXax7eqa0pQpnntcDWX3WRC4D08DD40bw8cNYcMxvRthwttAV+BeaUB6C0o2KTWRGde4q6kZw8ep/MWKEJQLlYQYP7QKumw5ci0a9imREUrapVOS2mIChSCvN0CgYEA8BIXH/phaGJhDXNNlFXjPACOJ5jxDWQZ1+K0FEjhoomdhnA5rh83nlWIM/Ra2LgtO38uC8oJMCFLw4Lb3jiNMya5jk286fsueiWG1+PbpttqFBLaQQsvU6CSIFVLTSZgxw5FZF79MI1trjOREQiC/hxFGkFsVUllEjXjlyOKdEUCgYAx34qb93rpn5PjP7axM4U6r6reic/cvEEIHVqezETBvywUvkI6cCyGfjMSaFHZnBI5vglIw6FKNgGg07zjsD0R4pSGPv7fZ0P0SqFNM/02ChtxpWgBRGChVEBfEYIuZ3nDi81eAJo5X/GdLGABRFQ2c8KvYtRdCq42JnLS01uNYQKBgQCCaFFHfasMGOS/ebLasQ0Ouv59ZAcNTyL6sps/qZdnw3leXff3Ld34lF24WzQ+JU3s09kfblAvZObS/XKR9AY/kvmY44GLWHaWw2vMOmpG6UlmPhdw3bKHquG1zp9o+T/44TewnijLBwhdaIWUyxrdDl47NO60JXpRuhQ3NYcwQQKBgQDwyHBuW+tvnitHiaem72TQuds+W6QMb1GUoOQCkMXU91KuhlRZ1bkcugAfSuL/BIWMHHpJeLS88GhHJRi/oPcRC49Xti2PV7KEHgwnaSfzs1/JFLMxA4PnEkuiHnx0IFxndXNfMkQWiUjKGIooFw1cYqWCKhfbtEoBvQjb96+IBg==',
          //rsaPriKey: 'MIIEpAIBAAKCAQEA6OoxLyShKB9tCuliT3/CtEBHW9DNyPXM162m9I5Dfl2cjPK/TTzV4nqrsGtz4Ki3cucl/XcyChZgxG0/IF1c2m4hFQCZgJrHde4U7tLB5n9UKCnZDV7AvUaPxERC9uW0GHVMAlW9BpOciI4/SRWA5x45Whwf5UShKIsN/Hu5zjkxKoOMgw8P2S97JVNDLaqQ36oxhH+mW96xu/prTE/2d8IoFVWwg1U60OpM9q3Rf56r8JZf0dF/nQVQSBginXsFUnJDnfEzTynppNoTJqi/opPQzjCN70Nxhxc6eyUvX/8Um429uTEx5AFwO7suH+ayWx0nrG8d826FqYepyvMLkQIDAQABAoIBAGOOfxmEkbIhxK1OVuxeUu5TL21Kkjuc/UMPgfa0vJrODrWcqTKtl0roXmzZcT2NQGTH8tAl2+i96fzsKXh/D8p6Gn/ssrBq+GkrLB1tTt5kfKdyQ8nYP5BoEdm1x93bD6EIukWhOlwOSnGARALMQz4HCELBFM0eCbjXv1G13RUNQnPY26eQzkg+lvMuCi8bPxr5zA42FAGWoOogeEniurIt4f3Hq9ORg3ppD8NAksd5bdQjZiK9TXCrmn2dVo4JO+iTaR4nljIHV4EYWqdFC/A4A0au0XHk0Xwv+rzzqJQva6lg7JonVElPXE/1RjPG7q5oB2+6YAeCfDneA7gusbECgYEA+F6M6Dr1mD9yIHCNooN4krE1CFbOe8zphQa+uBSchKrU9/P/PEXax7eqa0pQpnntcDWX3WRC4D08DD40bw8cNYcMxvRthwttAV+BeaUB6C0o2KTWRGde4q6kZw8ep/MWKEJQLlYQYP7QKumw5ci0a9imREUrapVOS2mIChSCvN0CgYEA8BIXH/phaGJhDXNNlFXjPACOJ5jxDWQZ1+K0FEjhoomdhnA5rh83nlWIM/Ra2LgtO38uC8oJMCFLw4Lb3jiNMya5jk286fsueiWG1+PbpttqFBLaQQsvU6CSIFVLTSZgxw5FZF79MI1trjOREQiC/hxFGkFsVUllEjXjlyOKdEUCgYAx34qb93rpn5PjP7axM4U6r6reic/cvEEIHVqezETBvywUvkI6cCyGfjMSaFHZnBI5vglIw6FKNgGg07zjsD0R4pSGPv7fZ0P0SqFNM/02ChtxpWgBRGChVEBfEYIuZ3nDi81eAJo5X/GdLGABRFQ2c8KvYtRdCq42JnLS01uNYQKBgQCCaFFHfasMGOS/ebLasQ0Ouv59ZAcNTyL6sps/qZdnw3leXff3Ld34lF24WzQ+JU3s09kfblAvZObS/XKR9AY/kvmY44GLWHaWw2vMOmpG6UlmPhdw3bKHquG1zp9o+T/44TewnijLBwhdaIWUyxrdDl47NO60JXpRuhQ3NYcwQQKBgQDwyHBuW+tvnitHiaem72TQuds+W6QMb1GUoOQCkMXU91KuhlRZ1bkcugAfSuL/BIWMHHpJeLS88GhHJRi/oPcRC49Xti2PV7KEHgwnaSfzs1/JFLMxA4PnEkuiHnx0IFxndXNfMkQWiUjKGIooFw1cYqWCKhfbtEoBvQjb96+IBg=='
        }, function(ret, err) {
          if (ret.status == true) {
            $.ajax({
              url: BaseService.apiUrl + 'zf',
              data: {userid: Helper.getUserId(), money: self.money}
            }).then(function(res) {
              //alert(res.data)
              //var data = ParseJson(res.data)
              //aliPayPlus.pay({
              //  subject: '充值金额1元',
              //  body: '余额充值',
              //  amount: 1,
              //  tradeNO: 'B20170121010720225'
              //}, function(ret, err) {
              //  api.alert({
              //    title: '支付结果',
              //    msg: JSON.stringify(ret),
              //    buttons: ['确定']
              //  });
              //});
              var data = ParseJson(res.data)
              if (res.key === 'true') {
                aliPayPlus.pay({
                  subject: data.subject,
                  body: data.body,
                  amount: data.total_amount,
                  tradeNO: data.out_trade_no
                }, function(ret, err) {
                  api.alert({
                    title: '支付结果',
                    msg: JSON.stringify(ret),
                    buttons: ['确定']
                  });
                });
              }
            })
          }
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