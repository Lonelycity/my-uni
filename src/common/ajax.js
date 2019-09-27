import store from '../store'
var BASEURL = store.state.user.BASEURL

function generateUUID() {
  var d = new Date().getTime();
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
  return uuid;
}

export default{
  get (url,data) {
    uni.showLoading({
        title: '加载中',
        mask: true
    })
    return new Promise((resolve, reject) => {
      uni.request({
        url: BASEURL+url,
        method: 'GET',
        header: {
          'Authorization': store.state.user.token,
          'version': store.state.user.version,
          'timeStamp' : Date.now(),
          'nonce' : generateUUID().replace(/-/g,''),
          'channel': 'H5'
        },
        data: data,
        success: (res) => {
          if (!(res.statusCode == 200 || res.statusCode == 304)) {
            uni.showToast({
              title:'服务器繁忙，请稍后重试',
              icon:'none'
            })
            resolve(null)
            return
          }
          let data = res.data
          // token失效
          if (data.returnCode == 401) {
            uni.showToast({
              title: '登录已失效，请重新登录',
              icon: 'none',
              success: () => {
                uni.removeStorage({
                  key: 'userInfo',
                  success: function () {
                    // 清除vuex
                    store.dispatch('user/saveToVuex',{openId:null,unionId:null,sessionKey:null})
                    // #ifdef H5
                    uni.navigateTo({
                      url: '/pagesM/mine/login'
                    })
                    // #endif
                    // #ifdef MP-WEIXIN
                    uni.navigateTo({
                      url: '/pagesM/mine/wxLogin'
                    })
                    // #endif
                  }
                })
              }
            })
          }
          resolve(data)
        },
        fail: (err) => {
          uni.showToast({
            title: '请求超时，请检查网络',
            icon: 'none',
            success: () => {
              reject(err)
            }
          })
        },
        complete: (err) =>{
          uni.hideLoading()
        }
      })
    })
  },
  post (url,data) {
    uni.showLoading({
        title: '加载中',
        mask: true
    })
    return new Promise((resolve, reject) => {
      uni.request({
        url: BASEURL+url,
        method: 'POST',
        header: {
          'Authorization': store.state.user.token,
          'version': store.state.user.version,
          'timeStamp' : Date.now(),
          'nonce' :generateUUID().replace(/-/g,''),
          'channel': 'H5'
        },
        data: data,
        success: (res) => {
          let data = res.data
          // token失效
          if (data.returnCode == 401) {
            uni.showToast({
              title: '登录已失效，请重新登录',
              icon: 'none',
              success: () => {
                uni.removeStorage({
                  key: 'userInfo',
                  success: function () {
                    // 清除vuex
                    store.dispatch('user/saveToVuex',{openId:null,unionId:null,sessionKey:null})
                    // #ifdef H5
                    uni.navigateTo({
                      url: '/pagesM/mine/login'
                    })
                    // #endif
                    // #ifdef MP-WEIXIN
                    uni.navigateTo({
                      url: '/pagesM/mine/wxLogin'
                    })
                    // #endif
                  }
                })
              }
            })
          } 
          resolve(data)
        },
        fail: (err) => {
          uni.showToast({
            title: '请求超时，请检查网络',
            icon: 'none',
            success: () => {
              reject(err)
            }
          })
        },
        complete: (err) =>{          
          uni.hideLoading()
        }
      })
    })
  }
}








  // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9c62c29873b77f47
  // &redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2F
  // &response_type=code
  // &scope=snsapi_base
  // &state=123#wechat_redirect

  // https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx9c62c29873b77f47&redirect_uri=http%3A%2F%2Flocalhost%3A8080%2F%23%2F&response_type=code&scope=snsapi_base&state=123#wechat_redirect








