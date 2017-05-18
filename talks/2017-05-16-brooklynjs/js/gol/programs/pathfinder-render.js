const PathFinderRender = {
	vertexSource: `#version 300 es
		precision highp float;
		in vec3 aPosition;
		out vec2 vTexturePosition;
		out vec2 vPosition;
		void main(void) {
			vPosition = aPosition.xy;
			vTexturePosition = vec2(aPosition.x + 1.0, -1.0 + aPosition.y) * 0.5;
			gl_Position = vec4(aPosition, 1.0);
		}
	`,
	fragmentSource: `#version 300 es
		precision highp float;
		uniform sampler2D uSampler;
		uniform float uScale;
		in vec2 vTexturePosition;
		in vec2 vPosition;
		out vec4 fragmentColor;

		void main(void) {
      vec4 data = texture(uSampler, vTexturePosition/uScale);
      fragmentColor = vec4(0,0,0,0);
      if (length(data) > 0.0) {
        fragmentColor.r = 1.0;
				fragmentColor.a = 1.0;
      }
      // if (data.g > 0.0) {
      //   fragmentColor.g = 1.0;
			// 	fragmentColor.a = 1.0;
      // }
      // if (data.b > 0.0) {
      //   fragmentColor.b = 0.5;
			// 	fragmentColor.a = 1.0;
      // }
      // if (data.a > 0.0) {
      //   fragmentColor.b += 0.5;
			// 	fragmentColor.a = 1.0;
      // }
			// fragmentColor = data;
		}
	`
};

export default PathFinderRender;
