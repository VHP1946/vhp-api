/*
*/
import * as https from 'https';

let VAPIclient={
    try:false,
    connected:false,
    auth:{user:'',pswrd:'',coid:'01'}
}
function SETclientauth(auth={},connected=false){
    try{localStorage.setItem(JSON.stringify(auth));}
    catch{}
    VAPIclient.auth=JSON.parse(JSON.stringify(auth));
    VAPIclient.connected=connected;
}

function GETclientauth(){
    if(!VAPIclient.try){
        try{
            let vcauth = JSON.parse(localStorage.getItem('vapi-user'));
            if(vcauth.user!=undefined && vcauth.pswrd!=undefined){
                VAPIclient.auth=vcauth;
            }
        }catch{console.log('FAIL localstore')}
    }
    VAPIclient.try=true;
    return {
        auth:VAPIclient.auth,
        connected:VAPIclient.connected
    }
}

/* VAPI Core
    Base class for making connections through the VAPI. 
*/
export class Core {
    /**
     * @param {Object} auth can be passed to set auth
     * @param {Boolean} sync will connect with auth activity from other Cores
     * @param {String | Boolean} host can change the host has need, FALSE->default 'https://www.vhpportal.com/
     * @param {Object} dev object {comments:TRUE | FALSE} can add flags for better control when developing 
     */
    constructor({auth={},sync=true,host=false,dev=false,client=true}){
        let vapiclient = sync?GETclientauth():false;
        this.connected = sync?vapiclient.connected:false;
        this.host = host||'https://www.vhpportal.com/';//take out defualt, and require pass
        this.client=client;
        this.dev=dev;
        this.sync=sync;
        this.auth = sync?vapiclient.auth:{
            user:auth.user || '',
            pswrd:auth.pswrd || '',
        }
        this.Ping = this.Ping.bind(this);
        this.dev.https&&(process.env.NODE_TLS_REJECT_UNAUTHORIZED=0);
    }
    
    /** PING vhpportal
     *  A way to check if there is a connection to the portal. will retrun false.
     * 
    */
    async Ping(full=false){
        let answr = await this.SENDrequest({});
        this.dev.comments&&console.log(answr);
        return answr.success?
        (full?{
            call:answr,
            status:this.GETstatus()
        }:answr.msg):
        (full?{
            call:answr,
            status:this.GETstatus()
        }:answr.success)
    }
    Login(user=null){
        return new Promise((resolve,reject)=>{
            if(user){
                this.auth.user = user.user||''
                this.auth.pswrd = user.pswrd || '';
            }
            this.SENDrequest({route:'LOGIN'}).then(
                answr=>{
                    this.dev.comments&&console.log('Login Response >',answr);
                    if(!answr.success){
                        this.connected=false;
                        this.auth.user='';
                        this.auth.pswrd='';
                        console.log("Login failed")
                        return resolve(false)
                    }else{
                        console.log("User logged in")
                    }
                    this.sync&&SETclientauth(this.auth,this.connected);
                    return resolve(answr.success || false);
                }
            )
        })
    }
    GETstatus(){
        return {
            syncing:this.sync,
            auth:{...this.auth},
            connected:this.connected
        }
    }
    //Get the user data stored in this object
    GETauth(){return {...this.auth}}
    SYNCauth(){this.auth={...VAPIclient.auth}}

    SENDrequest({
        body=false,
        pack={},
        route='PING',
        request='',
        url=this.host+'api/'
    }){
        return new Promise((resolve,reject)=>{
            if(this.client){return resolve(this.REQUESTclient({
                body:body,
                pack:pack,
                route:route,
                request:request,
                url:url
            }));}
            else{
                setTimeout(()=>{
                    return resolve(this.REQUESTserver({
                        body:body,
                        pack:pack,
                        route:route,
                        request:request,
                        url:url
                    }))
                },Math.floor(Math.random() * 1000));
            }
        });
    }

    REQUESTclient({
        body=false,
        pack={},
        route='PING',
        request='',
        url=this.host+'api/'
    }){
        return new Promise((resolve,reject)=>{
            this.sync&&route!=='LOGIN'&&console.log('SYncing')&&this.SYNCauth()&&console.log('Syncing');
            let options={
                method:'POST',
                headers:{
                    'Accept':'application/json'
                },
                body:body?JSON.stringify(body):JSON.stringify({
                access:{
                    user:this.auth.user||'',
                    pswrd:this.auth.pswrd||'',
                    coid:'01',//this.auth.coid||'',
                    request:request
                },
                pack:pack,
                })
            }
            this.dev.comments&&console.log('SENDING REQUEST->',route);
            fetch(url+route,options)
            .then(response=>{console.log(response);return response.json()})
            .then(data=>{
                this.dev.comments&&console.log('Response Data>',data);
                return resolve(data);
            })
            .catch(err=>{return resolve({msg:'Request Failes',success:false,err:err});});
        });
    }

    REQUESTserver({
        body=false,
        pack={},
        route='PING',
        request=''
    }){
        return new Promise((resolve,reject)=>{
            let bod = body?JSON.stringify(body):JSON.stringify({
                access:{
                    user:this.auth.user||'',
                    pswrd:this.auth.pswrd||'',
                    coid:'01',//this.auth.coid||'',
                    request:request
                },
                pack:pack,
            });
            var options = {
                hostname: 'www.vhpportal.com',//this.host,
                port: 443,
                path: `/api/${route}/`,
                method: 'POST',
                agent:new https.Agent({rejectUnauthorized:false}),
                headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(bod)
                }
            };
            //change to http for local testing
            var req = https.request(options, function (res) {
                res.setEncoding('utf8');
            
                var data = '';
            
                res.on('data', function (chunk) {
                data = data + chunk;
                });
            
                res.on('end',function(){
                    try{
                        data = JSON.parse(data);
                        return resolve(data);
                    }catch{return resolve({success:false,err:'bad parse'})}
                });
                req.on('error', function (e) {
                    console.log("Error : " + e.message);
                    return resolve({success:false,err:e});
                });
            });
        
            // write data to request body
            req.write(bod);
            req.end();
        })
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