function initPage() {
	var vm = new Vue({
		el: '#mainPage',
		created: function() {
			this.getUserInfo()
		},
		data: function() {
			return {
				userInfo: {
					uid: Helper.getUserId(),
					pnckname: '',
					sex: 'man',
					birthDate: '',
					age: '',
					homeProvince: '',
					homeCity: '',
					homeDistrict: '',
					nowProvince: '',
					nowCity: '',
					nowDistrict: '',
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
		computed: {
			homeZone: function() {
				if (this.userInfo.homeProvince) {
					return this.userInfo.homeProvince + ' ' + this.userInfo.homeCity + ' ' + this.userInfo.homeDistrict
				}
				return '请选择地区'
			},
			nowZone: function() {
				if (this.userInfo.nowProvince) {
					return this.userInfo.nowProvince + ' ' + this.userInfo.nowCity + ' ' + this.userInfo.nowDistrict
				} 
				return '请选择地区'
			}
		},
		methods: {
			selectZone: function(t) {
				var self = this;
				var citySelector = api.require('citySelector');
				var userInfo = this.userInfo
					citySelector.open({
					y: api.frameHeight / 1.6
				}, function(ret, err) {
					if (t === 'home') {
						userInfo.homeProvince = ret.province
						userInfo.homeCity = ret.city
						userInfo.homeDistrict = ret.county
					} else {
						userInfo.nowProvince = ret.province
						userInfo.nowCity = ret.city
						userInfo.nowDistrict = ret.county
					}
        })
			},
			getUserInfo: function() {
				var self = this
				$.ajax({
					url: BaseService.apiUrl + 'getperuserinfo',
					data: { uid: Helper.getUserId() }
				}).then(function(res) {
					res = ParseJson(res.data)[0]
					var userInfo = self.userInfo
					console.log(res)
					_.forEach(res, function(v, k) {
						if (!_.isUndefined(userInfo[k])) {
							userInfo[k] = v
						}
					})
					if (userInfo.birthDate) {
						userInfo.birthDate = Helper.dateFormat(userInfo.birthDate, 'yyyy-MM-dd')
					}
					userInfo.pnckname = res.usermodel[0].pnickname
				})
			},
			selectQualifications: function() {
				var self = this
				var UIMultiSelector = api.require('UIMultiSelector');
				UIMultiSelector.open({
			    rect: {
		        h: 244
			    },
			    max: 4,
				    styles: {
			        mask: 'rgba(0,0,0,0.5)',
			        title: {
								bg: '#eee',
								size: 16,
								h: 44
		         	},
		         	leftButton: {
								w: 80,
								h: 35,
								marginT: 5,
								marginL: 8,
								color: 'rgb(0,0,0)',
								size: 14
		         	},
							rightButton: {
								w: 80,
								h: 35,
								marginT: 5,
								marginR: 8,
								color: 'rgb(0,0,0)',
								size: 14
							},
							item: {
								h: 44,
								bg: '#fff',
								bgActive: '#fff',
								bgHighlight: '#eee',
								color: '#333',
								active: '#333',
								highlight: '#333',
								size: 14,
								lineColor: '#ddd',
								textAlign: 'center'
							},
							icon: {
								w: 20,
								h: 20,
								marginT: 11,
								marginH: 8,
								bg: '#fff',                   
				        bgActive: 'widget://image/icon_ok.png',
				        bgHighlight: '#ddd',
								align: 'right'
							}
				     },
				     animation: true,
				     items: [{
				         text: 'Monday',
				         status: 'normal'
				     }, {
				         text: 'Tuesday',
				         status: 'normal'
				     }, {
				         text: 'Wednesday',
				         status: 'normal'
				     }, {
				         text: 'Thursday',
				         status: 'normal'
				     }, {
				         text: 'Friday',
				         status: 'normal'
				     }, {
				         text: 'Saturday',
				         status: 'normal'
				     }, {
				         text: 'Sunday',
				         status: 'normal'
				     }, {
				         text: 'from Monday to Sunday',
				         status: 'normal'
				     }]
				 }, function(ret, err) {
				    if (ret.eventType === 'clickLeft') {
				    	UIMultiSelector.hide()
				    } else if (ret.eventType === 'clickRight') {
				    	self.userInfo.pQualifications = _.map(ret.items, function(v) { return v.text }).join(',')
				    	UIMultiSelector.hide()
				    }
				 })
			},
			validate: function() {
				var dtd = $.Deferred()
				var userInfo = this.userInfo
				if (_.trim(userInfo.pnckname).length === 0) {
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
							url: BaseService.apiUrl + 'getuserjbx',
							data: self.userInfo,
						})
					})
					.then(function(res) {
						if (res.key === 'true') {
							api.toast({
							    msg: '修改成功'
							})
							api.sendEvent({
								name: 'loginSuccess'
							})
							api.sendEvent({
								name: 'refreshUserInfo'
							})
							setTimeout(function() {
								api.closeWin()
							}, 2000)
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
