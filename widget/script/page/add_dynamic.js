function initPage() {
	var vm = new Vue({
		el: '#mainPage',
		data: function() {
			return {
				dynamicContent: '',
				imgarr: []
			}
		},
		methods: {
			onSubmit: function() {
        var self = this
        if (_.trim(this.dynamicContent).length === 0) {
          alert('请输入动态详情')
          return
        }
        $.ajax({
          url: BaseService.apiUrl + 'addDynamics',
          data: {
            userid: MockData.userid,
            dynamicContent: self.dynamicContent,
            imgarr: _.map(self.imgarr, TransformImageData)
          }
        }).then(function(res) {
          console.log(res)
        }, function(err) {
          alert('添加失败')
        })
			},
			deleteImage: function(index) {
				this.imgarr.splice(index, 1)
			},
			onFileChange: function(event) {
				var self = this
				var file = event.target.files[0]
				if (file) {
					Helper.imagePreview(file).then(function(url) {
						self.imgarr.push(url)
					})
				}
			}
		}
	})
}

initPage()