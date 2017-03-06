function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		data: function() {
			return {
				regphone: '',
				pwd: '',
				msm: '',
				qrpwd: '',
				appip: '192.168.0.104',
				submiting: false
			}
		},
		computed: {
			submitButtonText: function() {
				return this.submiting ? '正在注册...' : '下一步'
			}
		},
		methods: {
			getSmsSuccess: function(data) {
				api.toast({
			    msg: '验证码已经发送到' + this.regphone + '，请注意查收'
				})
			},
			validate: function() {
				var dtd = $.Deferred()
				if (_.trim(this.regphone).length === 0) {
					dtd.reject('手机号不能为空')
				} else if (_.trim(this.pwd).length === 0) {
					dtd.reject('密码不能为空')
				} else if (_.trim(this.msm).length === 0) {
					dtd.reject('验证码不能为空')
				} else if (this.pwd !== this.qrpwd) {
					dtd.reject('两次输入密码不相同')
				} else {
					dtd.resolve()
				}
				return dtd
			},
			onSubmit: function() {
				// return
				var self = this
				if (this.submiting) return
				this.validate()
					.then(function() {
						self.submiting = true
						return $.ajax({
							url: BaseService.apiUrl + 'getreguser',
							data: _.pick(self, ['regphone', 'pwd', 'msm', 'qrpwd', 'appip']),
						})
					})
					.then(function(res) {
						if (res.key === 'true') {
							api.toast({
								msg: '注册成功'
							});
							api.setPrefs({
								key: 'userid',
								value: res.data
							});
							Helper.openWin('edit_basicinfo', {phone: self.regphone, pwd: self.pwd});
							setTimeout(function() {
								api.closeWin()
							}, 1000)
						} else {
							api.toast({msg: res.mage})
						}
					})
					.fail(function(err) {
						api.toast({msg: err.message});
					})
					.always(function() {
						self.submiting = false
					})
			}
		}
	})
}

apiready = function(){
  initPage()
}
