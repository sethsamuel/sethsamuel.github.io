import identity from './identity2d';

const GameOfLifeColorVote = {
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

		vec4 colorAtOffset(vec2 offset) {
			return texture(uSampler, vTexturePosition + offset);
		}

		bool isLive(vec2 offset) {
				vec4 lastColor = colorAtOffset(offset);
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

			int rCount = 0;
			int gCount = 0;
			int bCount = 0;

			float step = 1.0/uWidth;

			fragmentColor = vec4(0.0, 0.0, 0.0, 1.0);

			vec4 colors[9] = vec4[](
				colorAtOffset(vec2(0, 0)),
				colorAtOffset(vec2(-step, -step)),
				colorAtOffset(vec2(step, -step)),
				colorAtOffset(vec2(-step, step)),
				colorAtOffset(vec2(step, step)),
				colorAtOffset(vec2(-step, 0)),
				colorAtOffset(vec2(step, 0)),
				colorAtOffset(vec2(0, -step)),
				colorAtOffset(vec2(0, step))
			);
			for (int i = 0; i <= 9; i++) {
				if (colors[i].r == 1.0) {
					rCount++;
				}
				if (colors[i].g == 1.0) {
					gCount++;
				}
				if (colors[i].b == 1.0) {
					bCount++;
				}
			}

			if (rCount >= gCount && rCount >= bCount) {
				fragmentColor.r = 1.0;
			} else {
				fragmentColor.r = 0.0;
			}

			if (gCount >= rCount && gCount >= bCount) {
				fragmentColor.g = 1.0;
			} else {
				fragmentColor.g = 0.0;
			}

			if (bCount >= gCount && bCount >= rCount) {
				fragmentColor.b = 1.0;
			} else {
				fragmentColor.b = 0.0;
			}

		}
	`
};
export default GameOfLifeColorVote;
