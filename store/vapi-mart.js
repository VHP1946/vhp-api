const {Core}=require('../core/vapi-core.js');

class VAPImart extends Core{
    constructor(core){
        super({...core});
    }

    Request({
        pack={},
        request='mart'
    }){
        return new Promise((resolve,reject)=>{
            this.SENDrequest({
                pack:pack,
                route:'STORE',
                request:request||''
            }).then(
                answr=>{
                    console.log(answr);
                    if(answr.body.success){
                        return resolve(answr.body.result);//returns the table if QUERY | INSERT
                    }
                    else {return resolve(false);}
                }
            );
        });
    }
}
module.exports={VAPImart}