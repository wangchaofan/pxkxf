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
      	supplyInfo: null,
				booked: false,
        isMe: api.pageParam.user === 'self',
        buttonDisabled: true
      }
    },
    computed: {
    	userModel: function() {
    		if (this.supplyInfo) {
    			var userModel = this.supplyInfo.sUsermodel[0]
    			userModel.avatarStyle = 'background-image: url('+ userModel.pheadimgUrl +')'
  				return userModel
  			}
  			return null
    	}
    },
    methods: {
    	getData: function() {
    		var self = this
    		$.ajax({
    			url: BaseService.apiUrl + 'getskillinfo',
    			data: {
						skillid: api.pageParam.id,
            userid: Helper.getUserId()
						// skillid: 'a17db629-52b6-4b6a-a904-e6c1721e3a03'
    			}
    		}).done(function(res) {
    			self.supplyInfo = ParseJson(res.data)[0]
          if (self.supplyInfo.State == 2) {
            self.buttonDisabled = false
          }
    			console.log(ParseJson(res.data)[0])
    		})
    	},
      share: function() {
        var sharedModule = api.require('shareAction');
        sharedModule.share({
          type: 'url',
          text: '111',
          path: 'http://www.baidu.com'
        })
      },
			onClickBook: function() {
				if (this.booked) return
				var self = this
				$.ajax({
					url: BaseService.apiUrl + 'addCollection',
					data: {
						userid: Helper.getUserId(),
            skillid: api.pageParam.id
						// skillid: 'a17db629-52b6-4b6a-a904-e6c1721e3a03'
					}
				}).then(function(res) {
					if (res.key === 'true') {
						self.booked = true
					} else {
						api.toast({
							msg: res.mage
						})
					}
				})
			},
			onClickAdvise: function() {
        var self = this
        var dialogBox = api.require('dialogBox');
        dialogBox.input({
          keyboardType: 'default',
          texts: {
            placeholder: '请输入建议内容',
            leftBtnTitle: '取消',
            rightBtnTitle: '确定'
          },
          styles: {
            bg: '#fff',
            corner: 4,
            w: 300,
            h: 160,
            input: {
              h: 40,
              textSize: 14,
              textColor: '#000'
            },
            title: {
              h: 0
            },
            dividingLine: {
              width: 0.5,
              color: '#696969'
            },
            left: {
              bg: 'rgba(0,0,0,0)',
              color: '#007FFF',
              size: 14
            },
            right: {
              bg: 'rgba(0,0,0,0)',
              color: '#007FFF',
              size: 14
            }
          }
        }, function(ret) {
          if (ret.eventType === 'right') {
            if (ret.text === '') {
              api.toast({
                  msg: '请输入建议内容'
              })
              return
            } else {
              self.putAdvise(ret.text)
            }
          }
          dialogBox.close({
            dialogName: 'input'
          })
        })
			},
      putAdvise: function(content) {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'addskilljy',
          data: {
            userid: Helper.getUserId(),
            skillid: api.pageParam.id,
            // skillid: 'a17db629-52b6-4b6a-a904-e6c1721e3a03',
            content: content
          }
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
                msg: '建议已提交'
            })
          } else {
            api.toast({
              msg: res.mage
            })
          }
        })
      },
    	goChat: function() {
        Helper.openWin('chat_room', {targetId: this.supplyInfo.sUsermodel[0].lUserId})
    	},
      onSubmit: function() {
        if (this.buttonDisabled) return;
        Helper.openWin('add_order', {id: api.pageParam.id})
      }
    }
  })
}

apiready = function(){
  initPage()
}