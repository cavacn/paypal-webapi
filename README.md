Paypal-webapi
---
从[这里](https://devtools-paypal.com/guide/pay_paypal/curl?env=sandbox)获取了部分代码，然后进行了一些封装。

install
---
	npm install paypal-webapi
How to use
---
	var Paypal = require("paypal-webapp");
	var paypal = new Paypal();
	paypal.init(clientid,secret);
	//{total:10,currency:"USD",detail:"megeg"}
	paypal.createPayment(data,cb);//创建订单
	paypal.checkPayment(data,cb);//check订单
Notices
---
	only 4 linux
流程图
---
	Client		Your Server					Paypal Server
		|			|							|
		|			|---- getAccessToken------->|
		|			|							|
		|			|<----------accessToken-----|
		|--buy----->|							|
		|			|-------createPayment------>|
		|			|							|
		|			|<------returPaymentinfo----|
		|<--payuri--|							|
		|			|							|
		|------------deal the payment---------->|
		|			|							|
		|			|<--------payment orderid---|
		|			|							|
		|			|-------check payment------>|
		|			|							|
		|			|<------payment info -------|