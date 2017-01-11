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
  transformImageData: TransformImageData,
  getUserId: getUserId
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

Vue.component('user-box', {
  template: '',
  data: function() {
    return {}
  }
})

Vue.component('professor-box', {
  template: '<div class="professor-box">' +
            '<div class="professor-avatar">' +
            '  <img :src="professor.ephtourl" alt="">' +
            '</div>' +
            '<div class="professor-info ac">' +
            '  <div class="professor-name">{{professor.eName}}</div>' +
            '  <div class="professor-title">' +
            '    <span class="text-999">专家职称：</span>' +
            '    <span>{{professor.ezyname}}</span>' +
            '  </div>' +
            '</div>' +
            '</div>',
  props: ['professor']
})

Vue.filter('date', function(val, fmt) {
  console.log(val)
  if (typeof val === 'string') {
    val = parseInt(val.match(/\d+/)[0])
  }
  var date = new Date(val)
  console.log(date)
  var o = {
    "M+": date.getMonth() + 1, //月份 
    "d+": date.getDate(), //日 
    "h+": date.getHours(), //小时 
    "m+": date.getMinutes(), //分 
    "s+": date.getSeconds(), //秒 
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度 
    "S": date.getMilliseconds() //毫秒 
  };
  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
  if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
})

$.ajaxSetup({
  type: 'post',
  dataType: 'text',
  dataFilter: function(res) {
    // console.log(XmlToJson(res))
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

function getUserId() {
  if (window.api) {
    return api.getPrefs({key: 'userid', sync: true})
  }
  return MockData.userid
}