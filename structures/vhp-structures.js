process.env.NODE_TLS_REJECT_UNAUTHORIZED=0
async function FETCHschema(url){
    return new Promise((resolve,reject)=>{
    fetch(url)
    .then(response=>{return response.json()})
    .then(data=>{
        return resolve(data);
    })
    .catch(err=>{resolve(false)});


    });
}
let json = await FETCHschema('https://www.vhpportal.com/Tech/manifest.json');
console.log(json);
export const Structures={};
