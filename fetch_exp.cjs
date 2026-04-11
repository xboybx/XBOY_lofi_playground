const https = require('https');
https.get('https://www.jjaswanth.in/', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const matches = data.match(/src="(\/assets\/index-[^"]+\.js)"/);
    if (matches) {
      https.get('https://www.jjaswanth.in' + matches[1], (res2) => {
        let jsData = '';
        res2.on('data', chunk => jsData += chunk);
        res2.on('end', () => {
          const expMatch = jsData.match(/experiences?/i);
          if (expMatch) {
            console.log(jsData.substring(Math.max(0, expMatch.index - 500), expMatch.index + 2000));
          } else {
            console.log("Not found experience string");
          }
        });
      });
    } else {
      console.log('No JS found in ', data);
    }
  });
});
