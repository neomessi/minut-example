Look at:
https://github.com/hapijs/hapi
https://github.com/koajs/koa
    https://github.com/koajs/koa/pull/1494/commits/387d6fb09b555333258a40760636050f545dfd7b
https://github.com/expressjs/express


Directory structure:

.env # set APP_ROOT
.gitignore
node_modules/
package.json
package-lock.json
webpack.config.js
README.md


# should these be in /minut? minut/lib? when install will create in node_modules/minut/(lib) - own package.json - depencies: lowdb, dotenv, 
# vue?? (for tommy-tools) - src/dist dirs? renderReactComponent/renderVueComponent?
# paging -  {$qlimit}/{$qoffset} 
# node_modules/minut/lib - getPhoneValidation, etc. getJsBundle(key)
minut.data.json # (actually lowdb) this has bundles (js: []/css: []), validations (regex - this can be used by client/server)

webpack-post-build.js

main.js

dao/

ctrl/
# pass fn callback function to return json or text/html
# manually require all routes in main (for now)
    api/main.js // main api route - all routes in this folder only return JSON
    app/main.js // main application route - GET/POST/etc., render /gui

gui/
    web/
        src/
            html/ # files in here may contain  ~``~
                index.html
            style/
                *.css/*.sass/*.scss/*.less
            script/
                *.js/*.ts
                components/
                    *.jsx/*.tsx

        dist/ # webpack output
            js/
            css/
