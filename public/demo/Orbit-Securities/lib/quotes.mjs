import{proxyJson}from"#kit/orbit.mjs";import{useQuotesReader}from"#kit/stock-quotes.mjs";useQuotesReader((url,o)=>proxyJson(url,o));export*from"#kit/stock-quotes.mjs";
