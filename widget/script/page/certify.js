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
        IdzmPath: '',
        IdbmPath: '',
        scIdPath: '',
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
          if (!!res.holdCarId) {
            self.holdCarId = res.holdCarId
            self.inverseCarId = res.inverseCarId
            self.positiveCarId = res.positiveCarId
          }
        })
      },
      selectPic: function(key) {
        var self = this
        api.getPicture({
          sourceType: 'library',
          encodingType: 'jpg',
          mediaValue: 'pic',
          destinationType: 'base64',
          allowEdit: true,
          quality: 80,
          saveToPhotoAlbum: false
        }, function(ret, err) {
          if (ret && ret.base64Data)
            self[key + 'Path'] = ret.data
            self[key] = ret.base64Data
        });
      },
      onSubmit: function() {
        var self = this
        if (!this.Idzm) {
          api.toast({msg: '请上传身份证正面'});
          return
        } else if (!this.Idbm) {
          api.toast({msg: '请上传身份证反面'});
          return
        } else if (!this.scId) {
          api.toast({msg: '请上传手持身份证照片'});
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
                msg: '提交认证成功'
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
          api.toast({msg: '上传失败'});
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}