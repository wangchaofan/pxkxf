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
      onSelectImage: function(e) {
        var file = e.target.files[0]
        var self = this
        if (file) {
          Helper.imagePreview(file).then(function(img) { self.images.push(img) })
        }
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
            setTimeout(function() {
              api.closeWin()
            }, 3000)
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
