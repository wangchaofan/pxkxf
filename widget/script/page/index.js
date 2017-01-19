apiready = function() {
	if (!Helper.getUserId()) {
		api.openWin({
	    name: 'login',
	    url: 'widget://html/login.html',
	    pageParam: {
        name: 'value'
	    }
		})
	} else {
		initPage()

		var rong = api.require('rongCloud2');
		// 初始化融云
		rong.init(function(ret, err) {
      if (ret.status == 'error') {
				rong.setOnReceiveMessageListener(function(ret, err) {
					api.sendEvent({
					    name: 'myEvent',
					    extra: {
					        valueName1: 'value1', 
					        valueName2: 'value2'
					    }
					});
					api.toast({msg: 'recevie 1111'})
					api.toast({ msg: JSON.stringify(ret.result.message) });
					api.toast({ msg: ret.result.message.left });
				})
      } else {
      }
    })
	}

	function initPage() {
		var nvTabBarCommonTitle = {
			text: '首页',
			size: 13.0,
			normal: '#333',
			selected: '#ec3c41',
			marginB: 6.0
		}
		var nvTabBarWidth = api.winWidth / 5.0
		var NVTabBar = api.require('NVTabBar')
		var currentIndex = 0
		NVTabBar.open({
			styles: {
				bg: '#fdfdfd',
				h: 56,
				dividingLine: {
					width: 0.5,
					color: '#ddd'
				},
				badge: {
					bgColor: '#ff0',
					numColor: '#fff',
					size: 6.0
				}
			},
			items: [{
				w: nvTabBarWidth,
				bg: {
					marginB: -2
				},
				iconRect: {
					w: 21.0,
					h: 18.0
				},
				icon: {
					normal: 'widget://image/nvtab/icon_home.png',
					highlight: 'widget://image/nvtab/icon_home_selected.png',
					selected: 'widget://image/nvtab/icon_home_selected.png'
				},
				title: _.assign({}, nvTabBarCommonTitle, { text: '首页'})
			}, {
				w: nvTabBarWidth,
				bg: {
					marginB: -2
				},
				iconRect: {
					w: 18,
					h: 18
				},
				icon: {
					normal: 'widget://image/nvtab/icon_order.png',
					highlight: 'widget://image/nvtab/icon_order_selected.png',
					selected: 'widget://image/nvtab/icon_order_selected.png'
				},
				title: _.assign({}, nvTabBarCommonTitle, { text: '订单'})
			}, {
				w: nvTabBarWidth,
				bg: {
					marginB: 12
				},
				iconRect: {
					w: 44,
					h: 44
				},
				icon: {
					normal: 'widget://image/nvtab/icon_add.png',
					highlight: 'widget://image/nvtab/icon_add.png',
					selected: 'widget://image/nvtab/icon_add.png'
				},
				title: _.assign({}, nvTabBarCommonTitle, { text: '发布', selected: '#333'})
			}, {
				w: api.winWidth / 5.0,
				bg: {
					marginB: -4
				},
				iconRect: {
					w: 24.0,
					h: 24.0
				},
				icon: {
					normal: 'widget://image/nvtab/icon_zixun.png',
					highlight: 'widget://image/nvtab/icon_zixun_selected.png',
					selected: 'widget://image/nvtab/icon_zixun_selected.png'
				},
				title: _.assign({}, nvTabBarCommonTitle, { text: '咨询' })
			}, {
				w: nvTabBarWidth,
				bg: {
					marginB: -2
				},
				iconRect: {
					w: 19.0,
					h: 19.0
				},
				icon: {
					normal: 'widget://image/nvtab/icon_user.png',
					highlight: 'widget://image/nvtab/icon_user_selected.png',
					selected: 'widget://image/nvtab/icon_user_selected.png'
				},
				title: _.assign({}, nvTabBarCommonTitle, { text: '我的' })
			}],
			selectedIndex: 0
		}, function(ret, err) {
			if (ret && ret.eventType === 'click') {
				if (ret.index < 2) {
					switchFrame(ret.index)
				} else if (ret.index === 2) {
					if (!api.getPrefs({key: 'userid', sync: true})) {
						api.openWin({
						    name: 'login',
						    url: 'widget://html/login.html'
						});
						return false
					}
					api.actionSheet({
				    cancelTitle: '取消',
				    buttons: ['发布供应', '发布需求', '发布动态'],
				    style: {
			    		itemNormalColor: '#fafafa',
			    		fontNormalColor: '#4abdff',
			    		fontPressColor: '#e4353a'
				    }
					}, function(ret, err) {
				    var index = ret.buttonIndex;
				    if (index === 1) {
				    	api.openWin({
			    	    name: 'add_edit_supply',
			    	    url: 'widget://html/add_edit_supply.html',
			    	    pageParam: {
			    	        type: 'add'
			    	    }
				    	})
				    } else if (index === 2) {
				    	api.openWin({
			    	    name: 'add_edit_supply',
			    	    url: 'widget://html/add_edit_demand.html',
			    	    pageParam: {
			    	      type: 'add'
			    	    }
				    	})
				    } else if (index === 3) {
				    	api.openWin({
			    	    name: 'page1',
			    	    url: 'widget://html/add_dynamic.html'
				    	})
				    }
				    NVTabBar.setSelect({
					    index: currentIndex
						})
					})
				} else {
					switchFrame(ret.index - 1)
				}
			}
		})

		api.openFrameGroup({
			name: 'group',
			background: '#fff',
			scrollEnabled: false,
			rect: {
				x: 0,
				y: 0,
				w: 'auto',
				h: 'auto'
			},
			index: 0,
			frames: [{
				name: 'home',
				url: 'html/home.html'
			}, {
				name: 'order',
				url: 'html/order.html'
			}, {
				name: 'consult',
				url: 'html/professor_question.html'
			}, {
				name: 'usercenter',
				url: 'html/usercenter.html'
			}]
		}, function(ret, err) {
			var index = ret.index;
		})

		function switchFrame(index) {
			currentIndex = index
			api.setFrameGroupIndex({ name: 'group', index: index })
		}
	}
	api.addEventListener({
	  name: 'initHomePage'
	}, function(ret, err) {
	  initPage()
	})
}