function initPage() {
  var vm = new Vue({
    el: '.wrapper',
    created: function() {
      this.getDemand()
    },
    data: function() {
      return {
        title: api.pageParam.id ? '修改需求' : '新增需求',
        demandId: api.pageParam.id,
        demand: {
          userid: Helper.getUserId(),
          xqname: '',
          rnum: '1',
          timenum: '长期',
          xqdetails: '',
          money: '',
          perid: '', // 省
          cid: '', // 市
          diid: '', // 地区
          xqtype: '' // 分类
        },
        proviceList: [],
        upload_images: []
      }
    },
    computed: {
      zone: function() {
        if (this.demand.perid)
          return this.demand.perid + ' ' + this.demand.cid + ' ' + this.demand.diid;
        return '';
      },
      buttonText: function() {
        return this.demandId ? '确认修改' : '发布'
      }
    },
    methods: {
      getUserData: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getuserinfo',
          data: { uid: Helper.getUserId() }
        }).then(function(res) {
          var data = ParseJson(res.data)[0]
          if (data.levle === '普通用户') {
            api.confirm({
              title: '提示',
              msg: '发布需要需要实名认证，是否立即认证？',
              buttons: ['确定', '取消'],
            }, function (ret, err) {
              if (ret.buttonIndex === 1) {
                Helper.openWin('qualification')
                setTimeout(function() {
                  api.closeWin()
                }, 2000)
              } else {
                api.closeWin()
              }
            });
          }
        })
      },
      onSelectDate: function() {
        var self = this
        api.openPicker({
          type: 'date',
          title: '选择时间'
          }, function(ret, err) {
          self.demand.timenum = ret.year + '-' + ret.month + '-' + ret.day
        })
      },
      validate: function() {
        var error = '';
        var demand = this.demand;
        if (_.trim(demand.xqname) === '') {
          error = '请输入需求名称';
        } else if (demand.xqname.length > 10) {
          error = '需求名称最大长度为10个字';
        } else if (demand.xqtype === '') {
          error = '请选择需求类别';          
        } else if (demand.xqdetails === '') {
          error = '请输入详情描述';
        } else if (isNaN(Number(demand.money))) {
          error = '请输入正确金额';
        } else if (!!demand.money && demand.money < 1) {
          error = '金额不能小于1元';
        } else if (this.zone === '') {
          error = '请选择地区';
        }
        
        return error;
      },
      onSubmit: function() {
        var error = this.validate();
        if (error) {
          api.toast({msg: error});
          return;
        }
        if (this.demandId) {
          this.handleEditDemand()
        } else {
          this.handleAddDemand()
        }
      },
      handleAddDemand: function() {
        var self = this
        var data = _.clone(this.demand)
        if (data.timenum !== '长期') {
          data.timenum = new Date(data.timenum).getTime()
        } else {
          data.timenum = '';
        }
        $.ajax({
          url: BaseService.apiUrl + 'getaddDemandOrder',
          data: data
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
              msg: '发布成功'
            })
            api.sendEvent({
              name: 'refreshMyDemand'
            })
            // Helper.openWin('pay', {
            //   mmoney: self.demand.money * self.demand.rnum,
            //   orderId: res.data,
            //   orderType: 'demand'
            // });
            setTimeout(function() {
              api.closeWin()
            }, 1500);
          } else {
            api.toast({
              msg: res.mage
            })
          }
        }, function(err) {
          api.toast({msg: err.message});
        })
      },
      handleEditDemand: function() {
        var self = this
        var data = _.clone(this.demand)
        data.orderid = api.pageParam.id
        if (data.timenum !== '长期') {
          data.timenum = new Date(data.timenum).getTime()
        } else {
          data.timenum = '';
        }
        $.ajax({
          url: BaseService.apiUrl + 'UpdateDemandOrder',
          data: data
        }).then(function(res) {
          if (res.key === 'true') {
            api.toast({
              msg: '修改成功'
            })
            api.sendEvent({
              name: 'refreshMyDemand'
            })
            setTimeout(function() {
              api.closeWin()
            }, 1500);
          } else {
            api.toast({
              msg: res.mage
            })
          }
        }, function(err) {
          alert(JSON.stringify(err))
        })
      },
      getDemand: function() {
        var self = this
        $.ajax({
          url: BaseService.apiUrl + 'getxqinfo',
          data: { xqid: self.demandId, userid: Helper.getUserId() }
          //data: { xqid: 'a17db629-52b6-4b6a-a904-e6c1721e3a00', userid: Helper.getUserId()}
        })
        .done(function (res) {
          var data = ParseJson(res.data)[0]
          self.demand = {
            xqname: data.demandTitle,
            xqtype: data.demandtype,
            rnum: data.demandNum,
            timenum: Helper.dateFormat(data.dtime, 'yyyy-MM-dd'),
            xqdetails: data.ddetails,
            money: data.dmoney,
            perid: data.S_province,
            cid: data.s_City,
            diid: data.s_distrct
          }
        })
      },
      onSelectZone: function() {
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
            self.demand.perid = ret.level1;
            self.demand.cid = ret.level2
            self.demand.diid = ret.level3;
          }
        });
      }
    }
  })
}

apiready = function(){
    initPage()
}
