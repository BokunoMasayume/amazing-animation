precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 g_random(vec2 ip){
	return fract(sin(
		vec2(dot(ip,vec2(127.1,311.7)), dot(ip,vec2(269.5,183.3)))
	)* 44753.976967)*2.-1. ;
}

float g_noise(vec2 st){
	vec2 ip = floor(st);
	vec2 fp = fract(st);

	//vec2 u = fp*fp*(3.-2.*fp);
	vec2 u = fp*fp*fp*(fp*(fp*6.-15.)+10.);
	return mix(
		mix(dot(g_random(ip) , fp-vec2(0.,0.)) , dot(g_random(ip+vec2(1.,0.)) , fp-vec2(1.,0.)) ,u.x),
		mix(dot(g_random(ip+vec2(0.,1.)) , fp-vec2(0.,1.)) , dot(g_random(ip+vec2(1.,1.)) ,fp-vec2(1.,1.)) , u.x),
		u.y
	);
}

#define OCTAVES 5

float fbm(vec2 st){
	float fre = 1.;
	float amp = 1.;

	float value = 0.;

	st *= .05;

	for(int i=0;i<OCTAVES;i++){
		value += amp * g_noise(st* fre) ;
		fre *= 2.;
		amp *= .5;
	}

	return value;	
}

//sphere
float sdf(vec3 st , float r){
	
	return length(st) - r;
}


//ray marching
void main(){
	vec3 st = vec3(gl_FragCoord.xy / u_resolution, .5);
	//st.x *= u_resolution.x / u_resolution.y;


	st = st*2. - 1.;
	vec3 eye = vec3(0.,0.,0.);
	vec3 d = st - eye;

	float r = .4;

	for(int i=0 ;i<100;i++){
		float l = sdf(st , r);
		gl_FragColor = vec4( vec3(1.) , 1.);
		if(l < 0.){
			gl_FragColor = vec4( vec3(1.,0.,0.) , 1.);
			break;
		}

		st += normalize(d)*l;
	}


}

	

	



