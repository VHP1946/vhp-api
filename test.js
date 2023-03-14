const {Core,Store}=require('vhp-api');

let core = new Core({
    dev:{
        comments:true,
        httpsagent:true
    }
});

core.Login({user:'VOGCH',pswrd:'vogel123'}).then(auth=>{
    console.log(auth);
})