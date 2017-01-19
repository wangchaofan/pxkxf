function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		created: function() {
			// this.skill = {
			// 	userid: Helper.getUserId(),
			// 	skillName: '测试',
			// 	skilldetails: '测试详情',
			// 	skilltype: '',
			// 	servertime: '',
			// 	Province: '',
			// 	City: '',
			// 	District: '',
			// 	money: '200',
			// 	imgarr: '',
			// 	Remark: '嘿嘿'
			// }
			if (api.pageParam.id) {
				this.getSupply()
			}
		},
		data: function() {
			return {
				skill: {
					userid: Helper.getUserId(),
					skillName: '',
					skilldetails: '',
					skilltype: '',
					servertime: '',
					Province: '',
					City: '',
					District: '',
					money: '',
					imgarr: '',
					Remark: ''
				},
				title: api.pageParam.id ? '修改供应' : '发布供应',
				// title: '修改供应',
				submiting: false,
				images: []
			}
		},
		computed: {
			zoneText: function() {
				var skill = this.skill
				if (skill.Province) {
					return skill.Province + ' ' + skill.City + ' ' + skill.District
				}
				return '请选择地区'
			}
		},
		methods: {
			getSupply: function() {
				var self = this
				$.ajax({
					url: BaseService.apiUrl + 'getskillinfo',
					data: {
						skillid: api.pageParam.id
						// skillid: 'a17db629-52b6-4b6a-a904-e6c1721e3a03'
					}
				}).done(function(res) {
					var data = ParseJson(res.data)[0]
					console.log(ParseJson(res.data)[0])
					var skill = self.skill
					skill.ddid = data.skillID
					skill.skillName = data.skillName
					skill.skilldetails = data.skilldetails
					skill.skilltype = data.skillType || ''
					skill.Province = data.addressprovincese
					skill.City = data.addressCityse
					skill.District = data.addressdistrctse
					skill.money = data.smoney
					skill.Remark = data.Remark
					skill.servertime = Helper.dateFormat(data.servertime, 'yyyy-MM-dd')
					_.forEach(data.Skillworksmodel, function(v) {
						convertImgToBase64(v.skillwoksurl, function(base64) {
							self.images.push(base64)
						})
					})
				})
			},
			selectDistrict: function() {
				var self = this;
        		var citySelector = api.require('citySelector');
				citySelector.open({
				 	y: api.frameHeight / 1.6
			  	}, function(ret, err) {
					self.skill.Province = ret.province
				 	self.skill.City = ret.city
				 	self.skill.District = ret.county
			  	})
			},
			onFileChange: function(e) {
				var self = this
				var file = e.target.files[0]
				if (file) {
					Helper.imagePreview(file).then(function(url) {
						self.images.push(url)
					})
				}
			},
			deleteImage: function(index) {
				this.images.splice(index, 1)
			},
			onSubmit: function() {
				if (this.submiting) return 
				if (this.skill.servertime && new Date(this.skill.servertime).getTime() < Date.now()) {
					api.toast({
						msg: '有效时间不能小于当前时间'
					})
					return
				}
				this.skill.imgarr = _.map(this.images, Helper.transformImageData).join(',')
				var data = _.clone(this.skill)
				data.servertime = data.servertime ? new Date(data.servertime).getTime() : ''
				if (!data.District) {
					data.District = data.City
					data.City = data.Province
				}
				this.submiting = true
				if (api.pageParam.id) {
					data.ddid = api.pageParam.id
					this.edit(data)
				} else {
					this.add(data)
				}
			},
			edit: function(data) {
				$.ajax({
					url: BaseService.apiUrl + 'updateSkill',
					data: data
				}).then(function(res) {
					if (res.key === 'true') {
						console.log(res)
						api.toast({
					    msg: '修改成功'
						})
						api.closeToWin({name: 'mysupply'})
					} else {
						api.toast({
					    msg: res.mage
						})
					}
				})
			},
			add: function(data) {
				var self = this
				$.ajax({
					url: BaseService.apiUrl + 'addSkill',
					data: data
				}).then(function(res) {
					if (res.key === 'true') {
						api.toast({
							msg: '发布成功'
						})
						setTimeout(function() {
							api.closeWin()
						}, 2000)
					} else {
						api.toast({
							msg: res.mage
						});
					}
				}, function(err) {
					api.toast({
						msg: '添加失败'
					})
				}).always(function() {
					self.submiting = false
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
    