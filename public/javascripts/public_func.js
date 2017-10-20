//时间处理函数
var publicFunc = {
	/**
	 * 获取两个时间之间的差
	 * @param {Object} startDate
	 * @param {Object} endDate
	 */
	"diffTime": function(startDate, endDate) {
		var this_startData = new Date(startDate.replace(/-/g, "/"));
		var this_endDate = new Date(endDate.replace(/-/g, "/"));
		var diff = this_endDate.getTime() - this_startData.getTime(); //时间差的毫秒数  
		//判断时间是否结束
		if(diff<0){
			return "00:00:00";
		}
		var theTime = parseInt(diff/1000); // 秒 
		//基础小时数
		var days_hours=Math.floor(diff/(24*3600*1000))*24;
		//计算出小时数
		var leave1=diff%(24*3600*1000)    //计算天数后剩余的毫秒数
		var hours=Math.floor(leave1/(3600*1000))+days_hours
		if(hours<10){
			hours=0+""+hours
		}
		//计算相差分钟数
		var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
		var minutes=Math.floor(leave2/(60*1000))
		if(minutes<10){
			minutes=0+""+minutes
		}
		//计算相差秒数
		var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
		var seconds=Math.round(leave3/1000)
		if(seconds<10){
			seconds=0+""+seconds
		}
		var result=hours+":"+minutes+":"+seconds
		return result;
	}
}
module.exports = publicFunc;