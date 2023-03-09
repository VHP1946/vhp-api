const {Core}=require('vhp-api');


let core = new Core({
    dev:true
});
let core1 = new Core({
    dev:true
})

core1.Login({user:'VH',pswrd:'234'}).then(answr=>{console.log('LOGIN > ',answr)});

setTimeout(()=>core.Ping(true).then(answr=>{console.log('PING 1',answr);}),1000);