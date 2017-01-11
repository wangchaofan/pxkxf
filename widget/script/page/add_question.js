/**
 * Created by chaofanw on 2017/1/9.
 */
function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    data: function() {
      return {
        question: {
          twuserid: Helper.getUserId,
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
        this.question.imgarr = _.map(this.images, Helper.transformImageData)
        $.ajax({
          url: BaseService.apiUrl + 'addtwinfo',
          data: this.question 
        }).then(function(res) {
          console.log(res)
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
