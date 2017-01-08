function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		data: function() {
			return {
				avatarImg: '',
				submiting: false
			}
		},
		computed: {
			submitButtonText: function() {
				return this.submiting ? '正在登录...' : '登录'
			}
		},
		methods: {
			onUpload: function(e) {
				var self = this
				var file = e.target.files[0]
				var reader = new FileReader()
				reader.onload = function() {
					var url = reader.result
					self.avatarImg = url
					self.uploadImg(url)
				}
				reader.readAsDataURL(file)
			},
			uploadImg: function(data) {
				console.log(data)
				data = data.replace(/^.+\;/, '')
				$.ajax({
					url: BaseService.apiUrl + 'saveimg',
					data: {
						userid: MockData.userid,
						fileNameurl: data
					}
				})
				.done(function(res) {
					res = JSON.parse(res)
					if (res.key === 'false') {
						alert(res.mage)
					}
				})
				.fail(function(err) {
					console.log(err)
				})
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
