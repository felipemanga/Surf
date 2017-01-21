CLAZZ("cmp.ImgDiff", {
    INJECT:{"entity":"entity", "wait":"cmp.Wait", "webcam":"cmp.Webcam"},
    rect:null,
    prev:null,
    diff:null,
    timestamp:0,
    noiseFloor:500,
    dirty:false,

    create:function(){
        this.webcam.create();
        this.doDiffLoop(); // 10 fps
        // setInterval(this.log.bind(this), 1000);
    },

    update:function(){
        this.dirty = true;
    },

    doDiffLoop:function(){
        if(this.dirty) this.doDiff();
        this.dirty = false;
        this.wait.wait(this.doDiffLoop.bind(this), 1000/10); // 10 fps
    },

    log:function(){
        var diff=this.diff, i=0, l=diff.length;
        console.log(diff);
    },
    
    doDiff:function(){
        var rect = this.rect || new Phaser.Rectangle();
        var bmp = this.webcam.grab();
        rect.setTo(0,0,bmp.width, bmp.height);
        var img = bmp.getPixels(rect);
        
        if( !this.prev ){
            this.prev = img;
            return;
        }
        
        var s = 8, w=img.width;
        if( !this.diff ) this.diff = new Float32Array(Math.floor(w/s));
        var diff = this.diff;
        diff.fill(0);

        var fd = img.data, pd=this.prev.data;

        var yw=0;
        for( var y=0; y<img.height; y+=s, yw+=w*s ){
            for( var x=0; x<w; x+=s){
                diff[diff.length - 1 - Math.floor(x/s)] += Math.abs(fd[(yw+x)*4] - pd[(yw+x)*4]);
            }
        }

        for( x=0; x<w; ++x ){
            diff[x] -= this.noiseFloor;
            if( diff[x] < 0 ) diff[x] = 0;
        }

        if( this.entity.onDiff )
            this.entity.apply(this.entity.onDiff, this.diff, bmp, img);
        this.prev = img;
    }
});