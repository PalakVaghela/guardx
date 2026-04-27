const requestsMap = new Map();
// hashMap will store user ip (key) and timestamp (value) in k:v pair

module.exports = (req, res, next) => {
    const key = `${req.apiKey}:${req.ip}`;
    console.log(key, "req ip#####");
    console.log(requestsMap, "requestsMap");

    const now = Date.now();
    const WINDOW_SIZE = 60 * 1000; // 60 sec
    const MAX_REQUESTS = req.user.plan == 'pro' ? 20 : 5;

    if (!requestsMap.has(key)) {
    requestsMap.set(key, []);
    }

    let timestamps = requestsMap.get(key);
    console.log(timestamps, "timestamps");

    // let timestamps = requestsMap.get(ip); //this will return value of array from where user have loggedin

    // take timestemps from array which is come in last 60sec only.
    // if in array there is more than required req then we got to know that there is an multiple req from single user
    timestamps = timestamps.filter(ts => now - ts < WINDOW_SIZE);

    // clean up for old timestams
    if (timestamps.length === 0) {
        requestsMap.delete(key);
    }

    if (timestamps.length >= MAX_REQUESTS) {
        return res.status(429).json({
            error: "Rate limit exceeded",
            retryAfter: "60 seconds"
        });
    }

    timestamps.push(now);
    requestsMap.set(key, timestamps);
    console.log(timestamps, "******************#####*************");

    next();
};
// first of all array will be check if size is < 5 then all push. so 5th req will push and after that block every other reqs.
