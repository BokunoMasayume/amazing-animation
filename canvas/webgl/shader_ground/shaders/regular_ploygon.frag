precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


void main(){
	vec2 st = gl_FragCoord.xy / u_resolution;

	st =  vec2(.5) - st;
	int edges = 3;

	float angle = atan(st.y,st.x) + TWO_PI *.5;
	float perAng = TWO_PI / float(edges);

	//point - edge - point angle change like :perAng/2 degree - 0 degree - perAng/2 degree
	float thev = cos(angle - floor((angle+.5*perAng) / perAng)*perAng) * length(st);

	gl_FragColor = vec4(vec3(1.- step(.2,thev)),1.);

}

//			/\
//		   /  \		
//		  /    \    
//		 /___|__\  
//		 
//		 |:thev,中心点到中心的垂线
//		 length(st):中心到端点的距离
