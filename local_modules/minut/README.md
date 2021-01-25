A minimum utility Node framework for modern apps that sets up in a minute

Expects the following to be defined in process.env:
    You can use this package: https://www.npmjs.com/package/dotenv
    And to run: $ NODE_ENV=development node index.js

COOKIE_SIGNATURE_PHRASE #used for signing httpOnly cookies - if change this all cookies will be invalidated
DB_CON_STR #mongo only supported

Configuration options can be found in config.json

Look at:
https://github.com/hapijs/hapi
https://github.com/koajs/koa
    https://github.com/koajs/koa/pull/1494/commits/387d6fb09b555333258a40760636050f545dfd7b
https://github.com/expressjs/express


TODO:
-api routes GET/POST/etc.
-csrf regular POST
-only send cookies for html requests? !curuserpromise
-finish security
    -account recovery phrase (md5)? gen w/npm words
    -old adminauth idea (impersonation)? apikey in .env, password that changes every time - success or failure
-config.json as arg to run - have key for dev/prod overwrite defaults
-tests (minut-example?)
(regex guards

SEPARATE PROJECTS?:
-tommy-tools/dwimform (local_modules) w/redux "a provider you register reducers with"
-paging {$qlimit}/{$qoffset}
