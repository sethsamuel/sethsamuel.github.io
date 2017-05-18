!function(t){function e(n){if(r[n])return r[n].exports;var o=r[n]={exports:{},id:n,loaded:!1};return t[n].call(o.exports,o,o.exports,e),o.loaded=!0,o.exports}var r={};return e.m=t,e.c=r,e.p="",e(0)}([function(t,e,r){t.exports=r(12)},function(t,e){"use strict";function r(t,e){function r(){var t=2*Math.pow(2,Math.floor(Math.log2(Math.min(window.innerWidth,window.innerHeight))))*n;o.width=t,o.height=t,o.style.width=t/2+"px",o.style.height=t/2+"px",i.viewport(0,0,o.width,o.height)}var n=arguments.length<=2||void 0===arguments[2]?1:arguments[2],o=(document.body,document.querySelector("canvas")),i=o.getContext("webgl2");r(),window.addEventListener("resize",r),i.clearColor(0,0,0,1),i.clear(i.COLOR_BUFFER_BIT);var a=i.createShader(i.VERTEX_SHADER);if(i.shaderSource(a,t),i.compileShader(a),!i.getShaderParameter(a,i.COMPILE_STATUS))throw new Error("An error occurred compiling the shader: "+i.getShaderInfoLog(a));console.log("Vertex shader compiled");var u=i.createShader(i.FRAGMENT_SHADER);if(i.shaderSource(u,e),i.compileShader(u),!i.getShaderParameter(u,i.COMPILE_STATUS))throw new Error("An error occurred compiling the shader: "+i.getShaderInfoLog(u));console.log("Fragment shader compiled");var s=i.createProgram();if(i.attachShader(s,a),i.attachShader(s,u),i.linkProgram(s),!i.getProgramParameter(s,i.LINK_STATUS))throw new Error("Unable to initialize the shader program.");return console.log("Initialized shader program"),i.useProgram(s),{gl:i,shaderProgram:s}}function n(){var t=document.querySelector("canvas").getContext("webgl2"),e=t.createTexture();return t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,e),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.REPEAT),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.REPEAT),t.bindTexture(t.TEXTURE_2D,null),e}Object.defineProperty(e,"__esModule",{value:!0}),e.createProgram=r,e.createTexture=n},function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var r={vertexSource:"#version 300 es\n\t\tprecision highp float;\n\t\tin vec3 aPosition;\n\t\tout vec2 vTexturePosition;\n\t\tout vec2 vPosition;\n\t\tvoid main(void) {\n\t\t\tvPosition = aPosition.xy;\n\t\t\tvTexturePosition = vec2(aPosition.x + 1.0, -1.0 + aPosition.y) * 0.5;\n\t\t\tgl_Position = vec4(aPosition, 1.0);\n\t\t}\n\t",fragmentSource:"#version 300 es\n\t\tprecision highp float;\n\t\tuniform sampler2D uSampler;\n\t\tuniform float uScale;\n\t\tin vec2 vTexturePosition;\n\t\tin vec2 vPosition;\n\t\tout vec4 fragmentColor;\n\n\t\tvoid main(void) {\n\t\t\tfragmentColor = texture(uSampler, vTexturePosition/uScale);\n\t\t}\n\t"};e["default"]=r},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(1),a=function(){function t(e){var r=e.shaderSource,o=e.scale,a=void 0===o?1:o;n(this,t);var u=(0,i.createProgram)(r.vertexSource,r.fragmentSource,a),s=u.gl,f=u.shaderProgram;this.gl=s,this.shaderProgram=f,this.currentState=0,this.vertexBuffer=s.createBuffer(),s.bindBuffer(s.ARRAY_BUFFER,this.vertexBuffer),this.vertices=[1,1,0,-1,1,0,1,-1,0,-1,-1,0],s.bufferData(s.ARRAY_BUFFER,new Float32Array(this.vertices),s.STATIC_DRAW);var c=s.getAttribLocation(f,"aPosition");s.enableVertexAttribArray(c),s.vertexAttribPointer(c,3,s.FLOAT,!1,0,0);var l=s.getUniformLocation(f,"uWidth");s.uniform1f(l,s.canvas.width)}return o(t,[{key:"draw",value:function(t){var e=arguments.length<=1||void 0===arguments[1]?function(){}:arguments[1],r=this.gl;r.useProgram(this.shaderProgram);var n=r.getUniformLocation(this.shaderProgram,"uScale");r.uniform1f(n,1),e(),r.bindTexture(r.TEXTURE_2D,t),r.bindBuffer(r.ARRAY_BUFFER,this.vertexBuffer),r.drawArrays(r.TRIANGLE_STRIP,0,this.vertices.length/3),r.bindBuffer(r.ARRAY_BUFFER,null),r.bindTexture(r.TEXTURE_2D,null)}}]),t}();e["default"]=a},function(t,e,r){"use strict";function n(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}Object.defineProperty(e,"__esModule",{value:!0});var o=function(){function t(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(e,r,n){return r&&t(e.prototype,r),n&&t(e,n),e}}(),i=r(1),a=function(){function t(e){var r=e.shaderSource,o=e.scale,a=void 0===o?1:o;n(this,t);var u=(0,i.createProgram)(r.vertexSource,r.fragmentSource,a),s=u.gl,f=u.shaderProgram;this.gl=s,this.shaderProgram=f,this.currentState=0,this.vertexBuffer=s.createBuffer(),s.bindBuffer(s.ARRAY_BUFFER,this.vertexBuffer),this.vertices=[1,1,0,-1,1,0,1,-1,0,-1,-1,0],s.bufferData(s.ARRAY_BUFFER,new Float32Array(this.vertices),s.STATIC_DRAW);var c=s.getAttribLocation(f,"aPosition");s.enableVertexAttribArray(c),s.vertexAttribPointer(c,3,s.FLOAT,!1,0,0);var l=s.getUniformLocation(f,"uWidth");s.uniform1f(l,s.canvas.width),this.uShouldUpdate=s.getUniformLocation(f,"uShouldUpdate"),this.tTexture0=(0,i.createTexture)(),this.tTexture1=(0,i.createTexture)(),this.frameBuffer=s.createFramebuffer(),s.bindFramebuffer(s.FRAMEBUFFER,this.frameBuffer),this.frameBuffer.width=s.canvas.width,this.frameBuffer.height=s.canvas.height,s.bindTexture(s.TEXTURE_2D,this.tTexture1),s.texImage2D(s.TEXTURE_2D,0,s.RGBA,this.frameBuffer.width,this.frameBuffer.height,0,s.RGBA,s.UNSIGNED_BYTE,null);var d=s.createRenderbuffer();s.bindRenderbuffer(s.RENDERBUFFER,d),s.renderbufferStorage(s.RENDERBUFFER,s.DEPTH_COMPONENT16,this.frameBuffer.width,this.frameBuffer.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.RENDERBUFFER,d),s.bindRenderbuffer(s.RENDERBUFFER,null),s.bindFramebuffer(s.FRAMEBUFFER,null)}return o(t,[{key:"setState",value:function(t){var e=this.gl;e.bindTexture(e.TEXTURE_2D,this.tTexture0),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,t),e.bindTexture(e.TEXTURE_2D,null)}},{key:"drawState",value:function(){var t=this.gl;t.useProgram(this.shaderProgram),t.uniform1i(this.uShouldUpdate,0),t.bindFramebuffer(t.FRAMEBUFFER,null),0==this.currentState?t.bindTexture(t.TEXTURE_2D,this.tTexture0):t.bindTexture(t.TEXTURE_2D,this.tTexture1),t.bindBuffer(t.ARRAY_BUFFER,this.vertexBuffer),t.drawArrays(t.TRIANGLE_STRIP,0,this.vertices.length/3),t.bindBuffer(t.ARRAY_BUFFER,null)}},{key:"incrementState",value:function(){var t=arguments.length<=0||void 0===arguments[0]?{}:arguments[0],e=t.mousePosition,r=this.gl;r.useProgram(this.shaderProgram),r.uniform1i(this.uShouldUpdate,1);var n=r.getUniformLocation(this.shaderProgram,"uMousePosition");e&&2==e.length?r.uniform2f(n,e[0],e[1]):r.uniform2f(n,-10,-10),r.bindFramebuffer(r.FRAMEBUFFER,this.frameBuffer),0==this.currentState?(r.bindTexture(r.TEXTURE_2D,this.tTexture0),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,this.tTexture1,0)):(r.bindTexture(r.TEXTURE_2D,this.tTexture1),r.framebufferTexture2D(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,this.tTexture0,0)),r.bindBuffer(r.ARRAY_BUFFER,this.vertexBuffer),r.drawArrays(r.TRIANGLE_STRIP,0,this.vertices.length/3),r.bindBuffer(r.ARRAY_BUFFER,null),r.bindTexture(r.TEXTURE_2D,null),r.bindFramebuffer(r.FRAMEBUFFER,null),this.currentState=(this.currentState+1)%2}},{key:"stateTexture",value:function(){return 0==this.currentState?this.tTexture0:this.tTexture1}}]),t}();e["default"]=a},,,,,,,,function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}function o(){E.draw(T.stateTexture()),b||(T.incrementState(),requestAnimationFrame(o))}var i=(r(1),r(4)),a=n(i),u=r(3),s=n(u),f=r(17),c=n(f),l=r(2),d=n(l);console.log("🐭");var h=document.createElement("canvas");document.body.appendChild(h);var v=h.getContext("webgl2"),T=new a["default"]({shaderSource:c["default"]}),E=new s["default"]({shaderSource:d["default"]});v.clearColor(0,0,0,1),v.clear(v.COLOR_BUFFER_BIT);var m=[];console.time("Init");for(var R=0;R<v.canvas.width;R++)for(var g=0;g<v.canvas.height;g++){var A=Math.random();A<.33?(m[4*(g*v.canvas.width+R)]=255,m[4*(g*v.canvas.width+R)+1]=0,m[4*(g*v.canvas.width+R)+2]=0,m[4*(g*v.canvas.width+R)+3]=255):A<.66?(m[4*(g*v.canvas.width+R)]=0,m[4*(g*v.canvas.width+R)+1]=255,m[4*(g*v.canvas.width+R)+2]=0,m[4*(g*v.canvas.width+R)+3]=255):(m[4*(g*v.canvas.width+R)]=0,m[4*(g*v.canvas.width+R)+1]=0,m[4*(g*v.canvas.width+R)+2]=255,m[4*(g*v.canvas.width+R)+3]=255)}T.setState(new ImageData(new Uint8ClampedArray(m),v.canvas.width,v.canvas.height)),console.timeEnd("Init");var b=!0;requestAnimationFrame(o),v.canvas.addEventListener("click",function(t){T.incrementState(),o()}),document.addEventListener("keypress",function(t){console.log(t),"p"==t.key&&(b=!b),o()})},,,,,function(t,e,r){"use strict";function n(t){return t&&t.__esModule?t:{"default":t}}Object.defineProperty(e,"__esModule",{value:!0});var o=r(2),i=n(o),a={vertexSource:i["default"].vertexSource,fragmentSource:"#version 300 es\n\t\tprecision highp float;\n\t\tuniform sampler2D uSampler;\n\t\tin vec2 vTexturePosition;\n\t\tin vec2 vPosition;\n\t\tuniform vec2 uMousePosition;\n\t\tuniform highp float uWidth;\n\t\tuniform int uShouldUpdate;\n\t\tout vec4 fragmentColor;\n\n\t\tvec4 colorAtOffset(vec2 offset) {\n\t\t\treturn texture(uSampler, vTexturePosition + offset);\n\t\t}\n\n\t\tbool isLive(vec2 offset) {\n\t\t\t\tvec4 lastColor = colorAtOffset(offset);\n\t\t\t\tif (lastColor.r == 1.0) {\n\t\t\t\t\treturn true;\n\t\t\t\t} else {\n\t\t\t\t\treturn false;\n\t\t\t\t}\n\t\t}\n\n\t\tvoid main(void) {\n\t\t\tvec4 lastColor = texture(uSampler, vTexturePosition);\n\n\t\t\tif (uShouldUpdate == 0) {\n\t\t\t\tfragmentColor = lastColor;\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tfloat d = distance(uMousePosition, vPosition);\n\t\t\tif (d < 50.0/uWidth) {\n\t\t\t\tfragmentColor = vec4(1.0, 0, 0, 1.0);\n\t\t\t\treturn;\n\t\t\t}\n\n\t\t\tint rCount = 0;\n\t\t\tint gCount = 0;\n\t\t\tint bCount = 0;\n\n\t\t\tfloat step = 1.0/uWidth;\n\n\t\t\tfragmentColor = vec4(0.0, 0.0, 0.0, 1.0);\n\n\t\t\tvec4 colors[9] = vec4[](\n\t\t\t\tcolorAtOffset(vec2(0, 0)),\n\t\t\t\tcolorAtOffset(vec2(-step, -step)),\n\t\t\t\tcolorAtOffset(vec2(step, -step)),\n\t\t\t\tcolorAtOffset(vec2(-step, step)),\n\t\t\t\tcolorAtOffset(vec2(step, step)),\n\t\t\t\tcolorAtOffset(vec2(-step, 0)),\n\t\t\t\tcolorAtOffset(vec2(step, 0)),\n\t\t\t\tcolorAtOffset(vec2(0, -step)),\n\t\t\t\tcolorAtOffset(vec2(0, step))\n\t\t\t);\n\t\t\tfor (int i = 0; i <= 9; i++) {\n\t\t\t\tif (colors[i].r == 1.0) {\n\t\t\t\t\trCount++;\n\t\t\t\t}\n\t\t\t\tif (colors[i].g == 1.0) {\n\t\t\t\t\tgCount++;\n\t\t\t\t}\n\t\t\t\tif (colors[i].b == 1.0) {\n\t\t\t\t\tbCount++;\n\t\t\t\t}\n\t\t\t}\n\n\t\t\tif (rCount >= gCount && rCount >= bCount) {\n\t\t\t\tfragmentColor.r = 1.0;\n\t\t\t} else {\n\t\t\t\tfragmentColor.r = 0.0;\n\t\t\t}\n\n\t\t\tif (gCount >= rCount && gCount >= bCount) {\n\t\t\t\tfragmentColor.g = 1.0;\n\t\t\t} else {\n\t\t\t\tfragmentColor.g = 0.0;\n\t\t\t}\n\n\t\t\tif (bCount >= gCount && bCount >= rCount) {\n\t\t\t\tfragmentColor.b = 1.0;\n\t\t\t} else {\n\t\t\t\tfragmentColor.b = 0.0;\n\t\t\t}\n\n\t\t}\n\t"};e["default"]=a}]);
//# sourceMappingURL=gol-colorvote.js.map