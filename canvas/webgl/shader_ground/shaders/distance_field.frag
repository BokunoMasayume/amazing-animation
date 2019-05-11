precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;


void main(){
	vec2 st = gl_FragCoord.xy / u_resolution;
	//st.x *= u_resolution.x / u_resolution.y;

	vec2 points[5];
	points[0] = vec2(0.1,0.33);
	points[1] = vec2(0.9,0.22);
	points[2] = vec2(.35,.6);
	points[3] = vec2(.199,.76);
	points[4] = (u_mouse+1.)/2.;

	float m_dist = 10.;

	for(int i=0 ; i<5 ; i++){
		float dist  = distance(st , points[i]);

		m_dist = min(m_dist ,dist);
	}

	vec3 color = vec3(m_dist);

	gl_FragColor = vec4(color , 1.);
	

}

