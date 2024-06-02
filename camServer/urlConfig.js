let serverUrl;

if (process.env.NODE_ENV === "production") {
  serverUrl = "https://crime-monitoring-backend.vercel.app/";
} else {
  serverUrl = "http://localhost:3001";
}

let clientUrl;

if (process.env.NODE_ENV === "production") {
  clientUrl = "https://crime-monitoring-frontend.vercel.app";
} else {
  clientUrl = "http://localhost:3000";
}

module.exports = { serverUrl, clientUrl };