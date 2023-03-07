
export class VAPI {
    constructor({user={},host=false}){
        this.connected = true;
        this.host = host||'https://www.vhpportal.com/';

        //check local storage user
        this.user = {
            user:user.user || '',
            pswrd:user.pswrd || '',
            info:user.info || {}
        }
    }

    Ping(){return this.SENDrequest({});}
    Login(user={}){
        return new Promise((resolve,reject)=>{
            this.user.user = user.user||'';
            this.pswrd.pswr = user.pswrd || '';
            this.SENDrequest({route:'LOGIN'}).then(
                answr=>{
                    if(!answr.success){
                        this.connected=false;
                        this.user.user='';
                        this.user.pswrd='';
                    }else{
                        //gather info
                    }
                    return resolve(answr.success || false);
                }
            )
        })
    }
    GETuser(){return {user:this.user.user,pswrd:this.user.pswrd}}
    GETuserinfo(){return this.user.info;}
    SETuserinfo(ui){//update user
        return new Promise((resolve,reject)=>{
            return resolve(ui); //TRUE FALSE
        });
    }
    SENDrequest=({
        body=false,
        pack={},
        route='PING',
        request='',
        url=this.host+'api/'
    })=>{
        return new Promise((res,rej)=>{
            let options={
                method:'POST',
                headers:{
                'Accept':'application/json'
                },
                body:body?JSON.stringify(body):JSON.stringify({
                access:{
                    user:this.user.user||'',
                    pswrd:this.user.pswrd||'',
                    coid:'01',
                    request:request
                },
                pack:pack
                })
            }
            console.log('SENDING REQUEST->',request);
            fetch(url+route,options)
            .then(response=>{return response.json()})
            .then(data=>{console.log('Response Data>',data);return res(data);})
            .catch(err=>{return res({success:false,err:err});})
        });
    }

    REQUESTmart({
        pack={},
        request='mart'
    }){
        return new Promise((resolve,reject)=>{
            console.log(pack);
            this.SENDrequest({
                pack:pack,
                route:'STORE',
                request:request||''
            }).then(
                answr=>{
                    console.log()
                    if(answr.body.success){return resolve(answr.body.result);}
                    else {return resolve(false);}
                }
            );
        });
    }

    //PREPpack({pack,type})
    TESTsupportflow(st){
        let suppticket=(s=null)=>{
            if(!s){s={}}
            return{
                name:s.name||'',
                strtdate:s.strtdate||'',
                duedate:s.duedate||'',
                request:s.request||'',
                requestfor:s.requestfor||'',
                priority:s.priortity||10,
                descr:s.descr||'',
                dep:s.dep||''
            }
        }
        this.SENDrequest({
            body:suppticket(st),
            url:'https://prod-98.westus.logic.azure.com:443/workflows/10f5d3ecf3fe4ba5a97a4577c7405a3e/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=4Br5Z6VhFsIvy-B3KrA42ISM8Y8pLTdqKzo4_z9y3R0'
        }).then(answr=>{console.log(answr);});
    }
}

var vapi= new VAPI({
    user:{user:'VOGCH',pswrd:'vogel123'}
});
//vapi.Login().then(answr=>{console.log('Login ',answr)})
/*
vapi.REQUESTmart({
    pack:{
        collect:'company',
        store:'EMPLOYEES',
        db:'users',
        method:'query',
        options:{query:{}}
    }
}).then(list=>{console.log('USERS',list);})
*/