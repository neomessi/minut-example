A minimum utility Node framework for modern web applications that sets up in a minute.

Currently supports only React and MongoDB.


============
  Backend
============

The main concept is that in your application you define:
- your routes in routes.js
- any guards that a route has in guards.js (these restrict access to a route)
- any handlers that a route has in handlers.js/apiHandlers.js

All your handler and guard functions are passed a "Consumer" object as well as the global MongoDB that you can optionally use.
This is how you interface with the framework (you're a consumer of the framework).
All consumer methods are defined in a section below.

Session state is handled for you! There are built-in security functions in the Consumer to handle login/logout etc.

The consumer object provides access to the current user via: consumer.currentUserInfo


=============
  Frontend
=============

The framework relies on folder conventions to find your html/css/js.

js bundles are handled for you (via Webpack) - just drop your components in:
    yourapp\gui\web\src\script\components\autoImported

and in your html:
    <div data-component="YourComponent"></div>

And that's it! But that's just the default - you can also customize your js bundles easily.

But you can also pass parameters into your component via data-props attribute.

You can also split your js bundles in subdirectories to reduce the size of the file.


-- passing data from backned to frontend --

This is done via the Consumer swapData method.

In your handler:
    consumer.swapData("message", "Hi there!");

In your html it will output the swapped message:
    <div>~`data:message`~</div>

This is also one way you can pass data into your components:
    <div data-component="YourComponent" data-props='{ "userName": "~`data:userName`~" }'></div>

That's it. Note these things were _omitted_ because it is the author's opinion they are better handled with components:
- conditional display logic
- server side includes


=======================
  Consumer object API
=======================

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
    login(un, pw)
    logout()
    register(un, pw)
    setCurrentUserInfo({})
    saveCurrentUserInfo(consumer)
    saveFormFieldsToCurrentUserInfo(cnsmr, fillable)
}

utils: {
    fillObject(obj, fields, fillable)
}


========================
  Implementation notes
========================

Expects the following to be defined in process.env:
    You can use this package: https://www.npmjs.com/package/dotenv
    And to run: $ NODE_ENV=development node index.js

COOKIE_SIGNATURE_PHRASE #used for signing httpOnly cookies - if change this all cookies will be invalidated
DB_CON_STR #mongo only supported

Configuration options can be found in config.json


=============================
  Internal notes/to do list
=============================

-share validation client/server?

-api routes:
    +GET
    +POST
    (PUT/PATCh)

-finish security
    -old adminauth idea (impersonation)? apikey in .env, password that changes every time - success or failure
    (-account recovery phrase (md5)? gen w/npm words

-csrf regular POST
-config.json as arg to run - have key for dev/prod overwrite defaults
-tests for consumer functions
(regex guards
(Wrap promise around mysql db calls (for rdbms use laravel?)

-vue, MySql support

SEPARATE PROJECTS?:
-tommy-tools/dwimform (local_modules) w/redux "a provider you register reducers with"
-paging {$qlimit}/{$qoffset}


Influences:
https://github.com/hapijs/hapi
https://github.com/koajs/koa
    https://github.com/koajs/koa/pull/1494/commits/387d6fb09b555333258a40760636050f545dfd7b
https://github.com/expressjs/express
