function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		created: function() {
			this.getProvice()
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
					xqtype: '消费设计' // 分类
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
							api.closeWin()
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
				  y: api.frameHeight / 1.6
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

/* === 测试使用 === */
setTimeout(function() {
	if (!window.api) {
		initPage()
	}
}, 500)

apiready = function(){
    initPage()
}
    