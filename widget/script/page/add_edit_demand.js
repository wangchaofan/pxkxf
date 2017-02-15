function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		created: function() {
			this.getProvice()
			// this.getUserData()
		},
		data: function() {
			return {
				demand: {
					userid: Helper.getUserId(),
					xqname: '',
					rnum: '',
					timenum: '',
					xqdetails: '',
					money: '',
					perid: '', // 省
					cid: '', // 市
					diid: '', // 地区
					xqtype: '' // 分类
				},
				province: '',
				city: '',
				county: '',
				proviceList: [],
				upload_images: []
			}
		},
		computed: {
			zone: function() {
				if (this.province == this.city) {
					return this.province + ' ' + this.county
				}
				return this.province + ' ' + this.city + ' ' + this.county
			}
		},
		methods: {
			getUserData: function() {
				var self = this
				$.ajax({
					url: BaseService.apiUrl + 'getuserinfo',
					data: { uid: Helper.getUserId() }
				}).then(function(res) {
					var data = ParseJson(res.data)[0]
					if (data.levle === '普通用户') {
						api.confirm({
							title: '提示',
							msg: '发布需要需要实名认证，是否立即认证？',
						}, function (ret, err) {
							if (ret.buttonIndex === 2) {
								Helper.openWin('qualification')
								setTimeout(function() {
									api.closeWin()
								}, 2000)
							} else {
								api.closeWin()
							}
						});
					}
				})
			},
			onSubmit: function() {
				var self = this
				var data = _.clone(this.demand)
				data.timenum = new Date(data.timenum).getTime()
				$.ajax({
					url: BaseService.apiUrl + 'getaddDemandOrder',
					data: data
				}).then(function(res) {
					if (res.key === 'true') {
						api.toast({
						    msg: '发布成功'
						})
						api.sendEvent({
					    name: 'refreshMyDemand'
						})
						setTimeout(function() {
							api.openWin({
								name: 'pay',
								url: 'widget://html/pay.html',
								reload: true,
								progress: {
									type: 'page'
								},
								pageParam: {
									mmoney: self.demand.money,
									orderId: res.data,
									orderType: 'demand'
								}
							})
							setTimeout(function() {
								api.closeWin()
							}, 2000)
						}, 3000)
					} else {
						api.toast({
						    msg: res.mage
						});
					}
				})
			},
			onSelectZone: function() {
				var self = this;
				var citySelector = api.require('citySelector');
				citySelector.open({
				  y: api.frameHeight / 1.6,
					titleImg: 'widget://image/topbar_bg.jpg',
					bgImg: 'widget://image/cityselector_bg.jpg',
					cancelImg: 'widget://image/button_cancel.jpg',
					enterImg: 'widget://image/button_ok.jpg',
					fontColor: '#666'
				}, function(ret, err) {
					self.province = ret.province
					if (!ret.county) {
						self.city = ret.province
						self.county = ret.city
					} else {
						self.city = ret.city
				  	self.county = ret.county
					}
				  self.getProvinceId()
				});
			},
			getProvice: function() {
				var self = this;
				$.ajax({
					url: BaseService.apiUrl + 'getS_Province'
				}).then(function(res) {
					self.proviceList = ParseJson(res.data)
				})
			},
			getProvinceId: function() {
				var self = this
				this.demand.perid = _.filter(this.proviceList, function(v) {
					return v.ProvinceName.indexOf(self.province) >= 0
				})[0].ProvinceID
				this.getCityId(this.demand.perid)
			},
			getCityId: function(perid) {
				var self = this
				$.ajax({
					url: BaseService.apiUrl + 'getS_City',
					data: {perid: perid}
				}).then(function(res) {
					self.demand.cid = _.filter(ParseJson(res.data), function(v) {
						return v.CityName.indexOf(self.city) >= 0
					})[0].CityID
					console.log(self.demand.cid)
					self.getCountyId(self.demand.cid)
				})
			},
			getCountyId: function(citid) {
				var self = this
				$.ajax({
					url: BaseService.apiUrl + 'getS_District',
					data: {citid: citid}
				}).then(function(res) {
					self.demand.diid = _.filter(ParseJson(res.data), function(v) {
						return v.DistrictName.indexOf(self.county) >= 0
					})[0].DistrictID
					console.log(self.demand.diid)
				})
			}
		}
	})
}

apiready = function(){
    initPage()
}
    