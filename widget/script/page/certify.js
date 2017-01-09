/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        Idzm: '',
        Idbm: '',
        scId: ''
      }
    },
    methods: {
      onFileChange: function(e, key) {
        var self = this
        var file = e.target.files[0]
        if (file) {
          ImagePreview(file).then(function(res) {
            self[key] = res
          })
        }
      },
      onSubmit: function() {
        var self = this
        if (!this.Idzm) {
          alert('请上传身份证正面')
          return
        } else if (!this.Idbm) {
          alert('请上传身份证反面')
          return
        } else if (!this.scId) {
          alert('请上传手持身份证照片')
          return
        }
        var data = {
          userid: MockData.userid,
          Idzm: TransformImageData(self.Idzm),
          Idbm: TransformImageData(self.Idbm),
          scId: TransformImageData(self.scId)
        }
        $.ajax({
          url: BaseService.apiUrl + 'getID',
          data: data
        }).then(function(res) {
          if (res.key === 'true') {

          }
        }, function(err) {
          alert('上传失败')
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