rConfig = function(eq) {
    that = this;
    this.eq = eq;

    this.eqRange = function() {
        var range;
        if(that.eq<50) range = 0;
        else if(that.eq<100) range = 1;
        else if(that.eq<150) range = 2;
        else if(that.eq<200) range = 3;
        else range = 4;
        return range;     
    }

    this.rColor = function() {
        var color = [
            [
                [181,204,255],  
                [128,168,255],
                [92,143,255],
                [33,103,255],
                [0, 81, 255]
            ],
            [
                [250,209,255],
                [247,171,255],
                [242,122,255],
                [236,69,255],
                [232,25,255]
            ],
            [
                [21,179,29],
                [131,222,135],
                [210,222,122],
                [231,250,85],
                [250,240,47]
            ],
            [
                [246,239,209],
                [230,212,192],
                [185,165,168],
                [126,116,140],
                [65,73,105]
            ]

        ];
        return color[Math.floor(Math.random()*3)][that.eqRange()];            
    }

    this.rDirection = function() {
        var theta = Math.random() * 2 * Math.PI;
        return new vector(Math.cos(theta)*4*that.eqRange(), Math.sin(theta)*4*that.eqRange());
    }
}