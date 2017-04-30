/**
 * Created by chaofanw on 2017/1/9.
 */
var supply = {
  template: '<li class="supply-list-item">' +
  '  <div class="supply-list-item__left">' +
  '    <img :src="avatar" alt="">' +
  '  </div>' +
  '  <div class="supply-list-item__right">' +
  '    <div class="supply-list-item__param">' +
  '      供应名称：<span class="text-black">{{myData.skillName}}</span>' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      供应价格：<strong class="text-warning">{{myData.smoney}}</strong>元' +
  '    </div>' +
  '    <div class="supply-list-item__param">' +
  '      供应状态：<span class="supply-status">{{getStateText(myData.sfState)}}</span>' +
  '    </div>' +
  '    <div class="supply-item-desc">描述：{{myData.skilldetails}}</div>' +
  '  </div>' +
  '</li>',
  props: ['myData'],
  data: function() {
    return {}
  },
  computed: {
    avatar: function() {
      return this.myData ? this.myData.pheadimgUrl : ''
    }
  },
  methods: {
    getStateText: function(state) {
      switch(state) {
        case 1:
          return '审核中'
        case 2:
          return '通过'
        case 3:
          return '不通过'
        default:
          return '已关闭'
      }
    }
  }
}
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    components: {
      'supply-box': supply
    },
    created: function() {
      this.getData()
    },
    data: function() {
      return {
        userInfo: {},
        dynamic: null,
        skill: null,
        title: '个人资料'
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
      onClickReturnBack: function() {
        if (this.title === '选择头像') {
          this.FNImageClip.close()
          this.title = "个人资料"
        } else {
          api.closeWin()
        }
      },
      viewDynamic: function() {
        Helper.openWin('mydynamics');
      },
      getData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserinfo',
          data: {uid: Helper.getUserId()}
        }).then(function(res) {
          var data =  ParseJson(res.data)[0]
          self.userInfo = data
          console.log(ParseJson(res.data)[0])
          if (data.Dynamicsmodel) {
            self.dynamic = data.Dynamicsmodel[0]
          }
          if (data.skillmodel) {
            self.skill = data.skillmodel[0]
            self.skill.pheadimgUrl = data.pheadimgUrl
          }
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
        var self = this;
        var isIos = api.systemType === 'ios';
        api.getPicture({
          sourceType: sourceType,
          encodingType: 'png',
          mediaValue: 'pic',
          destinationType: isIos ? 'base64' : 'url',
          allowEdit: true,
          quality: 50,
          targetWidth: 200,
          targetHeight: 200,
          saveToPhotoAlbum: true
        }, function(ret, err) {
          if (isIos) {
            if (!ret.base64Data) return;
            self.userInfo.pheadimgUrl = ret.base64Data
            if (self.skill) {
              var skill = _.clone(self.skill)
              skill.pheadimgUrl = ret.base64Data
              self.skill = skill
            }
            self.uploadAvatar(ret.base64Data);
          } else {
            if (!ret.data) return;
            self.clipImage(ret.data)
          }
        })
      },
      clipImage: function(src) {
        this.title = '选择头像'
        var FNImageClip = api.require('FNImageClip');
        this.FNImageClip = FNImageClip
        FNImageClip.open({
          rect: {
            x: 0,
            y: 44,
            w: api.winWidth,
            h: api.winHeight - 44
          },
          srcPath: src,
          style: {
            mask: 'rgba(0,0,0,0.5)',
            clip: {
              w: 240,
              h: 240,
              x: (api.winWidth - 240) / 2,
              y: (api.winHeight - 240 - 48) / 2,
              borderColor: '#666',
              borderWidth: 1,
              appearance: 'rectangle'
            }
          },
          mode: 'image'
        }, function(ret, err) {

        })
      },
      clipImageComplete: function() {
        var self = this
        this.FNImageClip.save({
          destPath: 'fs://imageClip/result.png',
          copyToAlbum: false,
          quality: 0.8
        }, function(ret, err) {
          if (ret) {
            self.userInfo.pheadimgUrl = ret.destPath
            if (self.skill) {
              var skill = _.clone(self.skill)
              skill.pheadimgUrl = ret.destPath
              self.skill = skill
            }
            self.FNImageClip.close()
            convertImgToBase64(ret.destPath, function(base64) {
              self.uploadAvatar(base64)
            })
          } else {
            api.toast({msg: err.message});
          }
        })
      },
      uploadAvatar: function(image) {
        var self = this
        this.title = '个人资料'
        api.showProgress({
            style: 'default',
            animationType: 'fade',
            title: '',
            text: '正在上传头像...',
            modal: false
        })
        $.ajax({
          url: BaseService.apiUrl + 'saveimg',
          data: {userid: Helper.getUserId(), fileNameurl: Helper.transformImageData(image)}
        }).done(function(res) {
          api.hideProgress()
          if (res.key === 'true') {
            api.toast({
              msg: '修改成功'
            })
            api.sendEvent({
              name: 'editAvatarSuccess',
              extra: {
                avatar: image
              }
            });
          } else {
            api.toast({
              msg: res.mage
            })
          }
        })
      },
      handlerClickUserLevel: function() {
        Helper.openWin('qualification');
      },
      goPage: function(pageName) {
        var pageParam = {}
        if (pageName === 'phone_setting') {
          pageParam.phonestate = this.userInfo.phonestate
        }
        api.openWin({
          name: pageName,
          url: 'widget://html/' + pageName + '.html',
          reload: true,
          pageParam: pageParam
        })
      }
    }
  });

  api.addEventListener({
    name: 'refreshUserInfo'
  }, function (ret, err) {
    vm.getData()
  })
};

apiready = function(){
  initPage()
}
