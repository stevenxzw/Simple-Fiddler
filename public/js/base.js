/**
 * Created by zhiwen on 14-11-3.
 */
(function(ang, win){
    if(typeof MP === 'undefined'){
        MP = {
            actions : {
                evts : {},
                get : function(ns){
                    return this.evts[ns];
                },

                reg : function(ns, fn){
                    if(!this.evts[ns])
                        this.evts[ns] = [];
                    var orfn = this.evts[ns];
                        orfn.push(fn);
                    return this;
                }
            },

            on : function(name, fn){
                MP.actions.reg('self_'+name, fn);
            },

            fire : function(name, params){
                var fns = MP.actions.get('self_'+name);
                if(fns){
                    if(fns.length){
                        angular.forEach(fns, function(fn){
                            fn(params);
                        })
                    }else{
                        fns(params);
                    }
                }else{
                    console || console.log('no event');
                }
            }
        };
    }


    MP.config = {};

    window['MP'] = MP;

})(angular, window)