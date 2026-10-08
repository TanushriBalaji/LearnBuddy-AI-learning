const https = require('https');
const apiKey = 'AIzaSyDI1_4lre_ZEsC2xTdadisnvliviKkIUfs';

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log(json.models.map(m => m.name).join(', '));
    } catch (e) {
      console.log(data);
    }
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
