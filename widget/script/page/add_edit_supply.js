function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      if (api.pageParam.id) {
        this.getSupply()
      }
    },
    data: function() {
      return {
        skill: {
          userid: Helper.getUserId(),
          skillName: '',
          skilldetails: '',
          skilltype: '',
          servertime: '',
          Province: '',
          City: '',
          District: '',
          money: '',
          imgarr: '',
          Remark: ''
        },
        title: api.pageParam.id ? '修改供应' : '发布供应',
        // title: '修改供应',
        submiting: false,
        images: []
      }
    },
    computed: {
      zoneText: function() {
        var skill = this.skill
        if (skill.Province) {
          return skill.Province + ' ' + skill.City + ' ' + skill.District
        }
        return '请选择地区'
      }
    },
    methods: {
      getSupply: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getskillinfo',
          data: {
            skillid: api.pageParam.id,
            userid: Helper.getUserId()
            // skillid: 'a17db629-52b6-4b6a-a904-e6c1721e3a03'
          }
        }).then(function(res) {
          var data = ParseJson(res.data)[0]
          var skill = self.skill
          skill.ddid = data.skillID
          skill.skillName = data.skillName
          skill.skilldetails = data.skilldetails
          skill.skilltype = data.skillType || ''
          skill.Province = data.addressprovince
          skill.City = data.addresscity
          skill.District = data.addDistrict
          skill.money = data.smoney
          skill.Remark = data.Remark
          skill.servertime = data.servertime
          _.forEach(data.Skillworksmodel, function(v) {
            convertImgToBase64(v.skillwoksurl, function(base64) {
              self.images.push(base64)
            })
          })
        }, function(err) {
          api.toast({msg: err.message});
        })
      },
      onSelectDate: function() {
        var self = this
        api.openPicker({
          type: 'date',
          title: '选择时间'
          }, function(ret, err) {
          self.skill.servertime = ret.year + '-' + ret.month + '-' + ret.day
        })
      },
      selectDistrict: function() {
        var self = this;
        var UIActionSelector = api.require('UIActionSelector');
        UIActionSelector.open({
          datas: 'widget://res/city.json',
          layout: {
            row: 5,
            col: 3,
            height: 40,
            size: 14,
            sizeActive: 14,
            rowSpacing: 5,
            colSpacing: 10,
            maskBg: 'rgba(0,0,0,0.2)',
            bg: '#fff',
            color: '#888',
            colorActive: '#e4353a',
            colorSelected: '#e4353a'
          },
          animation: true,
          cancel: {
            text: '取消',
            size: 14,
            w: 90,
            h: 35,
            bg: '#ddd',
            bgActive: '#ddd',
            color: '#fff',
            colorActive: '#fff'
          },
          ok: {
            text: '确定',
            size: 14,
            w: 90,
            h: 35,
            bg: '#e4353a',
            bgActive: '#e4353a',
            color: '#fff ',
            colorActive: '#fff'
          },
          title: {
            text: '请选择',
            size: 14,
            h: 44,
            bg: '#eee',
            color: '#333'
          }
        }, function(ret, err) {
          if (ret.eventType === 'ok') {
            self.skill.Province = ret.level1;
            self.skill.City = ret.level2;
            self.skill.District = ret.level3;
          }
        });
      },
      deleteImage: function(index) {
        this.images.splice(index, 1)
      },
      validate: function() {
        var error = '';
        var skill = this.skill;
        var dateNow = new Date()
        var servertime = skill.servertime.replace(/-/g, '/')
        if (_.trim(skill.skillName) === '') {
          error = '请输入供应名称';
        } else if (skill.skillName.length > 10) {
          error = '供应名称最大长度为10个字';
        } else if (skill.skilltype === '') {
          error = '请选择供应类别';          
        } else if (skill.skilldetails === '') {
          error = '请输入详情描述';
        } else if (isNaN(Number(skill.money))) {
          error = '请输入正确金额';
        } else if (!!skill.money && skill.money < 1) {
          error = '价格不能小于1元';
        } else if (skill.Province === '') {
          error = '请选择地区';
        } else if (skill.servertime && new Date(servertime).getTime() < new Date(dateNow.getFullYear() + '/' + (dateNow.getMonth() + 1) + '/' + dateNow.getDate()).getTime()) {
          error = '有效时间不能小于当前时间'
        }
        
        return error;
      },
      onSubmit: function() {
        if (this.submiting) return
        var error = this.validate();
        if (error) {
          api.toast({ msg: error });
          return;
        }
        this.skill.imgarr = _.map(this.images, Helper.transformImageData).join(',')
        var data = _.clone(this.skill)
        data.servertime = data.servertime ? new Date(data.servertime.replace(/-/g, '/')).getTime() : ''
        if (!data.District) {
          data.District = data.City
          data.City = data.Province
        }
        this.submiting = true
        if (api.pageParam.id) {
          data.ddid = api.pageParam.id
          this.edit(data)
        } else {
          this.add(data)
        }
      },
      edit: function(data) {
        $.ajax({
          url: BaseService.apiUrl + 'updateSkill',
          data: data
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
            msg: '修改成功'
            })
            api.closeToWin({name: 'mysupply'})
          } else {
            api.toast({
            msg: res.mage
            })
          }
        })
      },
      add: function(data) {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'addSkill',
          data: data
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
              msg: '发布成功'
            })
            setTimeout(function() {
              api.closeWin()
            }, 2000)
          } else {
            api.toast({
              msg: res.mage
            })
          }
        }, function(err) {
          api.toast({
            msg: '添加失败'
          })
        }).always(function() {
          self.submiting = false
        })
      },
      handleSelectImage: function () {
        var self = this;
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
            self.images.push(ret.base64Data)
        });
      }
    }
  })
}

apiready = function(){
  initPage()
}
