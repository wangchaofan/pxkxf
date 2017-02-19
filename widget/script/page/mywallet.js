/**
 * Created by chaofanw on 2017/1/9.
 */
Vue.filter('currency', function(val) {
  console.log(val)
  return parseFloat(val).toFixed(2)
})
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        walletInfo: {}
      }
    },
    methods: {
      goPage: function(pageName) {
        api.openWin({
            name: pageName,
            url: 'widget://html/' + pageName + '.html',
            pageParam: {
                name: 'value'
            }
        });
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getwallet',
          data: { userid: Helper.getUserId() }
        }).then(function(res) {
          if (res.key === 'true') {
            self.walletInfo = ParseJson(res.data)[0]
            console.log(ParseJson(res.data))
          }
        })
      }
    }
  })

  api.addEventListener({
    name: 'refreshWallet'
  }, function(ret, err){
    vm.getData();
  });
}

apiready = function(){
  initPage()
}