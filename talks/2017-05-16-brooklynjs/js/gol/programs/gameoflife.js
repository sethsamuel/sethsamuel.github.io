import identity from './identity2d';

const GameOfLife = {
	vertexSource: identity.vertexSource,

	fragmentSource: `#version 300 es
		precision highp float;
		uniform sampler2D uSampler;
		in vec2 vTexturePosition;
		in vec2 vPosition;
		uniform vec2 uMousePosition;
		uniform highp float uWidth;
		uniform int uShouldUpdate;
		out vec4 fragmentColor;

		bool isLive(vec2 offset) {
				vec4 lastColor = texture(uSampler, vTexturePosition + offset);
				if (lastColor.r == 1.0) {
					return true;
				} else {
					return false;
				}
		}

		void main(void) {
			vec4 lastColor = texture(uSampler, vTexturePosition);

			if (uShouldUpdate == 0) {
				fragmentColor = lastColor;
				return;
			}

			float d = distance(uMousePosition, vPosition);
			if (d < 50.0/uWidth) {
				fragmentColor = vec4(1.0, 0, 0, 1.0);
				return;
			}

			int liveCount = 0;
			float step = 1.0/uWidth;

			if (isLive(vec2(-step, -step))) {liveCount++;}
			if (isLive(vec2(-step, 0))) {liveCount++;}
			if (isLive(vec2(-step, step))) {liveCount++;}
			if (isLive(vec2(0, -step))) {liveCount++;}
			if (isLive(vec2(0, step))) {liveCount++;}
			if (isLive(vec2(step, -step))) {liveCount++;}
			if (isLive(vec2(step, 0))) {liveCount++;}
			if (isLive(vec2(step, step))) {liveCount++;}

			// if (liveCount < 2) {
			// 	fragmentColor = vec4(1.0, 0, 0, 1.0);
			// } else if (liveCount < 4) {
			// 	fragmentColor = vec4(0, 1.0, 0, 1.0);
			// } else if (liveCount < 8) {
			// 	fragmentColor = vec4(0, 0, 1.0, 1.0);
			// } else {
			// 	fragmentColor = vec4(1.0, 0, 1.0, 1.0);
			// }

			bool selfIsLive = isLive(vec2(0,0));
			if (selfIsLive && (liveCount == 2 || liveCount == 3)) {
				if (lastColor.g < 1.0) {
					fragmentColor = lastColor + vec4(1.0, 0.01, 0.0, 1.0);
				} else {
					fragmentColor = lastColor + vec4(1.0, 0.0, 0.01, 1.0);
				}
			} else if (!selfIsLive && (liveCount == 3)) {
				fragmentColor = vec4(1.0, 0, 0, 1.0);
			} else {
				fragmentColor = vec4(0.0, 0.0, 0.0, 0.8);
			}
		}
	`
};
export default GameOfLife;
