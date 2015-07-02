

module.exports = function(){
    return  {
        trace:function(x){console.log('Trace: '+x);},
        debug:function(x){console.log('Debug: '+x);},
        info:function(x){console.log('Info: '+x);},
        warn:function(x){console.log('Warn: '+x);},
        error:function(x){console.log('Error: '+x);}
    };
};
