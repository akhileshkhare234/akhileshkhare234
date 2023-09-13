const env = "testing";
// const env='production';
//const env='development';
export const envmode = { env, title: "Test Environment" };
const config = {
  testing: {
    APIUrl: "http://ec2-18-189-200-115.us-east-2.compute.amazonaws.com:8080/",
    LocalUrl: "http://ec2-18-189-200-115.us-east-2.compute.amazonaws.com/",
  },
  production: {
    APIUrl: "http://ec2-3-19-12-229.us-east-2.compute.amazonaws.com:8080/",
    LocalUrl: "http://ec2-3-19-12-229.us-east-2.compute.amazonaws.com/",
  },
  development: {
    APIUrl: "http://localhost:8080/",
    LocalUrl: "http://localhost:3000/",
  },
};
export const APIUrl = config[env].APIUrl;
export const LocalUrl = config[env].LocalUrl;

export const GOOGLE_AUTH_URL =
  APIUrl + "oauth2/authorization/google?redirect_uri=" + LocalUrl;
