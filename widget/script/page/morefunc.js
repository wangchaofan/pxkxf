function initPage() {
	var vm = new Vue({
		el: '.wrapper',
		data: function() {
			return {
			}
		},
		methods: {
			goPage: function(pageName) {

			},
			checkUpdate: function() {

			},
			logout: function() {
				$.ajax({
					url: BaseService.apiUrl + '',
				})
				.then(function(res) {
					res = JSON.parse(res)
					if (res.key === 'true') {
						// todo: 清除uid
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
