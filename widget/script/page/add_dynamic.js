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
            userid: Helper.getUserId(),
            dynamicContent: self.dynamicContent,
            imgarr: _.map(self.imgarr, TransformImageData).join(',')
          }
        }).then(function(res) {
        	if (res.key === 'true') {
        		api.toast({
        		    msg: '添加成功'
        		});
        		api.closeWin()
        	} else {
        		api.toast({
        		    msg: res.mage
        		});
        	}
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