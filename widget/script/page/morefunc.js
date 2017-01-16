function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		data: function() {
			return {
			}
		},
		methods: {
			goPage: function(pageName) {
			  api.openWin({
		      name: pageName,
		      url: 'widget://html/' + pageName + '.html',
		      pageParam: {

		      }
			  });
			},
			checkUpdate: function() {
				var mam = api.require('mam');
    		mam.checkUpdate(function(ret, err) {
        	if (ret) {
            var result = ret.result;
            if (result.update == true && result.closed == false) {
              var str = '新版本型号:' + result.version + ';更新提示语:' + result.updateTip + ';下载地址:' + result.source + ';发布时间:' + result.time;
              api.confirm({
                title : '有新的版本,是否下载并安装 ',
                msg : str,
                buttons : ['确定', '取消']
              }, function(ret, err) {
                if (ret.buttonIndex == 1) {
                  if (api.systemType == "android") {
                    api.download({
                      url : result.source,
                      report : true
                    }, function(ret, err) {
                      if (ret && 0 == ret.state) {/* 下载进度 */
                        api.toast({
                          msg : "正在下载应用" + ret.percent + "%",
                          duration : 2000
                        });
                      }
                      if (ret && 1 == ret.state) {/* 下载完成 */
                        var savePath = ret.savePath;
                        api.installApp({
                          appUri : savePath
                        });
                    	}
                    });
                  }
                  if (api.systemType == "ios") {
                    api.installApp({
                        appUri : result.source
                    });
                  }
                }
              })
            } else {
              api.alert({
                  msg : "暂无更新"
              });
            }
	        } else {
	          api.alert({
	              msg : err.msg
	          });
	        }
    		});
			},
			logout: function() {
				$.ajax({
					url: BaseService.apiUrl + 'getlogtc',
          data: {userid: Helper.getUserId()}
				})
				.then(function(res) {
					if (res.key === 'true') {
            api.toast({
                msg: '退出登录成功'
            });
            api.removePrefs({
                key: 'userid'
            });
            api.sendEvent({
              name: 'logoutSuccess'
            })
            api.openWin({
              name: 'login',
              url: 'widget://html/login.html'
            })
					}
				}, function(err) {

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
