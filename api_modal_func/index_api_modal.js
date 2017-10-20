var indexModal={
 	/**
 	 * @param {Object} app_req_pram
 	 * @param {Object} app_res_pram
 	 * @param {Object} get_request
 	 * @param {Object} qs
 	 */
 	"getAuthorize":function(app_req_pram,app_res_pram,get_request,qs) {
		let reqUrl = 'https://api.weixin.qq.com/sns/oauth2/access_token?';
		let params = {
			appid: app_req_pram.body.appid,
			secret: app_req_pram.body.secret,
			code: app_req_pram.body.js_code,
			grant_type: 'authorization_code'
		};
		let options = {
			method: 'get',
			url: reqUrl + qs.stringify(params)
		};
		//返回处理信息
		get_request(options, function(auth_err, auth_res, auth_body) {
			if(auth_res) {
				//数据处理
				var thisAuth=JSON.parse(auth_body); 
				//返回json
				app_res_pram.send({
					"code":1,
					"message":"授权成功",
					"openid":thisAuth.openid
				});
			} else {
				app_res_pram.send({
					"code":0,
					"message":"授权失败",
				});
			}
		})
	},
	/**
	 *同一个用户参与的正在进行中的活动
	 */
	"joinReturnTimer":function(joinUser){
		//正在参与的用户
		var ing_user="";
		for(var i=0;i<joinUser.length;i++){
			if(joinUser[i].activeType==1){
				ing_user=joinUser[i];
				break
			}
		}
		//证明此人没有参与活动
		if(ing_user==""){
			return false;
		}else{
			//得到时间
			return ing_user;
		}
	}
}	
module.exports=indexModal;