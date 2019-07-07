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

float sdf(vec3 st){
	float l = fbm(st.xz);
	return l+st.y*.002;
}


//ray marching
void main(){
	vec3 st = vec3(gl_FragCoord.xy / u_resolution, 1.);
	//st.x *= u_resolution.x / u_resolution.y;
	vec3 d = st-.5;
	//vec3 eye =d + vec3(u_mouse*.5,0.);
	vec3 eye = d+ vec3(0.,-.5,0.);

	st.z = u_time * .2;


	for(float i=1.5;i>.0;i -=.01){
//for i-=.003
		float color = fbm(st.xz) * 1.3;

		float depth = 1.- color + st.y*.03;
		gl_FragColor = vec4(vec3( 1.- smoothstep(.00,.7,color  ) ),1.);
													//color*i

		if(depth <0.0)
		{

			break;
		}
//		else{
//			gl_FragColor = vec4(1.);
//		}

//st+= normalize(eye)*.15;
		st += normalize(eye)*depth;

	}

	

	

}

