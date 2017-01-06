function initPage() {
	var vm = new Vue({
		el: '#mainPage',
		data: function() {
			return {
				dynamic_detail: '1111',
				upload_images: []
			}
		},
		methods: {
			onSubmit: function() {

			},
			onFileChange: function(event) {
				var file = event.target.files[0]
				console.log(file)
			}
		}
	})
}

initPage()