# VHP API

- [Brief](#breif)
- [Core](#core)
- [Services](#services)
- [Setup](#setup)
- [Uses](#uses)
- [Mart](#mart)
- [JMart](#jmart)

### Brief
The package's main purpose is to allow vhp applications to easily interface with the vhpportal. On top of that it helps to standardize how our applications interface with any call out to any api, database, or service.

### Core
As the base there is the "Core". At the core we can handle the actual sending, authentication and storing/accessing current user info. The Core can be used alone to make general calls, or extended to create custom calls. An example of extending the Core is found below, as all the services are based on the core.

Core Outline:

``
{
    Ping(){}
    Login(){}

    GETuser(){}
    GETuserinfo(){}
    SETuserinfo(){}

    SENDrequest(){}
}
``

### Services


### Setup

To get started import the package useing npm:

`npm install vhp-api`

This brings the most updated (newest publish date) package. Once the package is installed you can go to the top of a file that needs the interface and destructure VAPI from vhp-api.

`const {VAPI} = require('vhp-api);`

Further setup will depend on the intended use.

### Uses

### Mart
When making any calls to the vhp-mart you will format the following pack:
``
pack:{
  collect: 'collection name'
  store: 'store name'
  db: 'database name'
  methd: '[query](#query) | [remove](#remove) | [insert](#insert) | [update](#update)'
  options: {content depend on method. list below}
}
``

All of the following models can be expanded on using the [nedb documentation](https://github.com/louischatriot/nedb)

### query

``
options:{
    query:{}
}
``
returns
``
body:{
  result:[] || null
}
``
If the result is null, that means the call failed at some point prior. When successful the result carries an array reflecting the query. Even if the query returns a unique document, it will be in the array as the only document.


### remove
``
options:{
    query:{id:'itemid'}
    multi: TRUE || FALSE
}
``
returns
``
{
  body:{
    result:{
      err:null || err,
      num: (int)
    }
  }
}
``


### update
``
options:{
    query:{id:'itemid'}
    update:{$set:item}
    options:{}
}
``
returns
``
body:{
  result:{
    err:null || err,
    num:int
  }
}
``


### insert
``
options:{
  docs: [items] || {item}
}
``
returns
``
body:{
  result:{
    err: null,
    docs:
  }
}
``

CALLING -> request:'ADMIN' ---------------------------------------------------->

pack:{
  collect: 'collection name'
  store: 'store name'
  db: 'database name'
  method: 'ADDCOLLECTION | REMOVECOLLECTION | COLLECTIONMAPS | ADDSTORE | REMOVESTORE | ADDDATABASE | REMOVEDATABASE'
}

method: 'ADDCOLLECTION'
- required - pack.collect: collection name (valid) that does not already exits.
- return

method: 'REMOVECOLLECTION'
- required - pack.collect: existing collection name
- return

method: 'COLLECTIONMAPS'
- optional - pack.collect: if existing collection name, for single map
- return

method: 'ADDSTORE'
- required - pack.collect: existing collection name
           - pack.store: store name (valid) that does not already exists.
- return

method: 'REMOVESTORE'
- required - pack.collect: existing collection name
           - pack.store: existing store name
- return
method: 'ADDDATABASE'
- required - pack.collect: existing collection name
           - pack.store: existing store name
           - pack.db: database name (valid) that does not already exists
- return
method: 'REMOVEDATABASE'
- required - pack.collect: existing collection name
           - pack.store: existing store name
           - pack.db: existing database name
- return

<------------------------------------------------------------------------------>
## JMart
