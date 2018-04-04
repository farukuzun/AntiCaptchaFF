if (typeof ContentScript !== 'function') {
	ContentScript = function (window, document, $, browser, selectors) {
		this.window = window;
		this.document = document;
		this.$ = $;
		this.browser = browser;
		this.selectors = selectors;
		this.initMessageListener();
		this.initFunctionality();
		// this.enableKeyListener();
	};
	ContentScript.prototype = {
		constructor: ContentScript,
		tabActive: true,
		switchStatus:true,
		status: 'inactive',
		initFunctionality: function () {
			var self = this;
			this.status = 'active';
      self.browser.storage.sync.get({
        buttonState: false
      }, function(items){
        if(items != undefined) {
          self.buttonState = items.buttonState;
          if(self.buttonState) {
          	self.enableArrive();
					}
        } else {
          self.enableArrive();
        };
      });
      self.sendMessageToBg('enableKeyListener',[],[])
    },
		enableArrive:function() {
			var self = this;
      this.document.arrive(this.selectors.captchElement, { existing: true, onceOnly:true }, function (e) {
        if (self.tabActive) {
          self.browser.storage.sync.get({
            buttonState: false
          }, function(items){
            if(items != undefined) {
              self.buttonState = items.buttonState;
              if(self.buttonState) {
              	self.sendDataKey(e);
							}
            } else {
            	self.sendDataKey(e);
						};
          });
          }
      });
		},
		enableArriveOnce:function() {
			var self = this;
      this.document.arrive(this.selectors.captchElement, { existing: true, onceOnly:true }, function (e) {
        if (self.tabActive) {
          self.sendDataKey(e);
        }
      });
		},
		sendDataKey: function(e) {
			var self = this;
      var $div = self.$(e).closest('.g-recaptcha');
      var dataSiteKey = self.$($div).attr('data-sitekey');
      var url = self.window.location.href;
      self.enableChildDiv();
      self.sendMessageToBg('getTaskId',{dataSiteKey:dataSiteKey,site:url},self.taskIdResponse.bind(self))
    },
		enableChildDiv:function() {
			var self = this;
      self.document.arrive(this.selectors.captchElementChild, { existing: true, onceOnly:true }, function (e) {
        if (self.tabActive) {
          self.$(self.document).unbindArrive(self.selectors.captchElementChild);
          self.enableLoader(e);
        }
      });
		},
		taskIdResponse:function(response) {
			var self = this;
      self.sendMessageToBg('getPassword',{taskId:response.data.taskId},self.taskResultResponse.bind(self))
		},
		taskResultResponse: function(response) {
			var self = this;
      if(response.status === 'success' && response.data.status === 'processing') {
        self.sendMessageToBg('getPassword',{taskId:response.args.taskId},self.taskResultResponse.bind(self))
			} else {
        var $responseDiv = self.$(self.selectors.captchaResponse);
        self.$($responseDiv).html(response.data.solution.gRecaptchaResponse);
        self.disableLoader();
        self.sendMessageToBg('successNotify',{site:self.window.location.href, date:new Date()},[]);
      }
		},
		enableLoader:function (e) {
			var self = this;
			var $captchaDiv = self.$(e);
      // $captchaDiv = self.$($captchaDiv).first();
      self.$($captchaDiv).addClass('enableLoader');
      self.$($captchaDiv).prepend("<div id='loader'style='position: absolute;'>Solving Captcha Please Wait...</div>");
		},
		disableLoader:function() {
			var self = this;
      var $captchaDiv = self.$(self.selectors.captchElement+' .enableLoader');
      self.$($captchaDiv).removeClass('enableLoader');
      self.$($captchaDiv).children('#loader').remove();
      self.$($captchaDiv).addClass('disableLoader');
      self.$($captchaDiv).prepend("<div id='loader'style='position: absolute;'><h2>Solved.</h2></div>");      
		},
		initMessageListener: function () {
			var self = this;
			this.browser.runtime.onMessage.addListener(function (message, sender, response) {
				if (!self[message.method]) {
					throw new Error('Method "' + message.method + '" does not exist');
				}
				var tab = sender;
				message.args = message.args || [];
				message.args.push(tab);
				message.args.push(response);
				self[message.method].apply(self, message.args || []);
				return true;
			});
		},
		sendMessageToBg: function (method, args, cb) {
			args = (args === null || typeof args === "undefined") ? [] : args;
			args = Array.isArray(args) ? args : [args];
			cb = typeof cb === "undefined" ? null : cb;
			if (typeof method === "undefined" || typeof method !== "string") {
				throw new Error("Missing required parameter 'method'");
			}
			this.browser.runtime.sendMessage({
				method: method,
				args: args
			},cb);
		}
	}
}
var content = new ContentScript(window, document, jQuery, browser, selectors);