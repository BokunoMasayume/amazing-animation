precision mediump float;

#define TWO_PI 6.28318530718

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float scan(float angle,float round){
	return smoothstep(mod(u_time,TWO_PI),round +mod(u_time,TWO_PI) ,angle) * (1.-step(round +mod(u_time,TWO_PI) ,angle))
		+ smoothstep(mod(u_time,TWO_PI),round+mod(u_time,TWO_PI) ,angle+TWO_PI) * (1.-step(round +mod(u_time,TWO_PI) ,angle+TWO_PI));
}

//圆 半径，宽度，点到圆心距离
float circle(float r,float w,float l){
	return smoothstep(r-w*.5 , r,l) - smoothstep(r,r+w*.5,l);
}
//圆形扫描
float scan_circle(float minr , float maxr  , vec2 center , vec2 point){
	float r = minr + (maxr-minr)*fract(u_time);
	return smoothstep( r -minr*.5 , r,distance(center,point)) - step(r,distance(center,point));
}
//实心圆
float round(float r, vec2 center , vec2 point){
	return 1.-step(r, distance(center ,point));
}
//圆形轨道
vec2 circle_track(float r , vec2 center ,float rate,bool direct){
	float angle = mod(u_time*rate , TWO_PI);
	vec2 wantP;
	if(direct){
		wantP = vec2(r*cos(angle) , r*sin(angle));

	}else{
		wantP = vec2(-r*sin(angle) , -r*cos(angle));

	}
	
	return wantP +  center;
}

void main(){
	vec2 st = gl_FragCoord.xy / u_resolution;
	st.x *= u_resolution.x / u_resolution.y;

	st =  -vec2(1.) + st*2.;

	float angle = (atan(st.y,st.x) + TWO_PI *.5);
	float len = length(st);

	//point - edge - point angle change like :perAng/2 degree - 0 degree - perAng/2 degree


	//gl_FragColor = vec4( abs(vec3(  step(TWO_PI/6.+r5fmod(u_time,TWO_PI),angle)+
	//								(1.-smoothstep(0.+mod(u_time,TWO_PI),TWO_PI/6.+mod(u_time,TWO_PI),angle))
	//								*
	//								((1. -smoothstep(mod(u_time,TWO_PI),TWO_PI/6.+mod(u_time,TWO_PI),angle + TWO_PI)) + step(TWO_PI/6.+mod(u_time,TWO_PI),angle + TWO_PI))
	//								))
	//							 	,1.);

	gl_FragColor = vec4(
		scan(angle,TWO_PI/7.)*(1.-step(.99,len))*vec3(0.,0.99,.86) 
		+ circle(.2,.004,len)*vec3(.0,0.99,0.9)
		+ circle(.6,.004,len)*vec3(.0,0.99,0.9)
		+ circle(.99,.004,len)*vec3(.0,0.99,0.9)
		+ scan_circle(.03,.07,circle_track(.7,vec2(-.1,-.4),.3,false),st)*vec3(1.,0.,0.)
		+ round(.02 , circle_track(.7,vec2(-.1,-.4),.3 ,false),st)* vec3(1.,0.,0.)
		+ round(.017 , circle_track(.04,u_mouse,2.,false) , st)* vec3(1.,1.,1.)
		,1.);
	

}

