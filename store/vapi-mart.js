const {Core}=require('../core/vapi-core.js');
class VAPImart extends Core{
    constructor(){
        super();
    }

    REQUESTmart({
        pack={},
        request='mart'
    }){
        return new Promise((resolve,reject)=>{
            //console.log(pack);
            this.SENDrequest({
                pack:pack,
                route:'STORE',
                request:request||''
            }).then(
                answr=>{
                    if(answr.body.success){
                        return resolve(answr.body.result);
                    }
                    else {return resolve(false);}
                }
            );
        });
    }
}
module.exports={VAPImart}