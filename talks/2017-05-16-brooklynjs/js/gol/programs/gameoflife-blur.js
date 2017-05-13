import identity from './identity2d';

const GameOfLifeBlur = {
	vertexSource: identity.vertexSource,

	fragmentSource: `#version 300 es
		precision highp float;
		uniform sampler2D uSampler;
		in vec2 vTexturePosition;
		in vec2 vPosition;
		out vec4 fragmentColor;

		bool isLive(vec2 offset) {
				vec4 stateColor = texture(uSampler, vTexturePosition + offset);
				if (stateColor.r == 1.0) {
					return true;
				} else {
					return false;
				}
		}

		bool radiusIsLive(int radius) {
			ivec2 size = textureSize(uSampler, 0);
			float stepX = 1.0/float(size.x);
			float stepY = 1.0/float(size.y);
			int side = 2*radius + 1;


			for (int x = 0; x < side; x++) {
				for (int y = 0; y < side; y++) {
					if (isLive(vec2(stepX * float(-radius + x), stepY * float(-radius + y)))) {
						return true;
					}
				}
			}
			return false;
			//Top
			for (int i = 0; i < side; i++) {
				if (isLive(vec2(stepX * float(-radius + i), stepY * float(-radius)))) {
						return true;
				}
			}

			//Left
			for (int i = 0; i < side; i++) {
				if (isLive(vec2(stepX * float(-radius), - stepY * float(-radius + i)))) {
						return true;
				}
			}

			//Right
			for (int i = 0; i < side; i++) {
				if (isLive(vec2(stepX * float(radius), - stepY * float(-radius + i)))) {
						return true;
				}
			}

			//Bottom
			for (int i = 0; i < side; i++) {
				if (isLive(vec2(stepX * float(-radius + i), stepY * float(radius)))) {
						return true;
				}
			}

			return false;

		}

		void main(void) {
			// fragmentColor = texture(uSampler, vTexturePosition);
			// return;

			ivec2 size = textureSize(uSampler, 0);
			float stepX = 1.0/float(size.x);
			float stepY = 1.0/float(size.y);
			if (radiusIsLive(5)) {
					fragmentColor = vec4(1.0, 1.0, 1.0, 1.0);
					return;
			} else {
				fragmentColor = vec4(0.0, 0.0, 0.0, 1.0);
				return;
			}
			// fragmentColor = (
			// 	texture(uSampler, vTexturePosition) +
			// 	texture(uSampler, vTexturePosition - vec2(stepX, stepY)) +
			// 	texture(uSampler, vTexturePosition - vec2(-stepX, stepY)) +
			// 	texture(uSampler, vTexturePosition - vec2(stepX, -stepY)) +
			// 	texture(uSampler, vTexturePosition - vec2(-stepX, -stepY))
			// )/5.0;
		}
	`
};

export default GameOfLifeBlur;
