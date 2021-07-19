# Minut.js
A minimum utility Node framework for modern web applications that sets up in a minute.

Currently supports only React and MongoDB.

---

## Prerequisites

- Recent version of Node
- MongoDB account (https://www.mongodb.com/try)


## Setup

1. Easiest to just clone the example repo: https://github.com/neomessi/minut-example  
  (then you can delete the .git folder and reinit if you want)

1. create an .env file:
    > COOKIE_SIGNATURE_PHRASE=makeup something here using multiple words
    > DB_CON_STR=mongodb+srv://web:rest of your string
    > DB_NAME=your collection name

1. create local certs
    something like:  
    `openssl req -nodes -new -x509 -keyout localserver.key -out localserver.cert`

1. run:
    1. npm install --save-dev
    1. npm run build # you will also re-run this anyytime you change js files
    1. npm run dev

1. Go to (it only runs https):
    https://localhost:9876/


## Framework explained: Backend

The main concept is that in your application you define:
- your routes in routes.js
- any guards that a route has in guards.js (these restrict access to a route)
- any handlers that a route has in handlers.js/apiHandlers.js

All your handler and guard functions are passed a "Consumer" object as well as the global MongoDB that you can optionally use.  
This is how you interface with the framework (you're a consumer of the framework).  
All consumer methods are defined in a section below.

Session state is handled for you! There are built-in security functions in the Consumer to handle login/logout etc.

The consumer object provides access to the current user via: consumer.currentUserInfo


## Framework explained: Frontend

The framework relies on folder conventions to find your html/css/js.

js bundles are handled for you (via Webpack) - just drop your components in:
`yourapp\gui\web\src\script\components\autoImported`

and in your html:
> <div data-component="YourComponent"></div>

And that's it! But that's just the default - you can also customize your js bundles easily.

But you can also pass parameters into your component via data-props attribute.

You can also split your js bundles in subdirectories to reduce the size of the file.


###### passing data from backned to frontend

This is done via the Consumer swapData method.

In your handler:  
`consumer.swapData("message", "Hi there!");`

In your html it will output the swapped message:  
> <div>\~``data:message``\~</div>

This is also one way you can pass data into your components:  
> <div data-component="YourComponent" data-props='{ "userName": "~`data:userName`~" }'></div>

That's it. Note these things were _omitted_ because it is the author's opinion they are better handled with components:
- conditional display logic
- server side includes


## Consumer object API
```
currentUser: {
    currentUserName,  // note: password purposely not exposed (handled by framework)
    currentUserInfo: { /* your info here */ },
}

request: {
    method,
    params: {
        url: {},
        form: {}
    };
}

response: {
    body
    swapData(key, val)
}

security: {
    // all these functions return promises:
    login(un, pw)
    logout()
    register(un, pw)
    setCurrentUserInfo({})
    saveCurrentUserInfo(consumer)
    saveFormFieldsToCurrentUserInfo(cnsmr, fillable) // see below utils.fillObject
}

utils: {
    fillObject(obj, fields, fillable)
    /**
     * 
     * @param {object} obj represents Mongo document
     * @param {object} fields form fields (key/value pairs)
     * @param {array} fillable indicates which form fields (keys) to populate in object (simliar to Laravel)
     * @param {boolean} convertFields if true, will change form field names first_name or FirstName to firstName
     */
}
```


## Directory structure
```
.env
.gitignore
package.json
package-lock.json
webpack.config.js
README.md

ctrl/
    routes.js // define your application routes
    guards.js // protect your routes
    handlers.js // main application route - GET/POST/etc., render /gui
    apiHandlers.js // main api route - all routes only return JSON

gui/
    web/
        src/
            html/ # files in here may contain  ~`data:123`~
                index.html
            style/
                *.css/*.sass/*.scss/*.less
            script/
                *.js/*.ts
                components/
                    *.jsx/*.tsx

        dist/ # webpack output/static html
            css/
            html/ # static html but autoswapping still occurs
            js/
```


## Implementation notes

Expects the following to be defined in process.env:  
    You can use this package: https://www.npmjs.com/package/dotenv  
    And to run: $ NODE_ENV=development node index.js  

COOKIE_SIGNATURE_PHRASE #used for signing httpOnly cookies - if change this all cookies will be invalidated
DB_CON_STR #mongo only supported

Configuration options can be found in config.json*

*This is a WIP and config options may/may not be honored and defaults may be used.


## Influences:
* https://github.com/hapijs/hapi
* https://github.com/koajs/koa
* https://github.com/expressjs/express
* Web Development with Node & Express, Brown


## Internal notes/to do list

- [] share validation client/server?  
  minut.data.json include regex?

- [] api routes:
    - [x] GET
    - [x] POST
    - [] (PUT/PATCH)

- [] tests for consumer functions
- [] config.json as arg to run - have key for dev/prod overwrite defaults
- [] force https

- [] vue, MySql support (Wrap promise around mysql db calls)

- [] SEPARATE PROJECTS?:
  - tommy-tools/dwimform (local_modules) w/redux "a provide3. you register reducers with"
  - paging
  - admin auth idea (impersonation)? apikey in .env, password that changes every time - success or failure
