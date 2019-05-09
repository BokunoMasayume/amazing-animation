	//precision mediump float;
	precision lowp float;

	#define F +texture2D(u_textureMap , mod(p.xz*s/1000. +.5,1.) )/(s+=s)
	//#define F +texture2D(u_textureMap ,vec2( p.x*(s * 1)/3000. ,p.z*(s+=s)/3000.))/5.

	uniform sampler2D u_textureMap;
	uniform vec2 u_resolution;
	uniform float u_time;
	uniform vec2 u_mouse;
	void main(){
		vec4 p = vec4(gl_FragCoord.xy / u_resolution ,1.,1.) -.5;
		//p.y -= .5;
		vec4 d = p ,t;
		p.z = u_time*10.;

		//d.y -= .5;
		d.y += u_mouse.y;
		d.x += u_mouse.x;

		for(float i=1.5;i>0.;i -= 0.004){
			float s = .4;
			t = F F F F; 
			//t = texture2D(u_textureMap , p.xz*s/3000.)/(s+=s) +texture2D(u_textureMap , p.xz*s/3000.)/(s+=s) +texture2D(u_textureMap , p.xz*s/3000.)/(s+=s) +texture2D(u_textureMap , p.xz*s/3000.)/(s+=s);
			
			gl_FragColor = vec4(.85-d.x -t.xyz*clamp(i,0.,1.) ,t.w);


			//gl_FragColor = texture2D(u_textureMap , p.xy+.5);

			if(t.z > p.y*.005 + 1.3)break;

			p +=d;
		}
		//gl_FragColor = vec4(1.,1.,.5,1.);
	}