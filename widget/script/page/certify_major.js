/**
 * Created by chaofanw on 2017/1/19.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getData();
    },
    data: function() {
      return {
        images: [],
        zsData: null,
        posting: true
      }
    },
    methods: {
      getData: function() {
        var self = this;
        $.ajax({
          url: BaseService.apiUrl + 'gethuUserZs',
          data: { userid: Helper.getUserId() }
        }).then(function(res) {
          var data = JSON.parse(res.data);
          if (data && data.url) {
            self.images = data.url.split(',');
            self.zsData = data;
          }
        })
      },
      handlerClickUpload: function() {
        if (this.images.lenth >= 10) {
          api.toast({
            msg: '最多只能上传10张照片',
          });
        }
        var self = this;
        api.getPicture({
          sourceType: 'library',
          encodingType: 'jpg',
          mediaValue: 'pic',
          destinationType: 'base64',
          allowEdit: false,
          saveToPhotoAlbum: false
        }, function (ret, err) {
          if (ret && ret.base64Data) {
            self.images.push(ret.base64Data)
          }
        });
      },
      onSubmit: function () {
        if (this.images.length === 0) {
          api.toast({
            msg: '请至少上传一张证书图片',
            duration: 2000,
            location: 'middle'
          });
          return;
        }
        $.ajax({
          url: BaseService.apiUrl + 'addUserZs',
          data: {
            userid: Helper.getUserId(),
            imgarr: _.map(this.images, Helper.transformImageData).join(',')
          }
        }).then(function(ret) {
          if (ret.key == 'true') {
            api.toast({msg: '提交成功!'});
            setTimeout(function() {
              api.closeWin()
            }, 2000);
          } else {
            api.tosat({msg: ret.mage})
          }
        });
      }
    }
  })
}

apiready = function(){
  initPage()
}
