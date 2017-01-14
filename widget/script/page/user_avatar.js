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
        userInfo: {}
      }
    },
    computed: {
      avatarStyle: function() {
        return {
          'background-image': 'url(' + this.userInfo.pheadimgUrl + ')'
        }
      }
    },
    methods: {
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserinfo',
          data: {uid: Helper.getUserId()}
        }).then(function(res) {
          self.userInfo = ParseJson(res.data)[0]
          console.log(ParseJson(res.data)[0])
        })
      },
      editAvatar: function() {
        var self = this
        api.actionSheet({
          buttons: ['拍照','从相册选择']
        }, function(ret, err) {
          if (ret.buttonIndex === 1) {
            self.selectImage('camera')
          } else if (ret.buttonIndex === 2) {
            self.selectImage('library')
          }
        });
      },
      selectImage: function(sourceType) {
        var self = this
        api.getPicture({
          sourceType: sourceType,
          encodingType: 'jpg',
          mediaValue: 'pic',
          destinationType: 'base64',
          allowEdit: true,
          quality: 50,
          targetWidth: 200,
          targetHeight: 200,
          saveToPhotoAlbum: true
        }, function(ret, err) { 
          self.uploadAvatar(ret.base64Data)
        })
      },
      uploadAvatar: function(image) {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'saveimg',
          data: {userid: Helper.getUserId(), fileNameurl: Helper.transformImageData(image)}
        }).done(function(res) {
          if (res.key === 'true') {
            api.toast({
              msg: '修改成功'
            })
            self.userInfo.pheadimgUrl = image
            api.sendEvent({
                name: 'editAvatarSuccess',
                extra: {
                  avatar: image, 
                }
            });
          } else {
            api.toast({
              msg: res.mage
            });
          }
        })
      },
      goPage: function(pageName) {
        api.openWin({
          name: pageName,
          url: 'widget://html/' + pageName + '.html',
          softInputMode: '',
          reload: true,
          pageParam: {
              name: 'value'
          }
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