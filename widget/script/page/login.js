function initPage() {
	var vm = new Vue({
		el: '#mainPage',
		data: function() {
			return {
				phone: '',
				pwd: '',
				appip: '192.168.0.102',
				submiting: false
			}
		},
		computed: {
			submitButtonText: function() {
				return this.submiting ? '正在登录...' : '登录'
			}
		},
		methods: {
			forgetPassword: function() {
				Helper.openWin('findPassword', {}, { allowEdit: true })
			},
			toRegist: function() {
				api.openWin({
				    name: 'regist',
				    url: 'widget://html/regist.html',
				    pageParam: {
				        name: 'value'
				    }
				});
			},
			loginByWx: function() {
				// todo: login by weixin
			},
			validate: function() {
				var dtd = $.Deferred()
				if (_.trim(this.phone).length === 0) {
					dtd.reject('用户名不能为空')
				} else if (_.trim(this.pwd).length === 0) {
					dtd.reject('密码不能为空')
				} else {
					dtd.resolve()
				}
				return dtd
			},
			onSubmit: function() {
				var self = this
				this.validate()
					.then(function() {
						this.submiting = true
						return $.ajax({
							url: BaseService.apiUrl + 'getloginrz',
							data: _.pick(self, ['phone', 'pwd', 'appip']),
						})
					})
					.then(function(res) {
						if (res.key === 'true') {
							self.setLocation(res.data)
							api.toast({
							    msg: '登录成功'
							});
							api.setPrefs({
								key: 'userid',
								value: res.data
							});
							$.ajax({
								url: BaseService.apiUrl + 'getuserinfo',
								data: { uid: getUserId() }
							}).then(function(res) {
								api.setPrefs({
									key: 'userInfo',
									value: ParseJson(res.data)[0]
								});
								api.sendEvent({
									name: 'initHomePage'
								});
								api.sendEvent({
									name: 'loginSuccess'
								});
								api.closeToWin({
									name: 'root'
								});
							}, function(err) {
								console.log(err)
							})
						} else {
							api.toast({
							    msg: res.mage
							})
						}
					})
					.fail(function(err) {
						Helper.alert('登陆失败');
					})
					.always(function() {
						this.submiting = false
					})
			},
			setLocation: function(userid) {
				var baiduLocation = api.require('baiduLocation');
				baiduLocation.getLocation(function(ret) {
					if (ret.status) {
						$.ajax({
							url: BaseService.apiUrl + 'updateGoldenlatitude',
							data: {
								userid: userid,
								jd: ret.longitude,
								wd: ret.latitude
							}
						}).then(function(res) {
						})
					}
				})
			}
		}
	})
}

apiready = function(){
  initPage()

	api.addEventListener({
    name: 'keyback'
	}, function(ret, err) {
		if (!ret.longPress) {
			api.confirm({
				title: '提示',
				msg: '确认要退出程序吗？',
				buttons: ['确定', '取消']
			}, function(ret) {
				if (ret.buttonIndex == 1) {
					api.closeWidget({id: 'A6937824183587', silent: true})
				}
			})
		}
	})
}
