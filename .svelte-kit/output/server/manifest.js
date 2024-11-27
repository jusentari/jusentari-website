export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","me.jpg","posshydrafont.ttf"]),
	mimeTypes: {".png":"image/png",".jpg":"image/jpeg",".ttf":"font/ttf"},
	_: {
		client: {"start":"_app/immutable/entry/start.C2Q60eFo.js","app":"_app/immutable/entry/app.Ie1chxoM.js","imports":["_app/immutable/entry/start.C2Q60eFo.js","_app/immutable/chunks/entry.Bl86GQxA.js","_app/immutable/chunks/runtime.C8gK25mD.js","_app/immutable/entry/app.Ie1chxoM.js","_app/immutable/chunks/runtime.C8gK25mD.js","_app/immutable/chunks/render.Be5YMnP-.js","_app/immutable/chunks/disclose-version.Dr4H93zD.js","_app/immutable/chunks/if.kkdRLLOS.js","_app/immutable/chunks/store.DlVTFeYb.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js'))
		],
		routes: [
			
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
