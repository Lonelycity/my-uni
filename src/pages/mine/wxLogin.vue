<template>
  <div class="userInfo">
    <div class="logo">
      <!-- <image src="/static/icon/about.png" mode="widthFix" class="img1"></image>
			<image src="/static/icon/login_bg2.png" mode="widthFix" class="img2"></image> -->
    </div>
    <div class="mine">
      <!-- #ifdef MP-WEIXIN -->
      <button
        open-type="getUserInfo"
        @getuserinfo="getUser"
        class="btn"
      >微信一键授权</button>
      <p
        @click="cancel"
        class="cancel"
      >取消授权</p>
      <!-- #endif -->
      <!-- #ifdef MP-ALIPAY -->
      <button @click="onGetAuthorize">
        支付宝一键授权
      </button>
      <p
        @click="cancel"
        class="cancel"
      >取消授权</p>
      <!-- #endif -->
    </div>
  </div>
</template>
<script>
import {
  mapState,
  mapActions
} from 'vuex'
export default {
  data() {
    return {
      phone: null
    }
  },
  computed: {
    ...mapState({
      isLogin: state => state.user.isLogin,
      unionId: state => state.user.unionId,
      openId: state => state.user.openId,
      sessionKey: state => state.user.sessionKey,
      wxUser: state => state.user.wxUser,

    })
  },
  onLoad(option) {
    // #ifdef MP-ALIPAY
    // my.getAuthCode({
    //   scopes: 'auth_base', //auth_base auth_user
    //   success: (res) => {
    //     my.alert({
    //       content: res.authCode,
    //     });
    //   },
    // });
    // #endif

  },
  methods: {
    ...mapActions({
      wxsmall: 'user/wxsmall',
      getUnionId: 'user/getUnionId',
      getWxUserInfo: 'user/getWxUserInfo',
      aliUserInfo: 'user/aliUserInfo',
    }),
    cancel() {
      // 取消授权
      uni.navigateBack()
    },
    getUserState() {

    },
    getUser(e) {
      var that = this;
      console.log("是否进入授权");
      // 小程序同意授权
      if (e.detail.userInfo) {
        this.$store.commit('user/setwxUser', e.detail.userInfo)
        if (!this.openId) {
          this.wxsmall().then((data) => {
            if (data.code == '1') {
              this.getWxUserInfo({
                sessionKey: data.dataInfo.session_key
              }).then((info) => {
                console.log("获取微信信息", this.wxUser);
              });
            }
          })
        } else {
          this.getUserState()
        }
      } else {

      }
    },
    // 支付宝授权逻辑
    onGetAuthorize(e) {
      let that = this;
      my.getAuthCode({
        scopes: 'auth_user', //auth_base auth_user
        success: (res) => {
          let { authCode: code } = res;
          this.aliUserInfo({ code: code }).then((data) => {
            console.log("获取结果", data);
          });
        },
      });

      my.getOpenUserInfo({
        fail: (res) => {
          console.log("支付宝用户信息获取失败");
        },
        success: (res) => {
          let userInfo = JSON.parse(res.response).response // 以下方的报文格式解析两层 response
          console.log("支付宝用户信息", userInfo);
          uni.setStorage({
            key: 'userInfo',
            data: JSON.stringify(userInfo)
          });
        }
      });
    },
    onAuthError() {
      console.log("报错");
    }
  }
}
</script>
<style lang="less" scoped>
.userInfo {
  background: url("https://shop-img-test-1258048518.file.myqcloud.com/mall/9cd6372b-7f62-477d-b92d-8eb2d07b8c069144226469137061.png")
    no-repeat center top;
  background-size: 100%;

  .logo {
    padding-top: 320upx;

    .img1 {
      width: 200upx;
      height: 200upx;
      display: block;
      margin: 0 auto;
    }

    .img2 {
      width: 382upx;
      display: block;
      margin: 40upx 0 300upx 156upx;
    }
  }

  .mine {
    width: 90%;
    margin: 0 auto;

    .btn {
      border-radius: 40upx;
      background: #90c320;
      border-color: #90c320;
      color: #fff;
      font-size: 34upx;
    }

    .cancel {
      font-size: 28upx;
      color: #999;
      text-align: center;
      margin: 20upx 0;
    }
  }
}
</style>