const request = require('request');
const qs = require('querystring');
//引入数据库函数
var addUser=require('../models/user.js');//用户数据库模块

//导出模块
module.exports = function(app) {
	/**
	 * 微信授权
	 */
	app.post('/authorize', function(req, res) {
		getAuthorize(req,res);
	});
	/**
	 * 保存用户信息
	 */
	app.post('/recordUser', function(req, res) {
		/**
		 * 判断用户是否存在
		 */
		var cont_if={
			"openid":req.body.openid
		}
		addUser.judgeUser(cont_if,function(err, result){
			if(result){
				
				if(result.length>0){
					//这里做打卡判断
					
				}else{
					/**
					 * 存储用户信息
					 */
					addUser.saveUserInfo(req.body,function(err, result){
						if(result){
							res.send({
								"code":0,
								"message":"用户信息保存成功",
							});
						}else{
							res.send({
								"code":0,
								"message":"网络错误",
							});
						}
					});
				}
			}else{
				res.send({
					"code":0,
					"message":"网络错误，请重试",
				});
			}
		});
	});
};
/**
 * 获取openid
 * @param {Object} req
 * @param {Object} res
 */
function getAuthorize(req,res) {
	let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
	let params = {
		appid: req.body.appid,
		secret: req.body.secret,
		code: req.body.js_code,
		grant_type: 'authorization_code'
	};
	let options = {
		method: 'get',
		url: reqUrl + qs.stringify(params)
	};
	//返回处理信息
	request(options, function(auth_err, auth_res, auth_body) {
		if(auth_res) {
			//数据处理
			var thisAuth=JSON.parse(auth_body); 
			//返回json
			res.send({
				"code":1,
				"message":"授权成功",
				"openid":thisAuth.openid
			});
		} else {
			res.send({
				"code":0,
				"message":"授权失败",
			});
		}
	})
}