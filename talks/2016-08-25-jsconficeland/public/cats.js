!function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}({0:function(t,e,r){t.exports=r(7)},1:function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var r=this[e];r[2]?t.push("@media "+r[2]+"{"+r[1]+"}"):t.push(r[1])}return t.join("")},t.i=function(e,r){"string"==typeof e&&(e=[[null,e,""]]);for(var n={},o=0;o<this.length;o++){var i=this[o][0];"number"==typeof i&&(n[i]=!0)}for(o=0;o<e.length;o++){var a=e[o];"number"==typeof a[0]&&n[a[0]]||(r&&!a[2]?a[2]=r:r&&(a[2]="("+a[2]+") and ("+r+")"),t.push(a))}},t}},2:function(t,e,r){function n(t,e){for(var r=0;r<t.length;r++){var n=t[r],o=p[n.id];if(o){o.refs++;for(var i=0;i<o.parts.length;i++)o.parts[i](n.parts[i]);for(;i<n.parts.length;i++)o.parts.push(u(n.parts[i],e))}else{for(var a=[],i=0;i<n.parts.length;i++)a.push(u(n.parts[i],e));p[n.id]={id:n.id,refs:1,parts:a}}}}function o(t){for(var e=[],r={},n=0;n<t.length;n++){var o=t[n],i=o[0],a=o[1],c=o[2],s=o[3],u={css:a,media:c,sourceMap:s};r[i]?r[i].parts.push(u):e.push(r[i]={id:i,parts:[u]})}return e}function i(t,e){var r=g(),n=T[T.length-1];if("top"===t.insertAt)n?n.nextSibling?r.insertBefore(e,n.nextSibling):r.appendChild(e):r.insertBefore(e,r.firstChild),T.push(e);else{if("bottom"!==t.insertAt)throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");r.appendChild(e)}}function a(t){t.parentNode.removeChild(t);var e=T.indexOf(t);e>=0&&T.splice(e,1)}function c(t){var e=document.createElement("style");return e.type="text/css",i(t,e),e}function s(t){var e=document.createElement("link");return e.rel="stylesheet",i(t,e),e}function u(t,e){var r,n,o;if(e.singleton){var i=E++;r=m||(m=c(e)),n=l.bind(null,r,i,!1),o=l.bind(null,r,i,!0)}else t.sourceMap&&"function"==typeof URL&&"function"==typeof URL.createObjectURL&&"function"==typeof URL.revokeObjectURL&&"function"==typeof Blob&&"function"==typeof btoa?(r=s(e),n=d.bind(null,r),o=function(){a(r),r.href&&URL.revokeObjectURL(r.href)}):(r=c(e),n=f.bind(null,r),o=function(){a(r)});return n(t),function(e){if(e){if(e.css===t.css&&e.media===t.media&&e.sourceMap===t.sourceMap)return;n(t=e)}else o()}}function l(t,e,r,n){var o=r?"":n.css;if(t.styleSheet)t.styleSheet.cssText=x(e,o);else{var i=document.createTextNode(o),a=t.childNodes;a[e]&&t.removeChild(a[e]),a.length?t.insertBefore(i,a[e]):t.appendChild(i)}}function f(t,e){var r=e.css,n=e.media;if(n&&t.setAttribute("media",n),t.styleSheet)t.styleSheet.cssText=r;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(r))}}function d(t,e){var r=e.css,n=e.sourceMap;n&&(r+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(n))))+" */");var o=new Blob([r],{type:"text/css"}),i=t.href;t.href=URL.createObjectURL(o),i&&URL.revokeObjectURL(i)}var p={},h=function(t){var e;return function(){return"undefined"==typeof e&&(e=t.apply(this,arguments)),e}},v=h(function(){return/msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase())}),g=h(function(){return document.head||document.getElementsByTagName("head")[0]}),m=null,E=0,T=[];t.exports=function(t,e){e=e||{},"undefined"==typeof e.singleton&&(e.singleton=v()),"undefined"==typeof e.insertAt&&(e.insertAt="bottom");var r=o(t);return n(r,e),function(t){for(var i=[],a=0;a<r.length;a++){var c=r[a],s=p[c.id];s.refs--,i.push(s)}if(t){var u=o(t);n(u,e)}for(var a=0;a<i.length;a++){var s=i[a];if(0===s.refs){for(var l=0;l<s.parts.length;l++)s.parts[l]();delete p[s.id]}}}};var x=function(){var t=[];return function(e,r){return t[e]=r,t.filter(Boolean).join("\n")}}()},3:function(t,e,r){e=t.exports=r(1)(),e.push([t.id,"body,html{padding:0;margin:0}.highlight{background-color:rgba(200,255,0,.5)}",""])},4:function(t,e,r){var n=r(3);"string"==typeof n&&(n=[[t.id,n,""]]);r(2)(n,{});n.locals&&(t.exports=n.locals)},7:function(t,e,r){"use strict";function n(t){var e,r,n,o,i,a=t[0]/255,c=t[1]/255,s=t[2]/255,u=Math.max(a,c,s),l=u-Math.min(a,c,s),f=function(t){return(u-t)/6/l+.5};return 0==l?o=i=0:(i=l/u,e=f(a),r=f(c),n=f(s),a===u?o=n-r:c===u?o=1/3+e-n:s===u&&(o=2/3+r-e),o<0?o+=1:o>1&&(o-=1)),[Math.round(360*o),Math.round(100*i),Math.round(100*u)]}r(4),r(186),console.log("CATS"),!function(){var t=function m(){s.clear(s.COLOR_BUFFER_BIT|s.DEPTH_BUFFER_BIT),s.bindBuffer(s.ARRAY_BUFFER,u),s.uniform1f(p,parseFloat(v.value)),s.uniform1f(d,performance.now()-g),s.vertexAttribPointer(l,3,s.FLOAT,!1,0,0),s.activeTexture(s.TEXTURE0),s.bindTexture(s.TEXTURE_2D,h),s.uniform1i(f,0),s.drawArrays(s.TRIANGLE_STRIP,0,4),requestAnimationFrame(m)},e=function(){h=s.createTexture();var e=new Image;e.crossOrigin=!0,e.onload=function(){var r=document.createElement("canvas");r.width=e.width,r.height=e.height;var o=r.getContext("2d");o.drawImage(e,0,0);var i=o.getImageData(0,0,r.width,r.height),a=[];console.time("HSV convert");for(var c=0;c<i.data.length;c+=4){var u=n(i.data.slice(c,c+3));a.push(u[0]),a.push(u[1]),a.push(u[2]),a.push(255)}console.timeEnd("HSV convert");var l=new ImageData(new Uint8ClampedArray(a),i.width,i.height);s.bindTexture(s.TEXTURE_2D,h),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,s.RGBA,s.UNSIGNED_BYTE,l),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),s.bindTexture(s.TEXTURE_2D,null),t()},e.src="../images/cats.png"},r=function(){u=s.createBuffer(),s.bindBuffer(s.ARRAY_BUFFER,u);var t=[1,1,0,-1,1,0,1,-1,0,-1,-1,0];s.bufferData(s.ARRAY_BUFFER,new Float32Array(t),s.STATIC_DRAW)},o=function(){var t=i(),e=a(),r=s.createProgram();s.attachShader(r,e),s.attachShader(r,t),s.linkProgram(r),s.getProgramParameter(r,s.LINK_STATUS)?console.log("Initialized shader program"):console.error("Unable to initialize the shader program."),s.useProgram(r),l=s.getAttribLocation(r,"vPosition"),s.enableVertexAttribArray(l),f=s.getUniformLocation(r,"uSampler"),p=s.getUniformLocation(r,"uSpeed"),d=s.getUniformLocation(r,"uElapsed")},i=function(){var t=s.createShader(s.FRAGMENT_SHADER),e="\n\t\t\tprecision highp float;\n\t\t\tuniform vec3 aColor;\n\t\t\tuniform sampler2D uSampler;\n\t\t\tuniform float uSpeed;\n\t\t\tuniform float uElapsed;\n\t\t\tvarying vec2 vCoord;\n\n\t\t\t//http://lolengine.net/blog/2013/07/27/rgb-to-hsv-in-glsl\n\t\t\tvec3 hsv2rgb(vec3 c) {\n\t\t\t\tvec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);\n\t    \tvec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);\n\t    \treturn c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);\n\t\t\t}\n\n\t\t\tvoid main(void) {\n\t\t\t\tvec4 c = texture2D(uSampler, vCoord);\n\t\t\t\tvec3 shiftedC = vec3(c.x + uElapsed*uSpeed*0.0001, 1.0, 0.9);\n\t\t\t\tgl_FragColor = vec4(hsv2rgb(shiftedC), 1.0);\n\t\t\t}\n\t\t";return s.shaderSource(t,e),s.compileShader(t),s.getShaderParameter(t,s.COMPILE_STATUS)?(console.log("Fragment shader compiled"),t):(console.error("An error occurred compiling the shaders: "+s.getShaderInfoLog(t)),null)},a=function(){var t=s.createShader(s.VERTEX_SHADER),e="\n\t\t\tprecision highp float;\n\t\t\tattribute vec3 vPosition;\n\t\t\tvarying vec2 vCoord;\n\t\t\tvoid main(void) {\n\t\t\t\tvCoord = vec2((vPosition.s+1.0)/2.0, 1.0-(vPosition.t+1.0)/2.0);\n\t\t\t\tgl_Position = vec4(vPosition, 1.0);\n\t\t\t}\n\t\t";return s.shaderSource(t,e),s.compileShader(t),s.getShaderParameter(t,s.COMPILE_STATUS)?(console.log("Vertex shader compiled"),t):(console.error("An error occurred compiling the shaders: "+s.getShaderInfoLog(t)),null)},c=document.querySelector("canvas"),s=c.getContext("webgl"),u=void 0,l=void 0,f=void 0,d=void 0,p=void 0,h=void 0;s.clearColor(0,0,0,1),s.clear(s.COLOR_BUFFER_BIT),s.enable(s.DEPTH_TEST),s.depthFunc(s.LEQUAL);var v=(document.querySelector("img"),document.querySelector("input"));o(),r(),e();var g=performance.now()}()},13:function(t,e,r){e=t.exports=r(1)(),e.push([t.id,"input{width:512px;height:12px;position:absolute;background:#fff;left:15px;top:16px}canvas{margin-left:16px;margin-top:48px}",""])},186:function(t,e,r){var n=r(13);"string"==typeof n&&(n=[[t.id,n,""]]);r(2)(n,{});n.locals&&(t.exports=n.locals)}});
//# sourceMappingURL=cats.js.map