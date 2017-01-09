function initPage() {
	var vm = new Vue({
		el: '#mainPage',
		created: function() {
			this.getUserInfo()
		},
		data: function() {
			return {
				userInfo: {
					userid: '123',
					nickname: '王小凡',
					sex: 'man',
					birthDate: '1991',
					age: 15,
					homeProvince: '重庆市',
					homeCity: '江北区',
					homeDistrict: '',
					nowProvince: '四川省',
					nowCity: '成都市',
					nowDistrict: '高新区',
					phoneNumber: '',
					email: '',
					graduateSchool: '',
					education: '',
					occupation: '',
					company: '',
					pQualifications: '',
					pHonor: '',
					Skill: '',
					freeTime: '',
					phomepage: '',
					pautograph: '',
				},
				submiting: false
			}
		},
		methods: {
			getUserInfo: function() {
				var self = this
				$.ajax({
					url: BaseService.apiUrl + 'getperuserinfo',
					data: { uid: MockData.userid }
				}).then(function(res) {
					res = ParseJson(res.data)[0]
					if (_.isArray(res.pQualifications)) {
						res.pQualifications = []
					}
					self.userInfo = res
					console.log(res)
				})
			},
			validate: function() {
				var dtd = $.Deferred()
				var userInfo = this.userInfo
				if (_.trim(userInfo.nickname).length === 0) {
					dtd.reject('昵称不能为空')
				} else if (_.trim(userInfo.birthDate).length === 0) {
					dtd.reject('出生日期不能为空')
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
							url: BaseService.apiUrl + 'updateuserinfo',
							data: self.userInfo,
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
