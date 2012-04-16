(function($) {
	$.extend( $.support, {
		pushState: "pushState" in history && "replaceState" in history
	});

	// hashchange
	if (!$.support.pushState) {
		/*
		 * jQuery hashchange event - v1.3 - 7/21/2010
		 * http://benalman.com/projects/jquery-hashchange-plugin/
		 *
		 * Copyright (c) 2010 "Cowboy" Ben Alman
		 * Dual licensed under the MIT and GPL licenses.
		 * http://benalman.com/about/license/
		 */
		(function($,e,b){var c="hashchange",h=document,f,g=$.event.special,i=h.documentMode,d="on"+c in e&&(i===b||i>7);function a(j){j=j||location.href;return"#"+j.replace(/^[^#]*#?(.*)$/,"$1")}$.fn[c]=function(j){return j?this.bind(c,j):this.trigger(c)};$.fn[c].delay=50;g[c]=$.extend(g[c],{setup:function(){if(d){return false}$(f.start)},teardown:function(){if(d){return false}$(f.stop)}});f=(function(){var j={},p,m=a(),k=function(q){return q},l=k,o=k;j.start=function(){p||n()};j.stop=function(){p&&clearTimeout(p);p=b};function n(){var r=a(),q=o(m);if(r!==m){l(m=r,q);$(e).trigger(c)}else{if(q!==m){location.href=location.href.replace(/#.*/,"")+q}}p=setTimeout(n,$.fn[c].delay)}$.browser.msie&&!d&&(function(){var q,r;j.start=function(){if(!q){r=$.fn[c].src;r=r&&r+a();q=$('<iframe tabindex="-1" title="empty"/>').hide().one("load",function(){r||l(a());n()}).attr("src",r||"javascript:0").insertAfter("body")[0].contentWindow;h.onpropertychange=function(){try{if(event.propertyName==="title"){q.document.title=h.title}}catch(s){}}}};j.stop=k;o=function(){return a(q.location.href)};l=function(v,s){var u=q.document,t=$.fn[c].domain;if(v!==s){u.title=h.title;u.open();t&&u.write('<script>document.domain="'+t+'"<\/script>');u.close();q.location.hash=v}}})();return j})()})(jQuery,this);
	}

	/*
	 * jState jQuery Plugin version 1.0
	 *
	 * Copyright (c) 2012 hisasann http://hisasann.com/
	　*
	 * HTML5のhistory.replaceState、history.pushStateを使って履歴のコントロールをしやすくしたプラグインです。
	 * pushStateに対応していない場合はhashchangeが呼ばれます。
	　*
	 */
	var $window = $(window),
		options = {
			hashchange: null,
			popstate: null
		};

	$.jState = function() {};

	$.jState.setup = function(opts) {
		$.extend(options, opts);

		if ($.support.pushState) {
			$.jState.modify(location.href, false);
			$window.bind("popstate", onPopState);
		} else {
			$window.bind("hashchange", onHashChange);
		}
	}
	
	if ($.support.pushState) {
		$.jState.modify = function(state, param) {
			if (param.isReplace)
				replaceState(rejectDomain(state));
			else
				pushState(rejectDomain(state));

			return $.jState;
		};
	} else {
		$.jState.modify = function(hash) {
			location.hash = "#" + hash;

			return $.jState;
		};
	}

	// 現在のエントリを入れ替える
	function replaceState(state) {
		history.replaceState(state, "", makeAbsoluteUri(state));

		return $.jState;
	};

	// エントリを新規に追加する
	function pushState(state) {
		history.pushState(state, "", makeAbsoluteUri(state));

		return $.jState;
	};

	function onHashChange() {
		options.hashchange(location.hash);
	}

	function onPopState(event) {
		var state = event.originalEvent.state;

		if (!state) { return; }

		options.popstate(state);
	};
	
	function makeAbsoluteUri(state) {
		// return [location.protocol, "//", location.host, state, location.search, location.hash].join("");
		return [location.protocol, "//", location.host, state].join("");
	}

	function rejectDomain(url){
		if(!url) return null;

		var idx;

		idx = url.indexOf("/");
		if(idx == 0) return url;

		var baseurl = [location.protocol, "//", location.host].join('');
		idx = url.indexOf(baseurl);

		if(idx != 0) return "";

		return url.substr(baseurl.length);
	};

})(jQuery);
