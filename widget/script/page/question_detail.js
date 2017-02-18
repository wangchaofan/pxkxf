/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
      this.getIsFoucus()
    },
    data: function() {
      return {
        // wtid: '073cb677-da3b-45ad-8536-9030e3ac5376',
        wtid: api.pageParam.id,
        question: null,
        relateQuestion: null,
        expertTWHDmodel: null,
        isFocus: false,
        commentContent: ''
      }
    },
    computed: {
      focusText: function() {
        return this.isFocus ? '已关注' : '关注'
      }
    },
    methods: {
      viewQuestion: function(q) {
        Helper.openWin('questions_detail', {id: q.expertTWId});
      },
      onFocus: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'apgz',
          data: {userid: Helper.getUserId(), wtid: self.wtid, state: self.isFocus ? 0 : 1}
        }).then(function(res) {
          if (res.key === 'true') {
            self.isFocus = !self.isFocus
          } else {
            api.toast({
                msg: res.mage
            });
          }
        })
      },
      getRelate: function(title) {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getxgwenti',
          data: {title: title}
        }).then(function(res) {
          if (res.key === 'true') {
            self.relateQuestion = ParseJson(res.data)
            console.log(ParseJson(res.data))
          }
        })
      },
      getIsFoucus: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getgzwt',
          data: {userid: Helper.getUserId(), wtid: self.wtid}
        }).then(function(res) {
          self.focus = res.data === '1'
        })
      },
      sendComment: function() {
        $.ajax({
          url: BaseService.apiUrl + 'getgzwt',
          data: {userid: Helper.getUserId(), wtid: self.wtid}
        }).then(function(res) {

        })
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getwtinfo',
          data: {wtid: self.wtid}
        }).then(function(res) {
          if (res.key === 'true') {
            self.question = ParseJson(res.data)[0]
            self.expertTWHDmodel = self.question.ExpertTWHDmodel
            self.getRelate(self.question.twtitle)
            console.log(ParseJson(res.data)[0])
          }
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}