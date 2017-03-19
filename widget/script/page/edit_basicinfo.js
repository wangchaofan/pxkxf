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
			handleSelectDay: function() {
				var self = this;
				api.openPicker({
					type: 'date',
					title: '选择时间'
				}, function(ret, err){
					var date = ret.year + '-' + ret.month + '-' + ret.day;
					if ((new Date(date)).getTime() > Date.now()) {
						api.toast({msg: '不能大于当前时间'})
					} else {
						self.userInfo.age = date;
					}
				});
			},
			onUpload: function(e) {
				var self = this
				api.getPicture({
					sourceType: 'library',
					encodingType: 'png',
					mediaValue: 'pic',
					destinationType: 'base64',
					allowEdit: true,
					quality: 50,
					targetWidth: 200,
					targetHeight: 200,
					saveToPhotoAlbum: true
				}, function(ret, err) {
					self.avatarImg = ret.base64Data
				})
			},
			validate: function() {
				var dtd = $.Deferred()
				var userInfo = this.userInfo
				if (!this.avatarImg) {
					dtd.reject('请选择头像')
				} else if (_.trim(userInfo.pnkname).length === 0) {
					dtd.reject('请输入昵称')
				} else if (!userInfo.age) {
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
						$.ajax({
							url: BaseService.apiUrl + 'getloginrz',
							data: {
								phone: api.pageParam.phone,
								pwd: api.pageParam.pwd,
								appip: '192.168.22.11'
							}
						}).then(function() {
							if (res.key === 'true') {
								api.toast({msg: '设置成功'});
								setTimeout(function() {
									api.sendEvent({
										name: 'initHomePage'
									});
									api.sendEvent({
										name: 'loginSuccess'
									});
									api.closeToWin({
										name: 'root'
									});
								}, 1500);
							} else {
								api.toast({
									msg: res.mage
								})
							}
						})
					})
					.fail(function(err) {
						api.toast({msg: JSON.stringify(err)});
					})
					.always(function() {
						this.submiting = false
					})
			}
		}
	})
}


apiready = function(){
  initPage()
}
