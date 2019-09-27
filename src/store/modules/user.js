import ajax from '../../common/httpclient';
// import ajax from '../../common/ajax'
// import util from '../../common/util'
//  小程序  appId wx85b35086bf0d978e
// code地址  https://shop.qiancangkeji.cn/wx/?phone=    https://test.shop.qiancangkeji.cn/wxTest/?phone=
// 神策地址  https://sdata.qiancangkeji.cn:8106/sa?project=production   https://sdata.qiancangkeji.cn:8106/sa?project=default
//  接口地址 https://gateway.qcshop.qiancangkeji.cn       https://gateway.test.qcshop.qiancangkeji.cn
// 接口地址  https://gateway.alitest.qcshop.qiancangkeji.cn   localhost:8001   https://sit.ldyblog.com/elmapi
// 用户相关
const state = {
	appId: 'wx85b35086bf0d978e',
	appId_h5: 'wx9c62c29873b77f47',
	codeUrl: 'https://test.shop.qiancangkeji.cn/wxTest/?phone=',
	saUrl: 'https://sdata.qiancangkeji.cn:8106/sa?project=default',
	BASEURL: 'http://sit.ldyblog.com/elmapi',
	version: '0.0.1',
	userInfo: null,
	site: null,
	isLogin: null,
	token: '',
	siteDefault: null,
	openId: '',
	unionId: '',
	wxUser: null,
	coupon: [],
	voteCoupon: {
		id: '',
		couponId: ''
	},
	tempSite: null,
	sessionKey: null,
	locations: {
		longitude: '',
		latitude: '',
		address: '',
		stores: {
			id: null,
			isBusiness: true,
			match: true
		}
	},
	stores: {
		id: null
	},
	provider: null // 当前平台
};
// 定义异步方法
const actions = {
	// 调用接口获取登录凭证（code） 小程序获取openid
	wxsmall({ commit, state, dispatch }) {
		// 清除用户微信信息
		dispatch('saveWxUser', {
			token: '',
			openId: '',
			unionId: '',
			userId: '',
			sessionKey: ''
		});
		return new Promise((resolve, reject) => {
			uni.login({
				provider: 'weixin',
				success: (res) => {
					if (res.code) {
						ajax
							.post('/newxcx/login/getWxOpenId', {
								code: res.code,
								appId: state.appId
							})
							.then((data) => {
								data.dataInfo = JSON.parse(data.data);
								resolve(data);
							});
					}
				}
			});
		});
	},
	// 无unionId 用户
	getUnionId({ commit, state, dispatch }) {
		return new Promise((resolve, reject) => {
			// 获取授权信息
			wx.getSetting({
				success: (res) => {
					if (res.authSetting['scope.userInfo']) {
						uni.getUserInfo({
							provider: 'weixin',
							success: (infoRes) => {
								ajax
									.post('/newxcx/encryptedData', {
										encryptedData: infoRes.encryptedData,
										sessionKey: infoRes.signature,
										iv: infoRes.iv,
										appId: state.appId,
										openId: state.openId
									})
									.then((data) => {
										if (data.code == '1') {
											if (data.data) {
												dispatch('saveUser', data.data);
											}
										} else {
											uni.showToast({
												title: '获取用户信息失败,正在重试',
												icon: 'none',
												success: () => {
													dispatch('wxsmall');
												}
											});
										}
										resolve(data);
									});
							}
						});
					}
				}
			});
		});
	},
	// 解密微信用户信息
	getWxUserInfo({ commit, state, dispatch }, { sessionKey }) {
		return new Promise((resolve, reject) => {
			// 获取授权信息
			wx.getSetting({
				success: (res) => {
					if (res.authSetting['scope.userInfo']) {
						uni.getUserInfo({
							// provider: 'weixin',
							success: (infoRes) => {
								ajax
									.post('/newxcx/encryptedData', {
										encryptedData: infoRes.encryptedData,
										sessionKey: sessionKey,
										iv: infoRes.iv,
										appId: state.appId,
										openId: state.openId
									})
									.then((data) => {
										commit('setUserInfo', { userInfo: data.data });
										uni.setStorage({
											key: 'userInfo',
											data: JSON.stringify(data.data)
										});
										resolve(data);
									});
							}
						});
					}
				}
			});
		});
	},
	// 支付宝小程序换取授权访问令牌
	aliUserInfo({ commit, state, dispatch }, { code }) {
		return new Promise((resolve, reject) => {
			ajax
				.post('/newxcx/login/aliUserInfo', {
					code
				})
				.then((data) => {
					console.log('获取令牌结果', data);
					commit('setUserInfo', { userInfo: data });
					uni.setStorage({
						key: 'aliuserInfo',
						data: JSON.stringify(data.data)
					});
				});
		});
	},
	// 保存微信信息
	saveWxUser({ commit, state }, json) {
		if (json) {
			commit('setwxUser', json);
		} else {
			commit('setwxUser', {});
		}
	},
	// 获取当前平台
	getProvider({ commit, state, dispatch }, { service }) {
		return new Promise((resolve, reject) => {
			uni.getProvider({
				service: service,
				success: function(res) {
					resolve(res);
				}
			});
		});
	}
};
// 定义同步函数 Mutations 变化
const mutations = {
	setUserInfo(state, json) {
		state.userInfo = json;
	},
	setwxUser(state, json) {
		state.wxUser = json;
	}
};
const getters = {};
export default {
	namespaced: true,
	state,
	getters,
	actions,
	mutations
};
