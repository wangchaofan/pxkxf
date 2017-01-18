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
      	demandInfo: null,
				showDialog: false,
				describe: ''
      }
    },
    computed: {
    	userModel: function() {
    		if (this.demandInfo) {
    			var userModel = this.demandInfo.Usermodel[0]
    			userModel.avatarStyle = 'background-image: url('+ userModel.pheadimgUrl +')'
  				return userModel
  			}
  			return null
    	}
    },
    methods: {
    	share: function() {
    		var sharedModule = api.require('shareAction');
    		sharedModule.share({
  		    type: 'url',
  		    text: '111',
  		    path: 'http://www.baidu.com'
    		})
    	},
    	getData: function() {
				var self = this
					$.ajax({
					url: BaseService.apiUrl + 'getxqinfo',
					data: { xqid: api.pageParam.id } // 'a17db629-52b6-4b6a-a904-e6c1721e3a00'
					// data: { xqid: 'a17db629-52b6-4b6a-a904-e6c1721e3a00'}
					}).done(function(res) {
					self.demandInfo = ParseJson(res.data)[0]
					console.log(ParseJson(res.data)[0])
				})
    	},
			onClickCancel: function() {
				this.showDialog = false
			},
			onClickSubmit: function() {
				if (!this.describe) {
					alert('请填写你的技能优势')
					return
				}
				var self = this
				var data = {
						// ddid: 'a17db629-52b6-4b6a-a904-e6c1721e3a00',
						ddid: api.pageParam.id,
						userid: Helper.getUserId(),
						describe: self.describe
					}
				$.ajax({
					url: BaseService.apiUrl + 'addXQInvited',
					data: {
						// ddid: 'a17db629-52b6-4b6a-a904-e6c1721e3a00',
						ddid: api.pageParam.id,
						userid: Helper.getUserId(),
						describe: self.describe
					}
				}).done(function(res) {
					if (res.key === 'true') {
						alert('应邀成功')
						self.showDialog = false
					} else {
						api.toast({
							msg: res.mage
						})
					}
				})
			},
    	goChat: function() {
    		api.openWin({
  		    name: 'chat_room',
  		    url: 'widget://html/chat_room.html',
  		    pageParam: {
		        name: 'value'
  		    }
    		})
    	},
    	goInvite: function() {
				this.showDialog = true
    	},
    	goInviteNoname: function() {

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