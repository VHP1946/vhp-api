import {
    Core,
    Store,
    Structures
} from 'vhp-api';

let core = new Store.Mart({
    client:false,
    dev:{
        comments:true
    }
});
core.Login({user:'VOGCH',pswrd:'vogel123'}).then(
    answr=>{
        console.log(answr);
        answr&&
        core.Request({
            pack:{
                collect:'apps',
                store:'RRQ',
                db:'mquotes',
                method:'map',
                options:{}
            }
        }).then(answr=>console.log('Map >',answr))
    }
)
