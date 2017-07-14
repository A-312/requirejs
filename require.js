var requirejs = {
	nbrfile_max: 0,
	nbrfile_load: 0,
	objects: {},
	images: {},
	success: function() {},
	define: function(name, object) {
		requirejs.objects[name] = object;
	},
	load: function(opt, callback, baseURL, prefix) {
		var func = function(e) {
			requirejs.nbrfile_load++;

			if (requirejs.nbrfile_max == requirejs.nbrfile_load) {
				requirejs.success(requirejs.objects);
			}
		};
		var funcErr = function(e) {
			var url = this.src;
			this.parentNode.removeChild(this);
			setTimeout(function() {
				var script = requirejs.addScript(url);
				script.onload = func;
				script.onerror = funcErr;

				(opt.error && opt.error(e));
			}, 2000);
		}
		prefix = prefix || "";
		var gblMeta = getMetaContentByTagName("requirejs.dir"),
			meta = {
				js: getMetaContentByTagName("requirejs.dir-js") || gblMeta,
				css: getMetaContentByTagName("requirejs.dir-css") || gblMeta,
				img: getMetaContentByTagName("requirejs.dir-img") || gblMeta
			};

		if (!baseURL || typeof baseURL == "string") {
			var abc = baseURL || gblMeta || "";
			baseURL = {
				js: meta.js || abc,
				css: meta.css || abc,
				img: meta.img || abc
			};
		} else {
			baseURL = {
				js: baseURL.js || "",
				css: baseURL.css || "",
				img: baseURL.img || ""
			};
		}

		var url;

		if (opt.js) {
			var script;
			for (var i = 0; i < opt.js.length; i++) {
				if (typeof(js_is_minify) == "undefined" || js_is_minify.indexOf(opt.js[i]) == -1) {
					//requirejs.addScript((opt.js[i]=='javascript/lib/jquery-ui.js')?opt.js[i]:opt.js[i]+prefix).onload = func;

					url = (opt.js[i].indexOf("://") !== -1) ? "" : baseURL.js;
					script = requirejs.addScript(url + opt.js[i] + prefix);
					script.onload = func;
					script.onerror = funcErr;

					requirejs.nbrfile_max++;
				}
			}
		}
		if (opt.css) {
			for (var i = 0; i < opt.css.length; i++) {
				url = (opt.css[i].indexOf("://") !== -1) ? "" : baseURL.css;
				requirejs.addCSS(url + opt.css[i] + prefix).onload = func;

				requirejs.nbrfile_max++;
			}
		}
		if (opt.img) {
			for (var x in opt.img) {
				url = (opt.img[x].indexOf("://") !== -1) ? "" : baseURL.img;

				requirejs.images[x] = new Image();
				requirejs.images[x].onload = func;
				requirejs.images[x].src = url + opt.img[x] + prefix;

				requirejs.nbrfile_max++;
			}
		}
		requirejs.success = callback;
	},
	addScript: function(url) {
		var script = document.createElement("script");
		script.type = "text/javascript";
		script.src = url;
		script.charset = "utf-8";
		script.async = true;

		document.getElementsByTagName("head")[0].appendChild(script);

		return script;
	},
	addCSS: function(url) {
		var css = document.createElement("link");
		css.type = "text/css";
		css.href = url;
		css.rel = "stylesheet";

		document.getElementsByTagName("head")[0].appendChild(css);

		return css;
	}
};

function getMetaContentByTagName(c) {
	for (var b = document.getElementsByTagName("meta"), a = 0; a < b.length; a++) {
		if (c == b[a].name || c == b[a].getAttribute("property")) {
			return b[a].content;
		}
	}
	return false;
}

window.addEventListener("load", function() {
	requirejs.__loaded = true;
}, false);

/*
HTML :
<meta name="requirejs.dir-js" content="javascript/" />
JS :
requirejs.load({
	js: [
		"file1.js",
		"file2.js"
	],
	css: [],
	img: [],
	error: function(e) {
		if (e.target.src.indexOf("socket.io") !== -1 && requirejs.objects.overlay) {
			//..
		}
	}
}, function(objects) {
	//...
}, null, "?debug=" + (new Date()).getTime());
*/
