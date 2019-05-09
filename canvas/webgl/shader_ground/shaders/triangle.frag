precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


void main(){
	vec2 st = gl_FragCoord.xy / u_resolution;

	st = vec2(.5) - st;
	int edges = 3;

	float angle = atan(st.y,st.x) + TWO_PI *.5;
	float perAng = TWO_PI / float(edges);

	float thev = cos(mod(angle+u_time , perAng)+5.233) * length(st);

	gl_FragColor = vec4(vec3(1.- step(.1,thev)),1.);

}