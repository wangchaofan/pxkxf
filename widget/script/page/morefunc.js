function initPage() {
	var vm = new Vue({
		el: '#mainPage',
		data: function() {
			return {
				phone: '',
				pwd: '',
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
			forgetPassword: function() {

			},
			toRegist: function() {

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
