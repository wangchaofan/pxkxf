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
			}
		}
	})
}

apiready = function(){
  initPage()
}
