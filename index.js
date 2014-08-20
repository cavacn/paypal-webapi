var curl = require("curl-linux");
var Paypal = function(){
	
}

Paypal.prototype.init = function(client_id,secret,isdebug){
	this.client_id = client_id;
	this.secret = secret;
	this.access = null;
	this.lastTime = new Date();
	this.cancelUrl = "http://www.cavacn.com/paypal?cancel=true";
	this.returnUrl = "http://www.cavacn.com/paypal?return=true";
	this.paypalDomain = !isdebug?"https://api.sandbox.paypal.com/":"https://api.paypal.com/";
	console.log(this);
}

Paypal.prototype.getAccessToken = function(cb){
	
	//当前授权信息已经存在
	if(!!this.access){
		//当前授权信息没有超时
		if(((new Date()-this.lastTime)/1000)<this.access.expires_in){
			cb(null,this.access);
			return;
		}
	}
	//调用curl
	curl(	["-u",
				this.client_id+":"+this.secret,
			"-v",
				this.paypalDomain+"v1/oauth2/token",
			"-d",
				"grant_type=client_credentials",
			"-H",
				"Accept: application/json",
			"-H",
				"Accept-Language: en_US"],function(err,data){
					try{
						cb(err,JSON.parse(data));
					}catch(e){
						cb(e);
					}
				});
}

Paypal.prototype.createPayment = function(data,cb){
	
	var _this = this;
	var order = {"intent":"sale","redirect_urls":{"return_url":this.returnUrl,"cancel_url":this.cancelUrl},"payer":{"payment_method":"paypal"},"transactions":[{"amount":{"total":data.total,"currency":data.currency,extData:data.extData},"description":data.detail}]};

	this.getAccessToken(function(err,access){
	
		console.log(err,access);
	
		if(!!err){
			cb(err);
		}else{
			if(!!access){
				//access_token
				
				curl(	[
							"-v",
								_this.paypalDomain+"v1/payments/payment",
							"-H",
								"Content-Type: application/json",
							"-H",
								"Authorization: Bearer "+access.access_token,
							"-d",JSON.stringify(order)
								
						],function(err,payment){
							/*
								null '{"id":"PAY-0E572602SS804515BKP2E46A","create_time":"2014-08-20T07:30:00Z","update_time":"2014-08-20T07:30:00Z","state":"created","intent":"sale","payer":{"payment_method":"paypal","payer_info":{"shipping_address":{}}},"transactions":[{"amount":{"total":"10.00","currency":"USD","details":{"subtotal":"10.00"}},"des.comtion":"测试订单1408519795199"}],"links":[{"href":"ttps://api.sandbox.paypal/v1/payments/payment/PAY-0E572602SS804515BKP2E46A","rel":"self","method":"GET"},{"href":"https://www.sandbox.paypal.com/cgi-bin/webscr?cmd=_express-checkout&token=EC-6U355871J46019300","rel":"approval_url","method":"REDIRECT"},{"href":"https://api.sandbox.paypal.com/v1/payments/payment/PAY-0E572602SS804515BKP2E46A/execute","rel":"execute","method":"POST"}]}'
							*/
							cb(err,payment);
				});
				
			}else{
				cb("access is null");
			}
		}
	});
}

Paypal.prototype.checkPayment = function(data,cb){
	/*{"return":"true","token":"EC-6U355871J46019300","PayerID":"WTYASBU2LERTG"}*/
	var _this = this;
	this.getAccessToken(function(err,access){
		if(!!err){
			cb(err);
		}else{
			if(!!access){
				var _d = {"payer_id":data.PayerID}
				curl( [
					"-v",
						_this,paypalDomain+"v1/payments/payment/"+data.paymentid+"/execute",
					"-H",
						"Content-Type:application/json",
					"-H",
						"Authorization:Bearer "+access.access_token,
					"-d",
						JSON.stringify(_d)
				],function(err,msg){
					cb(err,msg);
				})
			}else{
				cb("access is null");
			}
		}
	});
	
	
}

module.exports = exports = Paypal;

