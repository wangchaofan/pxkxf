/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        Idzm: '',
        Idbm: '',
        scId: '',
        holdCarId: '',
        inverseCarId: '',
        positiveCarId: ''
      }
    },
    methods: {
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getperuserinfo',
          data: { uid: Helper.getUserId() }
        }).then(function(res) {
          res = ParseJson(res.data)[0]
          console.log(res)
          if (!!res.holdCarId) {
            self.holdCarId = res.holdCarId
            self.inverseCarId = res.inverseCarId
            self.positiveCarId = res.positiveCarId
          }
        })
      },
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
          userid: Helper.getUserId(),
          Idzm: TransformImageData(self.Idzm),
          Idbm: TransformImageData(self.Idbm),
          scId: TransformImageData(self.scId)
        };
        $.ajax({
          url: BaseService.apiUrl + 'getID',
          data: data
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
                msg: '认证成功'
            })
            setTimeout(function() {
              api.closeWin();
            }, 2000);
          } else {
            api.toast({
                msg: res.mage
            });
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