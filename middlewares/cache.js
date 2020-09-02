const nodeCache = require("node-cache");
const cache = new nodeCache({stdTTL: 5 * 60});

class Cache{

   static getUrlFromRequest(req) {
        const url = `${req.protocol  }://${  req.headers.host  }${req.originalUrl}`;
        return url;
    }

    static setCache(req, res, next) {
        const url = getUrlFromRequest(req);
        cache.set(url, res.locals.data);
        return next();
    }

    static getCache(req, res, next) {
        const url = getUrlFromRequest(req);
        const content = cache.get(url);
        if (content) {
          return res.status(200).send(content);
        }
        return next();
      }

    static clearCache(req, res, next) {
        cache.keys(function(err, keys) {
            if (!err) {
                // again, it depends on your application architecture,
                // how you would retrive and clear the cache that needs to be cleared.
                // You may use query path, query params or anything. 
                let resourceUrl = req.baseUrl;
                const resourceKeys = keys.filter(k => k.includes(resourceUrl));
      
                cache.del(resourceKeys);
            }
        });
        return next();
    }
}

module.exports = Cache;