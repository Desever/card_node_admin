/**
 * 微信支付
 */
var wx_pay={
	/**
	 * 统一下单接口
	 */
	"_openid":null,
	"crypto":null,
	"unifiedorder":function(ajaxData,get_request,get_crypto_param){
		//统一下单接口数据准备
		var readyData={
		 	"appid":ajaxData.appId,//小程序ID
	        "mch_id": ajaxData.mchId,//商户号
	        "nonce_str":"5K8264ILTKCH16CQ2502SI8ZNMTM67VS",//随机字符串
	        "sign":"",//签名
	        "body":"赫然科技-游戏",//商品描述
	        "out_trade_no":"20150806125346",//商户订单号
	        "total_fee":1,//总金额
	        "spbill_create_ip":"192.168.0.105",//ip地址
	        "notify_url":"http://localhost:3000/paytest",//回调地址
	        "trade_type":"JSAPI",//交易类型
		}
		
		//赋值opendid
		this._openid=ajaxData.openid;
		//赋值md5
		this.crypto=get_crypto_param;
		//签名赋值
		readyData.sign=paysignjsapi(readyData);
		
		var xmlObj=this.createXml(readyData);
		var url = "https://api.mch.weixin.qq.com/pay/unifiedorder";
		var a_option={
			url:url,
	        method:'POST',
	        body:xmlObj
		}
		console.log(xmlObj);
		get_request(a_option, function(pay_err, pay_res, pay_body) {
			console.log(pay_res)
			console.log(pay_body)
		})
	},
	/**
	 * 生成签名
	 */
	"paysignjsapi":function(thisData){
		var ret = {
	        appid:thisData.appId,
	        body:thisData.body,
	        mch_id: thisData.mchId,
	        nonce_str:thisData.nonce_str,
	        notify_url:thisData.notify_url,
	        openid:_openid,
	        out_trade_no:thisData.out_trade_no,
	        spbill_create_ip:thisData.spbill_create_ip,
	        total_fee:thisData.total_fee,
	        trade_type:thisData.trade_type
	    };
	    var string = ret;
	    var key = _key;
	    string = string + '&key='+key;
	    return this.crypto.createHash('md5').update(string,'utf8').digest('hex');
	},
	/**
	 * 创建xml
	 */
	"createXml":function(readyData){
		var formData = "<xml>";
	    formData += "<appid>"+readyData.appid+"</appid>"; //appid
	    formData += "<mch_id>"+readyData.mch_id+"</mch_id>"; //商户号
	    formData += "<nonce_str>"+readyData.nonce_str+"</nonce_str>"; //随机字符串，不长于32位
	    formData += "<sign>" +readyData.sign+ "</sign>";
	    formData += "<body>"+readyData.body+"</body>"; //商品或支付单简要描述
     	formData += "<out_trade_no>"+readyData.out_trade_no+"</out_trade_no>"; //订单号
     	formData += "<total_fee>"+readyData.total_fee+"</total_fee>"; //金额
     	formData += "<spbill_create_ip></spbill_create_ip>";//ip
 	 	formData += "<notify_url>"+readyData.notify_url+"</notify_url>"; //支付成功后微信服务器通过POST请求通知这个地址
	    formData += "<trade_type>JSAPI</trade_type>"; //NATIVE会返回code_url ，JSAPI不会返回
	    formData += "</xml>";
	    return formData;
	}
	
}
module.exports=wx_pay;