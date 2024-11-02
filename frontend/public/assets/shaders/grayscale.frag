precision mediump float;

varying vec2 outTexCoord;
uniform sampler2D uMainSampler;

void main(void) {
    vec4 color = texture2D(uMainSampler, outTexCoord);
    float gray = (color.r + color.g + color.b) / 3.0;
    gl_FragColor = vec4(vec3(gray), color.a);
}

