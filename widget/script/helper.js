/**
 * Created by chaofanw on 2017/1/3.
 */

var ParseJson = JSON.parse

var BaseService = {
  apiUrl: 'http://120.26.116.143:809/WebServer/userServer.asmx/'
}

var Helper = {
  xmlToJson: XmlToJson,
  imagePreview: ImagePreview,
  uploadImg: UploadImg,
  transformImageData: TransformImageData
}

var MockData = {
	userid: 'A17DB629-52B6-4B6A-A904-E6C1721E3A05'
}

Vue.component('my-header', {
  template: '<header class="header">' +
            ' <div class="header-left">' +
            '   <span class="return-back" @click="returnBack"></span>' +
            ' </div>' +
            ' <div class="header-center">' +
            '   <span class="header-center-text">{{title}}</span>' +
            ' </div>' +
            ' <div class="header-right">' +
            '   <slot name="headerRight"></slot>' +
            ' </div>' +
            '</header>',
  props: ['title'],
  data: function() {
    return {}
  },
  methods: {
    returnBack: function() {
      api.closeWin()
    }
  }
})

$.ajaxSetup({
  type: 'post',
  dataType: 'text',
  dataFilter: function(res) {
    console.log(res)
    console.log(XmlToJson(res))
    return JSON.parse(XmlToJson(res))
  }
})

function XmlToJson(xml) {
  var r = /<string.+?>(.+)<\/string>/
  return r.exec(xml)[1]
}

// function xmlToJson(xml) {
//   // Create the return object
//   var obj = {};
//   if (xml.nodeType == 1) { // element
//     // do attributes
//     if (xml.attributes.length > 0) {
//       obj["@attributes"] = {};
//       for (var j = 0; j < xml.attributes.length; j++) {
//         var attribute = xml.attributes.item(j);
//         obj["@attributes"][attribute.nodeName] = attribute.nodeValue;
//       }
//     }
//   } else if (xml.nodeType == 3) { // text
//     obj = xml.nodeValue;
//   }
//   // do children
//   if (xml.hasChildNodes()) {
//     for (var i = 0; i < xml.childNodes.length; i++) {
//       var item = xml.childNodes.item(i);
//       var nodeName = item.nodeName;

//       if (typeof (obj[nodeName]) == "undefined") {
//         obj[nodeName] = xmlToJson(item);
//       } else {
//         if (typeof (obj[nodeName].length) == "undefined") {
//           var old = obj[nodeName];
//           obj[nodeName] = [];
//           obj[nodeName].push(old);
//         }
//         obj[nodeName].push(xmlToJson(item));
//       }
//     }
//   }
//   return obj;
// }

function ImagePreview(file) {
  var dtd = $.Deferred()
  var reader = new FileReader()
  reader.onload = function() {
    var url = reader.result
    dtd.resolve(url)
  }
  reader.readAsDataURL(file)
  return dtd
}

function TransformImageData(imgData) {
  return imgData.replace(/^.+\,/, '')
}

function UploadImg(userid, imgData) {
  imgData = imgData.replace(/^.+\,/, '')
  return $.ajax({
    url: BaseService.apiUrl + 'saveimg',
    data: {
      userid: userid,
      fileNameurl: imgData
    }
  })
}