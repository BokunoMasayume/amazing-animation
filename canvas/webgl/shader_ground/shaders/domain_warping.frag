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

#define OCTAVES 10
float fbm(vec2 st){
	float value =.0;
	float amplitude = .5;
	float frequency = 2.;
    
    

	for(int i=0;i<OCTAVES;i++){
		value += amplitude * g_noise(st*frequency );

		amplitude *=.5;

		frequency *= 2.;
		
	}
	return value;
}

//fbm(st+fbm(st+fbm(st+const)+const))

void main(){
	vec2 st = gl_FragCoord.xy / u_resolution;
	//st.x *= u_resolution.x / u_resolution.y;

	st *= 3.;
	//st+=u_time*.2;

	vec2 one = vec2(1.);
	vec2 two = vec2(1.);
	float three;

	one.x = fbm(st + vec2(1.023,3.5553) );
	one.y = fbm(st + vec2(-3.4432,8.5325) );

	two.x = fbm(st*st + one + vec2(3.5,7.6574) +u_time*.143);
	two.y = fbm(st*st + one + vec2(2.324,4.4535)+u_time*.042);

	three = fbm(st + two );

	//float fb = fbm(st+vec2(u_time*.02,u_time*.011));

	//vec3 color = mix(vec3(0.,204./255.,1.)+g_noise(st*2.)*.08 , vec3(1.),smoothstep(.02,.17,fb));
	//gl_FragColor = vec4(color, 1.);

	gl_FragColor = vec4( vec3(three) ,1.);
}

