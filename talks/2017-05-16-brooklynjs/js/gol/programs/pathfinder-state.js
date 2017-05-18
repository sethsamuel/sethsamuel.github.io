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
		uniform float uWidth;
		in vec2 vTexturePosition;
		in vec2 vPosition;
		out vec4 fragmentColor;

		void main(void) {
			float step = 1.0/uWidth;
			vec4 self = texture(uSampler, vTexturePosition + vec2(0, 0));
			vec4 top = texture(uSampler, vTexturePosition + vec2(0, -step));
			vec4 left = texture(uSampler, vTexturePosition + vec2(step, 0));
			vec4 right = texture(uSampler, vTexturePosition + vec2(-step, 0));
			vec4 bottom = texture(uSampler, vTexturePosition + vec2(0, step));

			//Check if self will move and clear if so
		}
	`
};

export default PathFinderRender;
