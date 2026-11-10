import{detectLang}from"#kit/orbit.mjs";export const lang=typeof document>"u"?"zh":detectLang(),en=lang==="en",W=(zh,english)=>en?english:zh;
