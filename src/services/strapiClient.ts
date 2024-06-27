import { createClient, StrapiClientOptions } from '@kmariappan/strapi-client-js';

const options: StrapiClientOptions = {
  url: `${import.meta.env.REACT_APP_BASE_URL_STRAPI}/api`,
  apiToken: `${import.meta.env.REACT_APP_TOKEN_GLOBAL_STRAPI}`,
  normalizeData: true,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    credentials: 'include',
    'Access-Control-Allow-Origin': '*'
    // 'Access-Control-Allow-Credentials': true
  },
  persistSession: false // Persist authenticated token in browser local storage. default -false
};

export const strapiClient = createClient(options);
