precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

vec2 g_random(vec2 ip){
	return fract(sin(
		vec2(dot(ip,vec2(127.1,311.7)), dot(ip,vec2(269.5,183.3)))
	)* 44753.976967) ;
}

float dist(vec2 st){
	vec2 ip = floor(st);
	vec2 fp = fract(st);

	//vec2 fea = g_random(ip);

	float m_dist = 10.;

	for(int i=-1;i<2;i++){
		for(int j=-1;j<2;j++){
			vec2 ran = g_random(ip+vec2(float(i),float(j)));
			m_dist = min(m_dist , 
			distance(
				fp , 
				.5+.5*sin(TWO_PI*ran+u_time)+  vec2(float(i),float(j)) )

			);
		}
	}

	vec2 m = (u_mouse+1.)*2.;
	m_dist = min(m_dist,distance(st,m));

	return m_dist;
}

void main(){
	vec2 st = gl_FragCoord.xy / u_resolution;
	//st.x *= u_resolution.x / u_resolution.y;

	st *= 4.;

	gl_FragColor = vec4(vec3(dist(st)), 1.);

}

