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
      	dyInfo: {},
        user: {},
        comments: [],
        images: [],
        currentSee: 'all',
        hasZan: false,
        commentContent: ''
      }
    },
    computed: {
      myComments: function() {
        return _.filter(this.comments, function (v) {
          return v.usermodel[0].lUserId === Helper.getUserId()
        })
      }
    },
    methods: {
      changeSee: function(t) {
        this.currentSee = t
      },
      onClickZan: function() {
        var self = this
        if (this.hasZan) {
          alert('你已经点过赞了')
          return
        }
        $.ajax({
          url: BaseService.apiUrl + 'adddtdz',
          data: { userid: Helper.getUserId(), dtid: self.dyInfo.dynamicsId, commentContent: '' } // '0ee0624d-dbd4-4731-afbb-be306dd872be'
        }).done(function(res) {
          if (res.key === 'true') {
            self.dyInfo.dznum = parseInt(self.dyInfo.dznum) + 1
            self.hasZan = true
          } else {
            api.toast({
              msg: res.mage
            })
          }
        })
      },
      sendComment: function() {
        var self = this
        if (_.trim(this.commentContent) === '') {
          return
        }
        $.ajax({
          url: BaseService.apiUrl + 'adddtpl',
          data: { userid: Helper.getUserId(), dtid: self.dyInfo.dynamicsId, commentContent: self.commentContent } // '0ee0624d-dbd4-4731-afbb-be306dd872be'
        }).done(function(res) {
          if (res.key === 'true') {
            self.commentContent = ''
            self.getData()
            api.toast({
              msg: '评论成功'
            })
          } else {
            api.toast({
              msg: res.mage
            })
          }
        })
      },
    	getData: function() {
    		var self = this
        console.log(11)
    		$.ajax({
    			url: BaseService.apiUrl + 'dtinfo',
    			data: { dtinfos: api.pageParam.id } // '0ee0624d-dbd4-4731-afbb-be306dd872be'
    		}).done(function(res) {
    			var data = ParseJson(res.data)[0]
    			console.log(ParseJson(res.data)[0])
          self.dyInfo = data
          self.comments = data.DynamicPLmodel
          self.images = data.DynamicImgmodel
          self.user = data.Usermodel[0]
    		})
    	}
    }
  })
}


apiready = function(){
  initPage()
}