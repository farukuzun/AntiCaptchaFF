if (typeof Popup !== 'function') {
  Popup = function (window, document, browser, $) {
    this.window = window;
    this.document = document;
    this.browser = browser;
    this.$ = $;
    this.init();
  };
  Popup.prototype = {
    constructor: Popup,
    init: function() {
      var self = this;
      this.initMessageListener();
      this.browser.storage.sync.get({
        buttonState: false
      }, function(items){
        if(items) {
          self.buttonState = items.buttonState;
          self.setButton(items.buttonState);
        } else {
          self.browser.storage.sync.set({
            buttonState : false
          }).then(result => {
            console.log(result);
          });
        }
      });
    },
    initMessageListener: function(){
      var self = this;
      this.browser.runtime.onMessage.addListener(function (message, sender, response) {
        if (!self[message.method]) {
          return;
        }
        var tab = sender;
        message.args = message.args || [];
        message.args.push(tab);
        message.args.push(response);
        self[message.method].apply(self, message.args || []);
        return true;
      });
      var $toggle = self.$('#popup-switch');
      $toggle.on('change',function(e) {
        self.buttonState = e.currentTarget.checked;
        self.browser.storage.sync.set({
          buttonState : e.currentTarget.checked
        }).then(result => {
          self.buttonState = e.currentTarget.checked;
      });
      })
    },
    sendMessageToBg: function(method, args, cb){
      this.browser.runtime.sendMessage({
        method: method,
        args: [args]
      }, cb);
    },
    setButton:function(s) {
      var self = this;
      var $toggle = self.$('#popup-switch');
      $toggle.attr('checked',s);
    }
  };
}

var popup = new Popup(window, document, browser, jQuery);