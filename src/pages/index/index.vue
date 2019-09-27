<template>
	<view class="content">
		<button @click="tologin">登录</button>
	</view>
</template>

<script>
import {mapState, mapActions } from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {
      tologin(){
        uni.navigateTo({url:'../mine/wxLogin'});
      }
		}
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}

	.logo {
		height: 200upx;
		width: 200upx;
		margin-top: 200upx;
	}

	.title {
		font-size: 36upx;
		color: #8f8f94;
	}
</style>
