export const onRequestPost=async(context)=>{
  const {env}=context;const model=env.GEMINI_MODEL||"gemini-2.5-flash-preview-05-20";const key=env.GEMINI_API_KEY;
  if(!key)return new Response(JSON.stringify({error:"Missing GEMINI_API_KEY"}),{status:503});
  const r=await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({contents:[{parts:[{text:"Forge a mythic name"}]}]})});
  if(!r.ok)return new Response(JSON.stringify({error:"upstream"}),{status:502});
  const j=await r.json();let name="The Void Gazes Back";if(j?.candidates?.[0]?.content?.parts?.[0]?.text){name=j.candidates[0].content.parts[0].text.trim();}
  return new Response(JSON.stringify({name,model}),{headers:{"content-type":"application/json"}});
};