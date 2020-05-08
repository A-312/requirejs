# Utilisez terser au lieu de ce script !

Utilisez plutôt : [gulp-terser-js](https://www.npmjs.com/package/gulp-terser-js) comme ceci : https://github.com/A-312/ludumdare-basecode

----

Ma classe requirejs.

```html
<meta name="requirejs.dir-js" content="javascript/" />
```

Variables de configuration :

 - `requirejs.dir` : S'applique à js/css/img. Sauf si js/css/img sont définis.
 - `requirejs.dir-js` : S'applique à js.
 - `requirejs.dir-css` : S'applique à css.
 - `requirejs.dir-img` : S'applique à img.

```js
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
```
