TODO:
-force https
--hot --watch [idk if need this - want to keep as close to production deploy]

Directory structure:

.env # set APP_ROOT
.gitignore
node_modules/
package.json
package-lock.json
webpack.config.js
README.md

# node_modules/minut/lib - getPhoneValidation, etc. getJsBundle(key)
minut.data.json # (actually lowdb) this has bundles (js: []/css: []), validations (regex - this can be used by client/server)

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
