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
				api.openWin({
				    name: 'findPassword',
				    url: 'widget://html/findPassword.html',
				    pageParam: {
				    }
				})
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
							api.toast({
							    msg: '登录成功'
							});
							api.setPrefs({
							    key: 'userid',
							    value: res.data
							})
							api.sendEvent({
								name: 'initHomePage'
							})
							api.sendEvent({
								name: 'loginSuccess'
							})
							api.closeToWin({
							    name: 'root'
							});
						} else {
							api.toast({
							    msg: res.mage
							})
						}
					})
					.fail(function(err) {
						alert(err)
					})
					.always(function() {
						this.submiting = false
					})
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
  api.addEventListener({
    name: 'keyback'
	}, function(ret, err) {
		if (!ret.longPress) {
			api.closeWin({name: 'root'})
		}
	})
}
