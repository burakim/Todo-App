// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = '77xmbm6n0g'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'burakim.auth0.com',            // Auth0 domain
  clientId: 'pv4IkmC4Z4DJMWnr6WHzrvCAZemFC801',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
// https://77xmbm6n0g.execute-api.us-east-1.amazonaws.com/dev/todos