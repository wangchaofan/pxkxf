/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        list: []
      }
    },
    methods: {
      getData: function(pageName) {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getexpertuserinfo',
          data: { exuserid: api.pageParam.id}
        }).done(function(res) {
          self.list = ParseJson(res.data)[0].ExpertRYmodel
          console.log(ParseJson(res.data)[0].ExpertRYmodel)
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
