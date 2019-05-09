precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;



void main(){
	vec2 st = gl_FragCoord.xy / u_resolution;
	st.x *= u_resolution.x / u_resolution.y;

	st =  -vec2(1.) + st*2.;
	st *= 10.;
	vec2 ip = floor(st);
	vec2 fp = fract(st); 


	gl_FragColor = vec4(vec3(fract(sin(dot(st*fp-ip,vec2(-12.3342,55.767474)+u_mouse))*333.54353)),1.);
	//gl_FragColor = vec4(vec3(fract(sin(dot(ip+u_mouse,vec2(-12.3342,55.767474)))*333.54353)),1.);
	//gl_FragColor = vec4(vec3(fract(sin(dot(fp,vec2(-12.3342,55.767474)+u_mouse))*333.54353)),1.);
	
	

}

