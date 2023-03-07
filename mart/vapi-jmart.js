import { SENDrequestapi } from 'https://www.vhpportal.com/repo/apis/vapi/vapicore.js';
import {awo} from 'https://www.vhpportal.com/repo/ds/wos/vogel-wos.js';
import {aservicecontract} from 'https://www.vhpportal.com/repo/ds/contracts/vogel-servicecontracts.js';
import {aserviceitem} from 'https://www.vhpportal.com/repo/ds/customers/vogel-serviceitems.js';

//WO_DetailHistory_tbl
//WO_DescOfWorkPerformed_tbl
//WO_DescriptionOfWork_tbl
//WO_DescriptOfWorkPerformedForBill_tbl
//WO_Profile_tbl *to get the WO categories
//WO_FlatRate_tbl *
//WO_ServiceItemComments_tbl

//AR_ServiceItemCustomTables_tbl
//AR_ServiceItemCustomInfo_tbl * use for custom service items
//AR_ServiceItemCustomInfoLog_tbl

export var GETjapitest=()=>{
  return new Promise((res,rej)=>{
      var wopull = {
          table:'custom',
          option:'download',
          template:'AR_CustomerMaster_tbl',
          where:[{OP:'=',CustomerCode:'PUFR02'}]
      };
      return res(SENDrequestapi(wopull,'STORE',{request:'jmart'}).then(
        answr=>{
          console.log(answr)
        }));
  });
}

export var GETflbook=(book='RES',table='flatratebook')=>{
    return new Promise((res,rej)=>{
        let opts = {
            table:table,
            bookcode:book
        };
        return res(SENDrequestapi(opts,'STORE',{request:'jmart'}));
    })
}
export var GETscontract=(custcode,table='contracttable')=>{
  return new Promise((resolve,reject)=>{
      let opts = {
          table:'contracttable',
          custcode:custcode||undefined
      };
      let contract=null;
      SENDrequestapi(opts,'STORE',{request:'jmart'}).then(
        result=>{
          if(result.body.success){
              let others=[];
              for(let i=result.body.table.length-1;i>=0;i--){  //Finds first Active Contract by searching from the bottom up
                  if(result.body.table[i].status == 'A'){
                      contract = aservicecontract(result.body.table[i]);
                      break;
                  }
              }
          }
          return resolve(contract);
        }
      )
  })
}
export var GETwo=(wonum,table='wonumber')=>{
    return new Promise((resolve,reject)=>{
        let opts = {
            table:table,
            wonum:wonum,//'00024530'
        };
        let wo = null;
        if(wonum){
          SENDrequestapi(opts,'STORE',{request:'jmart'}).then(
            answr=>{
              if(answr.body.success&&answr.body.table.length==1){
                console.log("WO from JMart:::::::::::",answr.body.table[0])
                wo = awo(answr.body.table[0]);

                let havedescr=false;
                let haveemail=false;
                let havename=true;

                SENDrequestapi({
                    table:'custom',
                    option:'download',
                    template:'WO_DescriptionOfWork_tbl',
                    where:[{OP:'=',WorkOrderNumber:wonum}]
                },'STORE',{request:'jmart'}).then( //bring in descriptions
                  answr=>{
                    console.log('JAPI->recieved description of work');
                    if(answr.body.success){
                      wo.descr='';
                      for(let x=0,l=answr.body.table.length;x<l;x++){
                        wo.descr+=answr.body.table[x].WorkDescription +'\n';
                      }
                    }
                    SENDrequestapi({
                        table:'custom',
                        option:'download',
                        template:'AR_CustomerPreferences_tbl',
                        where:[{OP:'=',CustomerCode:wo.custcode}]
                    },'STORE',{request:'jmart'}).then(
                      answr=>{
                        console.log('JAPI->recieved email address');
                        if(answr.body.success){
                          wo.contactemail=answr.body.table[0]?answr.body.table[0].EmailAddress:'';
                        }
                        SENDrequestapi({
                            table:'custom',
                            option:'download',
                            template:'AR_CustomerMaster_tbl',
                            where:[{OP:'=',CustomerCode:wo.custcode}]
                        },'STORE',{request:'jmart'}).then( //bring in customer name
                          answr=>{
                            console.log('JAPI->recieved customer name');
                            if(answr.body.success){
                              wo.customername=answr.body.table[0].CustomerName;
                              console.log(wo.customername, "CUSTOMER NAME")
                            }
                            return resolve(wo);
                          }
                        );
                      }
                    )
                  }
                );
              }else{return resolve(wo);}
            }
          );
        }else{return resolve(wo);}
    })
}
export var GETcustomer=(custcode,table='customertable')=>{
  return new Promise((res,rej)=>{
      let opts = {
          table:table,
          custcode:custcode
      };
      return res(SENDrequestapi(opts,'STORE',{request:'jmart'}));
  })
}
export var GETserviceitems=(custcode,table='custserviceitems')=>{
  return new Promise((res,rej)=>{
      let opts = {
          table:table,
          custcode:custcode
      };
      let sitems=[];
      SENDrequestapi(opts,'STORE',{request:'jmart'}).then(
        result=>{
          if(result.body.success){
            for(let i=0;i<result.body.table.length;i++){
                sitems.push(aserviceitem(result.body.table[i])); //aserviceitems()
            }
            let opts2 = {
                table:'test',
                option:'download',
                template:'AR_ServiceItemCustomInfo_tbl',
                where:[{OP:'=',CustomerCode:custcode}]
            };
            SENDrequestapi(opts2,'STORE',{request:'jmart'}).then(
              answr=>{
                console.log('RECIEVED->service item info')
                if(answr.body.success){
                  for(let x=0,l=answr.body.table.length;x<l;x++){
                    for(let y=0,ll=sitems.length;y<ll;y++){
                      if(sitems[y].id===answr.body.table[x].LineNumber){
                        switch(answr.body.table[x].FieldNumber){
                          case "01":{sitems[y].filt1=answr.body.table[x].Information || '';}
                          case "02":{sitems[y].filt1q=answr.body.table[x].Information || '';}
                          case "03":{sitems[y].filt2=answr.body.table[x].Information || '';}
                          case "04":{sitems[y].filt2q=answr.body.table[x].Information || '';}
                          case "05":{sitems[y].beltsize=answr.body.table[x].Information || '';}
                          case "06":{sitems[y].controls=answr.body.table[x].Information || '';}
                          case "07":{sitems[y].refri=answr.body.table[x].Information || '';}
                          case "08":{sitems[y].elec=answr.body.table[x].Information || '';}
                        }
                      }
                    }
                  }
                }
                return res(sitems);
              }
            );
          }else{return res(sitems);}
        }
      );
  })
}
