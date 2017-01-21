CLAZZ("cmp.Sprite", {
    INJECT:["entity", "gameState", "asset", "frame"],
    EXTENDS:Phaser.Sprite,
    frame:null,
    CONSTRUCTOR:function(){
        SUPER( this.gameState.game, 0, 0, this.asset, this.frame);
        this.game.world.addChild(this);
        this.entity.position = this.position;
        this.entity.anchor = this.anchor;
        this.entity.scale = this.scale;

        // not a NOP!
        this.input = this.input;
        this.preUpdate = this.preUpdate;
        this.postUpdate = this.postUpdate;
        this.update = this.update;
    },

    create:function(){
        if( typeof this.entity.update == "function")
            this.update = this.entity.update;

        if( typeof this.entity.postUpdate == "function")
            this.postUpdate = this.entity.postUpdate;

        if( typeof this.entity.preUpdate == "function")
            this.preUpdate = this.entity.preUpdate;
    }
});