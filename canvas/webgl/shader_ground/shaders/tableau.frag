precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


void main(){
	vec2 st = gl_FragCoord.xy/u_resolution;

	float x1 = 1.-(step(.29,st.x) - step(.31,st.x));
	float x2 = 1. - step(.75,st.x) + step(.77,st.x);
	float x3 = 1. - step(.89,st.x) + step(.91,st.x);
	float x4 = 1. - (step(.08,st.x) - step(.10,st.x))*step(.8,st.y);

	float y1 = 1. - step(.89,st.y) + step(.91,st.y);
	float y2 = 1. - step(.79 , st.y)+ step(.81,st.y);
	float y3 = 1. - (step(.08,st.y)-step(.1,st.y))*step(.3,st.x);

	float red = (1.- step(.29,st.x))*(step(.81 ,st.y)); 
	float blue = step(.77 , st.x)*(1. - step(.08,st.y));
	float yellow = step(.91,st.x)*step(.81,st.y);

	gl_FragColor = vec4(x1*x2*x3*x4*y1*y2*y3*vec3(1.,1.,1.) 
						+ red*vec3(.0,-1.,-1.)
						+ blue*vec3(-1.,-1.,0.)
						+ yellow*vec3(0.,0.,-1.),1.);

}