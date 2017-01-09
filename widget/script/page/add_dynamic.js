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
        Promise.all(_.map(this.imgarr, function(img) {
            return Helper.uploadImg(MockData.userid, img)
          }))
          .then(function(images) {
            return _.map(images, function(v) {
              v = JSON.parse(v)
              if (v.key === 'true') {
                return v.data
              }
            })
          }, function(err) {
            alert('上传失败')
          })
          .then(function(imgarr) {
            $.ajax({
              url: BaseService.apiUrl + 'addDynamics',
              data: {
                userid: MockData.userid,
                dynamicContent: self.dynamicContent,
                imgarr: imgarr
              }
            }).then(function(res) {
              res = JSON.parse(res)
              console.log(res)
            }, function(err) {
              alert('添加失败')
            })
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