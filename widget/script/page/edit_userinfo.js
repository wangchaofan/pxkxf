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
			},
			educationStyle: function() {
				return this.userInfo.education ? {} : { color: '#999' };
			}
		},
		methods: {
			selectZone: function(t) {
				var self = this
				var userInfo = this.userInfo
				var UIActionSelector = api.require('UIActionSelector');
				UIActionSelector.open({
					datas: 'widget://res/city.json',
					layout: {
						row: 5,
						col: 3,
						height: 40,
						size: 14,
						sizeActive: 14,
						rowSpacing: 5,
						colSpacing: 10,
						maskBg: 'rgba(0,0,0,0.2)',
						bg: '#fff',
						color: '#888',
						colorActive: '#e4353a',
						colorSelected: '#e4353a'
					},
					animation: true,
					cancel: {
						text: '取消',
						size: 14,
						w: 90,
						h: 35,
						bg: '#ddd',
						bgActive: '#ddd',
						color: '#fff',
						colorActive: '#fff'
					},
					ok: {
						text: '确定',
						size: 14,
						w: 90,
						h: 35,
						bg: '#e4353a',
						bgActive: '#e4353a',
						color: '#fff ',
						colorActive: '#fff'
					},
					title: {
						text: '请选择',
						size: 14,
						h: 44,
						bg: '#eee',
						color: '#333'
					}
				}, function(ret, err) {
					if (ret.eventType === 'cancel') return;
					if (t === 'home') {
						userInfo.homeProvince = ret.level1;
						userInfo.homeCity = ret.level2;
						userInfo.homeDistrict = ret.level3;
					} else {
						userInfo.nowProvince = ret.level1
						userInfo.nowCity = ret.level2
						userInfo.nowDistrict = ret.level3
					}
				});
			},
			handleSelectDay: function() {
				var self = this;
				api.openPicker({
					type: 'date',
					title: '选择时间'
				}, function(ret, err) {
					var date = ret.year + '-' + ret.month + '-' + ret.day;
					var date2 = ret.year + '/' + ret.month + '/' + ret.day;
					if ((new Date(date2)).getTime() > Date.now()) {
						api.toast({
							msg: '不能大于当前时间'
						})
					} else {
						self.userInfo.birthDate = date;
					}
				});
			},
			getUserInfo: function() {
				var self = this
				$.ajax({
					url: BaseService.apiUrl + 'getperuserinfo',
					data: {
						uid: Helper.getUserId()
					}
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
						self.userInfo.pQualifications = _.map(ret.items, function(v) {
							return v.text
						}).join(',')
						UIMultiSelector.hide()
					}
				})
			},
			validate: function() {
				var dtd = $.Deferred()
				var userInfo = this.userInfo
				if (_.trim(userInfo.pnckname).length === 0) {
					dtd.reject('昵称不能为空');
				} else if (_.trim(userInfo.birthDate).length === 0) {
					dtd.reject('出生日期不能为空');
				} else if (!!userInfo.phoneNumber && !/^1\d{10}$/.test(userInfo.phoneNumber)) {
					dtd.reject('请输入正确的手机号码');
				} else if (!!userInfo.email && !/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(userInfo.email)) {
					dtd.reject('请输入正确的邮箱地址');
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
						api.toast({
							msg: err
						});
					})
					.always(function() {
						this.submiting = false
					})
			}
		}
	})
}


apiready = function() {
	initPage()
}