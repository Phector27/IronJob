(function () {
    var options = {
        facebook: "104079551548311",
        whatsapp: "+34 640254348",
        call_to_action: "¿Dudas? Escríbenos :)",
        button_color: "#4CAF50",
        position: "right",
        order: "facebook,whatsapp",
    };
    var proto = document.location.protocol, host = "getbutton.io", url = proto + "//static." + host;
    var s = document.createElement('script'); s.type = 'text/javascript'; s.async = true; s.src = url + '/widget-send-button/js/init.js';
    s.onload = function () { WhWidgetSendButton.init(host, proto, options); };
    var x = document.getElementsByTagName('script')[0]; x.parentNode.insertBefore(s, x);
})();