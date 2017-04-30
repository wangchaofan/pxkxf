/**
 * Created by chaofanw on 2017/1/9.
 */
  function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        question: {
          twuserid: Helper.getUserId(),
          title: '',
          content: '',
          imgarr: []
        },
        images: []
      }
    },
    methods: {
      onSelectImage: function() {
        var self = this;
        api.getPicture({
          sourceType: 'library',
          encodingType: 'jpg',
          mediaValue: 'pic',
          destinationType: 'base64',
          allowEdit: true,
          quality: 50,
          targetWidth: 200,
          targetHeight: 200,
          saveToPhotoAlbum: false
        }, function(ret, err){ 
          if (ret && ret.base64Data)
            self.images.push(ret.base64Data)
        });
      },
      deleteImage: function(index) {
        this.images.splice(index, 1)
      },
      onSubmit: function() {
        var self = this
        this.question.imgarr = _.map(this.images, Helper.transformImageData).join(',')
        $.ajax({
          url: BaseService.apiUrl + 'addtwinfo',
          data: this.question 
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
              msg: '添加成功'
            })
            api.sendEvent({
              name: 'refreshQuestion',
            });
            setTimeout(function() {
              api.closeWin()
            }, 1000)
          } else {
            api.toast({
              msg: res.mage
            })
          }
        })
      }
    }
  })
}

apiready = function(){
  initPage()
}
