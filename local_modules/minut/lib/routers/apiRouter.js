/** API route - return data/handle form post return result
 *
*/
const processRoute = require('./baseRouter');

const getHeaderData = () => ({ 'Content-Type': 'application/json' });

module.exports = function (
    res,
    route,
    ...rest
) {
    if (Object.keys(route).length === 0) {
        res.writeHead(404).end();
        return;
    }

    processRoute(
        getHeaderData,
        res,
        route,
        ...rest,
        {},
    );
};
