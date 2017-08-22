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
        EnterpriseAuthentication: '',
        EnterpriseAuthenticationPath: '',
        state: 0
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
          self.state = res.usermodel[0].eaState
          if (!!res.EnterpriseAuthentication) {
            self.EnterpriseAuthentication = res.EnterpriseAuthentication
            self.EnterpriseAuthenticationPath = res.EnterpriseAuthentication
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
        if (!this.EnterpriseAuthentication) {
          api.toast({msg: '请上传营业执照照片'});
          return
        }
        var data = {
          userid: Helper.getUserId(),
          EaImg: TransformImageData(self.EnterpriseAuthentication)
        }
        $.ajax({
          url: BaseService.apiUrl + 'getEnterpriseAuthentication',
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
          alert(JSON.stringify(err))
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}