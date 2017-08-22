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
						allowEdit: true
		      }
			  });
			}
		}
	})
}

apiready = function(){
  initPage()
}
