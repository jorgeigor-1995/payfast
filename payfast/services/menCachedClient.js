var mencached = require('memcached');


module.exports = () => {
  return createMemcachedClient();

}

function createMemcachedClient(){
  var client = new mencached("localhost:11211", {
    retries: 10,
    retry: 10000,
    remove: true,
  });
  return client;
}
