const {Core,Store}=require('vhp-api');

let core = new Core({
    host:'http://localhost:5000/',
    dev:{comments:true}
});


/*
            core.Request({
                pack:{
                collect:'company',
                store:'EMPLOYEES',
                db:'master',
                method:'QUERY',
                options:{query:{}}
                }
            }).then(answr=>{console.log(answr)});
*/

core.Login().then(
auth=>{
    console.log(auth);
    if(auth){
        core.SENDrequest({
            pack:{
                method:'updatefbook',
            },
            route:'STORE',
            request:'JMART'
        }).then(answr=>{console.log(answr)});
    }

})