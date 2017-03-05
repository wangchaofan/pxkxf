function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		created: function() {
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
				return '请选择地区(默认为任何地区)'
			}
		},
		methods: {
			getSupply: function() {
				var self = this
				$.ajax({
					url: BaseService.apiUrl + 'getskillinfo',
					data: {
						skillid: api.pageParam.id,
						userid: Helper.getUserId()
						// skillid: 'a17db629-52b6-4b6a-a904-e6c1721e3a03'
					}
				}).then(function(res) {
					alert(res.data)
					var data = ParseJson(res.data)[0]
					var skill = self.skill
					skill.ddid = data.skillID
					skill.skillName = data.skillName
					skill.skilldetails = data.skilldetails
					skill.skilltype = data.skillType || ''
					skill.Province = data.addressprovince
					skill.City = data.addresscity
					skill.District = data.addDistrict
					skill.money = data.smoney
					skill.Remark = data.Remark
					skill.servertime = data.servertime
					_.forEach(data.Skillworksmodel, function(v) {
						convertImgToBase64(v.skillwoksurl, function(base64) {
							self.images.push(base64)
						})
					})
				}, function(err) {
					alert(JSON.stringify(err))
				})
			},
			onSelectDate: function() {
				var self = this
				api.openPicker({
			    type: 'date',
			    title: '选择时间'
				}, function(ret, err) {
			    self.skill.servertime = ret.year + '/' + ret.month + '/' + ret.day + ' 00:00:00'
				})
			},
			selectDistrict: function() {
				var self = this;
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
					self.skill.Province = ret.level1;
					self.skill.City = ret.level2;
					self.skill.District = ret.level3;
				});
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
				if (this.skill.money < 1) {
					api.toast({msg: '价格不能小于1元'});
					return;
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

apiready = function(){
    initPage()
}
