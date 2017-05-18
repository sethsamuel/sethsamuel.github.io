const Mandelbrot = {
	vertexSource: `#version 300 es
		precision highp float;
		in vec3 aPosition;
		out vec2 vTexturePosition;
		out vec2 vPosition;
		void main(void) {
			vPosition = aPosition.xy;
			vTexturePosition = vec2(aPosition.x + 1.0, (1.0 + aPosition.y)) * 0.5;
			gl_Position = vec4(aPosition, 1.0);
		}
	`,
	fragmentSource: `#version 300 es
		precision highp float;
		uniform sampler2D uSampler;
		uniform float uScale;
    uniform int uIteration;
		in vec2 vTexturePosition;
		in vec2 vPosition;
		out vec4 fragmentColor;

		void main(void) {
			if (texture(uSampler, vTexturePosition).z > 0.0) {
				fragmentColor = vec4(0,0,texture(uSampler, vTexturePosition).z,1.0);
				return;
			} else if (uIteration > 1000) {
				fragmentColor = vec4(0,0,0,1.0);
				fragmentColor = vec4(texture(uSampler, vTexturePosition).xyz, 1.0);
				return;
			}

			// x0 = scaled x coordinate of pixel (scaled to lie in the Mandelbrot X scale (-2.5, 1))
			float x0 = vTexturePosition.x * 3.5 - 2.5;
      //  y0 = scaled y coordinate of pixel (scaled to lie in the Mandelbrot Y scale (-1, 1))
			float y0 = vTexturePosition.y * 2.0 - 1.0;
      //  x = 0.0
      //  y = 0.0
      //  iteration = 0
      //  max_iteration = 1000
			float x = (texture(uSampler, vTexturePosition).x) * 3.5 - 2.5;
			float y = (texture(uSampler, vTexturePosition).y) * 2.0 - 1.0;
			if (uIteration == 0) {
				x = 0.0;
				y = 0.0;
			}
			//  while (x*x + y*y < 2*2  AND  iteration < max_iteration) {
      //    xtemp = x*x - y*y + x0
      //    y = 2*x*y + y0
      //    x = xtemp
      //    iteration = iteration + 1
      //  }
			if (x*x + y*y >= 1.0) {
				fragmentColor = vec4(0,0,float(uIteration)/255.0,1.0);
			} else {
				float xTemp = x*x - y*y + x0;
				y = 2.0*x*y + y0;
				x = xTemp;
				fragmentColor = vec4((x + 2.5)/3.5, (y + 1.0)/2.0, 0, 1.0);
			}
		}
	`
};

export default Mandelbrot;
