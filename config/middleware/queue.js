const Queue = require('bull');

const redisConfig = {
    redis: { host: '172.26.166.13', port: 6379 }
};

const parkirQueue = new Queue('parkirQueue', redisConfig)
parkirQueue.getWaiting().then(console.log);
parkirQueue.getActive().then(console.log);
parkirQueue.getFailed().then(console.log);

(async () => {
    console.log("Membersihkan job lama di queue...");
    await parkirQueue.clean(0, 'delayed');
    await parkirQueue.clean(0, 'wait');
    await parkirQueue.clean(0, 'failed');
    await parkirQueue.clean(0, 'completed');
    console.log("Queue dibersihkan!");
})();

module.exports = { parkirQueue };