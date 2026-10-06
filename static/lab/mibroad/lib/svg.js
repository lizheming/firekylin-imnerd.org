function svg(width, height) {
	var that = this;
	~function createSVG() {
		var s = document.createElement('svg');
		s.setAttribute("xmlns", "http://www.w3.org/2000/svg");
		s.setAttribute("width", width);
		s.setAttribute("height", height);
		s.setAttribute("viewBox", "0 0 "+width+" "+height);
		that.s = s;
	}();
	svg.prototype.appendItem = function(item) {
		this.s.appendChild( item );
		return this;
	};
	svg.prototype.appendCircleArc = function(circle, angel, attrs) {
		circle = circle || {cx:100,cy:100,r:100}, 
		angel = angel || {start:0, end: 90};
		attrs = attrs || {fill:"none"};
		var largeArcFlag = Number(angel > 180); 
		var circleArc = svg.arc({
			largeArcFlag: largeArcFlag,
			rx: circle.r,
			ry: circle.r,
			startX: circle.cx - circle.r * Math.sin( angel.start / 180 * Math.PI),
			startY: circle.cy - circle.r * Math.cos( angel.start / 180 * Math.PI),
			endX: circle.cx - circle.r * Math.sin(angel.end / 180 * Math.PI),
			endY: circle.cy - circle.r * Math.cos(angel.end / 180 * Math.PI)
		}, attrs);
		this.s.appendChild( circleArc );
		return this;
	}
	svg.prototype.appendCircleArcText = function(text, circle, angel, width, attrs) {
		circle = circle || {cx:100,cy:100,r:100}, 
		angel = angel || {start:0, end: 90},
		attrs = attrs || {},
		width = width || 16;
		angel = angel.start + ( angel.end - angel.start ) / 2;
		var posX = circle.cx - circle.r * Math.sin( angel / 180 * Math.PI ),
			posY = circle.cx - circle.r * Math.cos( angel / 180 * Math.PI );
		var circleArcText = svg.text(text, {
			x: posX,
			y: posY,
			fontSize: width,
			transform: "rotate( -"+angel+" "+posX+" "+posY+")"
		})
		for(var i in attrs) {
			circleArcText.setAttribute(i.replace(/[A-Z]/g, function(o) { return '-'+o}), attrs[i]);
		}
		this.s.appendChild( circleArcText );
		return this;
	}
	svg.prototype.render = function() {
		return this.s;
	}
	svg.prototype.renderTo = function(DOM) {
		DOM = DOM || document.body;
		DOM.innerHTML = this.s.outerHTML;
		return this;
	}
}
svg.arc = function(config, attrs) {
	var def = {
		rx: 50,
		ry: 50,
		xAxisRotation: 0,
		largeArcFlag: 0,
		sweepFlag: 0,
		startX: 0,
		startY: 0,
		endX: 0,
		endY: 0
	}, config = config || {}, attrs = attrs || {};
	Object.keys( def ).forEach(function(k) {
		config[k] = config[k] || def[k];
	})

	attrs.d = "";
	~function calcPath() {
		var d = "M {{startX}},{{startY}} A {{rx}} {{ry}} {{xAxisRotation}} {{largeArcFlag}} {{sweepFlag}} {{endX}},{{endY}}";
		attrs.d = d.replace(/{{(.+?)}}/g, function(match, key) {
			return config[key];
		})
	}()

	var path = document.createElement('path');
	for(var i in attrs) {
		path.setAttribute(i.replace(/[A-Z]/g, function(o) { return '-'+o}), attrs[i]);
	}
	return path;
}
svg.text = function(text, attrs) {
	text = text || "", attrs = attrs || {};
	var t = document.createElement('text');
	t.innerHTML = text;
	for(var i in attrs) {
		t.setAttribute(i.replace(/[A-Z]/g, function(o) { return '-'+o}), attrs[i]);
	}
	return t;
}
svg.g = function(attrs) {
	this.s = document.createElement("g");
	attrs = attrs || {};
	for(var i in attrs) {
		this.s.setAttribute(i.replace(/[A-Z]/g, function(o) { return '-'+o}), attrs[i]);
	}
	return this;
}
svg.g.prototype = svg.prototype;
svg.g.prototype.constructor = svg.g;

function createCircle(items, circle, width, attrs) {
	var colors = gradientColor(items.length);
	colors.forEach(function(color, i) {   
		attrs.value = items[i];
		var g = new svg.g(attrs);
		var angel = {
	    	start: 360 / colors.length * i,
	    	end: 360 / colors.length * (i+1)
	    };
		g.appendCircleArc(circle, angel, {
	        fill: "none",
	        stroke: color,
	        strokeWidth: width
	    });
	    g.appendCircleArcText(items[i], circle, angel);
	    s.appendItem(g.render())
	})
}
	