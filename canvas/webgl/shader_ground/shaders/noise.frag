precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float random(vec2 ip){
	return fract(sin( dot(ip,vec2(12.44324,543.13032)) )*4324.432424);
}

float noise(vec2 st){
	vec2 ip = floor(st);
	vec2 fp = fract(st);

	float a = random(ip);
	float b = random(ip + vec2(1.,0.));
	float c = random(ip + vec2(0.,1.));
	float d = random(ip + vec2(1.,1.));
	
	vec2 u = fp* fp * (3.-2.*fp);

	return mix(a,b,u.x)+
			(c-a)*u.y*(1.-u.x)+
			(d-b)*u.x*u.y;

}

vec2 g_random(vec2 ip){
	return fract(sin(
		vec2(dot(ip,vec2(127.1,311.7)), dot(ip,vec2(269.5,183.3)))
	)* 44753.976967) *2. - 1.;
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

float rect(vec2 st){
	vec2 p = -vec2(1.) + fract(st)*2.;
	float angle = atan(p.x,p.y) + TWO_PI /2.;
	float len = length(p);

	float perAng = TWO_PI / 4.;
	return cos(floor(.5 +angle /perAng)*perAng - angle)*len;
}

void main(){
	vec2 st = gl_FragCoord.xy / u_resolution;
	//st.x *= u_resolution.x / u_resolution.y;

	vec2 copy = st;
	st *= vec2(3.,1.);
	
	//copy *= vec2(40.,12.);
	//copy*=(u_mouse+1.)*u_time;
	copy *= vec2(40.,2.4);
	float color = rect(st);

	copy += g_noise(copy*20.);

	color += (g_noise(copy)-.5)*.19;

	//gl_FragColor = vec4(vec3(1.)*step(.7,color), 1.);
	gl_FragColor = vec4(mix(vec3(.8,0.,0.),vec3(.2,.1,0.03)+(g_noise(st*90.)-.5)*.06 , smoothstep(.65,.7,color)) ,1.);
	

}

