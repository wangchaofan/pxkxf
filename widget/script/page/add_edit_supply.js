function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		created: function() {
			// this.skill = {
			// 	userid: Helper.getUserId(),
			// 	skillname: '测试',
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
		},
		data: function() {
			return {
				skill: {
					userid: Helper.getUserId(),
					skillname: '',
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
			onSubmit: function() {
				if (this.submiting) return 
				var self = this
				this.skill.imgarr = _.map(this.images, Helper.transformImageData).join(',')
				var data = _.clone(this.skill)
				data.servertime = data.servertime ? new Date(data.servertime).getTime() : ''
				if (!data.District) {
					data.District = data.City
					data.City = data.Province
				}
				this.submiting = true
				$.ajax({
					url: BaseService.apiUrl + 'addSkill',
					data: data
				}).then(function(res) {
					if (res.key === 'true') {
						api.toast({
						    msg: '发布成功'
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
					        mmoney: self.skill.money,
					        orderId: res.data
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
    