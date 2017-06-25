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
        wtid: api.pageParam.id,
        question: null,
        relateQuestion: null,
        expertTWHDmodel: null,
        isFocus: false,
        commentContent: '',
        isMyQuestion: false
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
        var self = this;
        if (this.commentContent.length === 0) return;
        $.ajax({
          url: BaseService.apiUrl + 'addhdtwinfo',
          data: {
            hduserid: Helper.getUserId(),
            twid: self.wtid,
            content: self.commentContent
          }
        }).then(function(res) {
          if (res.key == 'true') {
            self.commentContent = '';
            self.getData();
          } else {
            api.toast({msg: res.mage});
          }
        }, function(err) {
          api.toast({msg: err.message});
        })
      },
      handleConfirmAnswer: function(answer) {
        api.confirm({
          title: '提示',
          msg: '是否确认选择此回答？',
          buttons: ['确定', '取消']
        }, function(ret, err) {
          if (ret.buttonIndex === 1) {
            $.ajax({
              url: BaseService.apiUrl + 'getuodatehd',
              data: { hdid: answer.expertTWHD }
            }).then(function(res) {
              if (res.key === 'true') {
              } else {
                api.toast({msg: err.message});
              }
            }).catch(function(err) {
            })
          }
        })
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getwtinfo',
          data: {wtid: self.wtid}
        }).then(function(res) {
          if (res.key === 'true') {
            self.question = ParseJson(res.data)[0];
            self.expertTWHDmodel = self.question.ExpertTWHDmodel
            selft.isMyQuestion = self.question.twUseriD === Helper.getUserId()
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