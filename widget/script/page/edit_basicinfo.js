function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		data: function() {
			return {
				userInfo: {
					userid: Helper.getUserId(),
					imgarr: '',
					pnkname: '',
					age: '',
					sex: '女'
				},
				avatarImg: '',
				submiting: false
			}
	},
		methods: {
			selectSex: function(v) {
				this.userInfo.sex = v
			},
			onUpload: function(e) {
				var file = e.target.files[0]
				var self = this
				if (file) {
					Helper.imagePreview(file).then(function(url) {
						self.avatarImg = url
					})
				}
			},
			validate: function() {
				var dtd = $.Deferred()
				var userInfo = this.userInfo
				if (!this.avatarImg) {
					dtd.reject('请选择头像')
				} else if (_.trim(userInfo.pnkname).length === 0) {
					dtd.reject('请输入昵称')
				} else if (!_.isNumber(userInfo.age)) {
					dtd.reject('请输入正确的年龄')
				} else {
					dtd.resolve()
				}
				return dtd
			},
			onSubmit: function() {
				var self = this
				if (this.submiting) return
				this.validate()
					.then(function() {
						this.submiting = true
						self.userInfo.imgarr = Helper.transformImageData(self.avatarImg)
						return $.ajax({
							url: BaseService.apiUrl + 'userjc',
							data: self.userInfo
						})
					})
					.then(function(res) {
						if (res.key === 'true') {
							api.closeWin()
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
}
