function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		data: function() {
			return {
				regphone: '',
				pwd: '',
				msm: '',
				repwd: '',
				appip: '121.22.11.22',
				submiting: false
			}
		},
		computed: {
			submitButtonText: function() {
				return this.submiting ? '正在登录...' : '登录'
			}
		},
		methods: {
			loginByWx: function() {

			},
			getSmsSuccess: function(data) {
				this.msm = data
			},
			validate: function() {
				var dtd = $.Deferred()
				if (_.trim(this.regphone).length === 0) {
					dtd.reject('用户名不能为空')
				} else if (_.trim(this.pwd).length === 0) {
					dtd.reject('密码不能为空')
				} else if (_.trim(this.msm).length === 0) {
					dtd.reject('验证码不能为空')
				} else if (this.pwd !== this.repwd) {
					dtd.reject('两次输入密码不相同')
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
							url: BaseService.apiUrl + 'getreguser',
							data: _.pick(self, ['regphone', 'pwd', 'msm', 'repwd', 'appip']),
						})
					})
					.then(function(res) {
						res = JSON.parse(res)
						console.log(res)
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
}
