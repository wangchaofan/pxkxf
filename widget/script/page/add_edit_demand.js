function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		created: function() {
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
				proviceList: [],
				upload_images: []
			}
		},
		computed: {
			zone: function() {
				if (this.demand.perid)
					return this.demand.perid + ' ' + this.demand.cid + ' ' + this.demand.diid;
				return '';
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
				if (data.timenum)
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
									mmoney: self.demand.money * self.demand.rnum,
									orderId: res.data,
									orderType: 'demand'
								}
							})
							setTimeout(function() {
								api.closeWin()
							}, 1000)
						}, 2000)
					} else {
						api.toast({
						    msg: res.mage
						});
					}
				}, function(err) {
					alert(JSON.stringify(err));
				})
			},
			onSelectZone: function() {
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
					self.demand.perid = ret.level1;
					self.demand.cid = ret.level2
					self.demand.diid = ret.level3;
				});
			}
		}
	})
}

apiready = function(){
    initPage()
}
    