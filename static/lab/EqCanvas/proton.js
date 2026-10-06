vector = function(x,y) {
    this.x = x;
    this.y = y;
}
vector.prototype = {
    copy: function() {
        return new vector(this.x, this,y);
    },
    length: function() {
        return Math.sqrt(this.x*this.x + this.y*this.y)
    },
    sqrLength: function() {
        return this.x*this.x + this.y*this.y
    },
    normalize: function() {
        var inv = 1/this.length();
        return new vector(this.x*inv, this.y*inv)
    },
    negate: function() {
        return new vector(-this.x, -this.y)
    },
    add: function(v) {
        return new vector(this.x+v.x, this.y+v.y)
    },
    subtract: function(v) {
        return new vector(this.x-v.x, this.y-v.y)
    },
    multiply: function(f) {
        return new vector(this.x*f, this.y*f)
    },
    divide: function(f) {
        return new vector(this.x/f, this.y/f)
    },
    dot: function(v) {
        return this.x*v.x+this.y*v.y
    }
}
vector.zero = new vector(0,0);
Particle = function(c) {
    var d = {
        position:new vector(0,0), 
        velocity:vector.zero, 
        acceleration:new vector(0,100), 
        life:1, 
        age:0,
        color:[255,0,0],
        size:5
    };
    for(var i in c) this[i] = c[i];
    for(var i in d) 
        this[i] = c.hasOwnProperty(i) ? c[i] : d[i];
};
ParticleSystem = function() {
    var that = this;
    var particles = [];
    this.items = particles;
    this.effectors = [];
    this.decased = function() {};

    /** 装入粒子 **/
    this.emit = function(particle) {
        particles.push(particle);
    }

    /** 粒子演化 **/
    this.simulate = function(dt) {
        aging(dt); 
        applyEffectors();
        kindematics(dt);
    }

    /** 渲染粒子到画布 **/
    this.render = function() {
        var args = arguments;
        particles.forEach(function(particle) {
            if(typeof args[0] != 'undefined' && args[0]) {    
                ctx.save();   
                ctx.translate(particle.position.x+200, particle.position.y+100);
                ctx.rotate(particle.angel);
                ctx.translate(-200,-100);
                ctx.fillStyle = "rgb(255,255,0)";
                ctx.fillRect(0,0,400,200);
                ctx.drawImage(args[0][Math.ceil(particle.age/particle.life*args[0].length)], 0, 0);
                ctx.restore();
            } else {
                var alpha = particle.life != 0 ? 1 - particle.age / particle.life : 1;
                ctx.fillStyle = "rgba("+
                    + Math.floor(particle.color[0]) + ","
                    + Math.floor(particle.color[1]) + ","
                    + Math.floor(particle.color[2]) + ","
                    + alpha.toFixed(2) + ")";     
                ctx.beginPath();
                ctx.arc(particle.position.x, particle.position.y, particle.size, 0, Math.PI*2, true);
                ctx.closePath();
                ctx.fill();     
            }
        })
    }

    /** 粒子老化 **/
    function aging(dt) {
        var i=0;
        while(i<particles.length) {
            var p = particles[i];
            p.age += dt;
            p.age<p.life ? i++ : kill(i);
        }
    }

    /** 杀死已经老死的粒子 **/
    function kill(index) {
        that.decased(particles[index]);

        if(particles.length > 1)
            particles[index] = particles[particles.length - 1];
        particles.pop();
    }

    /** 粒子运动 **/
    function kindematics(dt) {
        particles = particles.map(function(particle) {
            particle.position = particle.position.add(particle.velocity.multiply(dt));
            particle.velocity = particle.velocity.add(particle.acceleration.multiply(dt));
            return particle;
        })
    }

    /** 设置效果 **/
    function applyEffectors() {
        if(that.effectors.length == 0) return false;
        that.effectors.forEach(function(effector) {
            particles = particles.map(function(particle) {
                effector.apply(particle);
                return particle;
            })
        })
    }
};

/** 碰撞效果 **/
ChamberBox = function(x1,y1,x2,y2) {
    this.apply = function(particle) {
        if(particle.position.x - particle.size < x1 || particle.position.x + particle.size > x2)
            particle.velocity.x = -particle.velocity.x;


        if(particle.position.y - particle.size < y1 || particle.position.y + particle.size > y2)
            particle.velocity.y = -particle.velocity.y;
    }
}