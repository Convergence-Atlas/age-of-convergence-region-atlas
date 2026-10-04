import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';
const sha = bytes => crypto.createHash('sha1').update(Buffer.concat([Buffer.from('blob '+bytes.length+'\0'),bytes])).digest('hex');
const assert=(ok,message)=>{if(!ok)throw new Error(message);};
const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
assert(process.env.GITHUB_REF_NAME==='digimon-locations-20261004','Build is restricted to the atlas branch');
const input=JSON.parse(fs.readFileSync('digimon/studio/location-blueprint.json','utf8'));
input.regions=JSON.parse(fs.readFileSync('digimon/studio/Digimon_Regions_UPDATED.json','utf8'));
const catalog=fs.readFileSync('digimon/environment-art.json');
assert(sha(catalog)===input.artCatalogSha,'Source artwork catalog changed');
input.art=JSON.parse(catalog);
for(const board of input.sourceBoards){
  assert(/^[a-z0-9-]+\.png$/.test(board.name),'Invalid board name');
  assert(sha(fs.readFileSync(path.join('digimon',board.name)))===board.sha,'Source board changed: '+board.name);
}
const supplied=new Map(input.pictures.map(p=>[p.path.replace(/\.(jpg|webp)$/,''),p]));
const pictures=[];
for(const [location,a] of Object.entries(input.art)){
  for(const [area,ref] of [[null,a.overview],...Object.entries(a.areas)]){
    const basename=slug(location)+'/'+(area===null?'overview':slug(area));
    const p=supplied.get(basename);assert(p,'Missing scene '+basename);
    assert(/^[a-z0-9-]+\/[a-z0-9-]+\.(jpg|webp)$/.test(p.path),'Invalid picture path');
    const output=path.join('digimon/location-images',p.path);
    fs.mkdirSync(path.dirname(output),{recursive:true});
    const [x,y,w,h]=ref.viewBox;
    assert(x>=0&&y>=0&&w>0&&h>0&&x+w<=ref.width&&y+h<=ref.height,'Invalid extraction rectangle');
    if(!fs.existsSync(output)){
      assert(p.path.endsWith('.webp'),'A reusable JPEG was not supplied: '+p.path);
      execFileSync('convert',[path.join('digimon',ref.image),'-crop',w+'x'+h+'+'+x+'+'+y,'+repage','-define','webp:method=6','-quality','88',output],{stdio:['ignore','pipe','pipe']});
    }else if(p.path.endsWith('.jpg')){
      assert(sha(fs.readFileSync(output))===p.sha,'Reusable image changed: '+p.path);
    }
    const dimensions=execFileSync('identify',['-format','%w %h',output],{encoding:'utf8'}).trim();
    assert(dimensions===w+' '+h,'Wrong scene dimensions');
    const bytes=fs.readFileSync(output);
    pictures.push({...p,location,area,sourceBoard:ref.image,sourceRectangle:ref.viewBox,width:w,height:h,sha:sha(bytes),bytes:bytes.length,imageUrl:input.imageBase+p.path});
  }
}
assert(pictures.length===410,'Picture count');
input.pictures=pictures;

function buildLocations(input){
  const assert=(ok,message)=>{if(!ok)throw new Error(message);};
  const slug=s=>s.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
  const roles={};for(const [role,names]of Object.entries(input.roleGroups))for(const name of names)roles[name]=role;
  const photoMap=new Map(input.pictures.map(x=>[x.location+"\0"+(x.area??""),x]));
  const assignments=[];const world={};const originals=new Set(input.oldProfiles.map(x=>x.location));
  const factionSet=new Set(input.factions);const enemy=new Set(["Null Choir","Choir Silence Wing","Devimon's Black Gear Remnants","Etemon's Network","Myotismon's Court","Dark Masters","Emperor Control Remnants","Arukenimon and Mummymon","Daemon Corps","Diaboromon Copy Swarm","Apocalymon Echoes","Bagra Army","D-Reaper","Lucemon's Crusaders","Leviathan System","Yggdrasil System Enforcers","Blood Knights","A.o.A.","Eater Swarm","Analogman Remnants"]);
  const overrides={
    "Primary Village":["Nursery Covenant","File Island Defenders","Independent Digimon"],
    "Datamon Relay Hospital":["Datamon Relay Hospital Staff","Independent Digimon","Lantern Network"],
    "Choir's White Citadel":["Null Choir","Choir Mercy Wing","Choir Silence Wing","Choir Witness Wing"],
    "Bagra Fortress Border":["Bagra Army","Xros Heart","Blue Flare"],
    "Green Zone Assembly":["Xros Heart","Independent Digimon"],
    "D-Reaper Quarantine":["D-Reaper","Hypnos","Monster Makers","Tamers and Hypnos"],
    "DATS Headquarters":["DATS","Independent Digimon"],
    "Yggdrasil Access Frontier":["DATS","Royal Knights","Yggdrasil System Enforcers"],
    "Whamon Crossing":["Whamon Sea Routes","File Island Defenders","Digital Traders Guild"],
    "Aki's Lantern Workshop":["Lantern Network","Choir Witness Wing","Independent Digimon"],
    "Miracles Rescue Sanctuary":["Golden Digimental Pilgrims","Crest and Digimental Keepers","Nursery Covenant"],
    "Destiny Crossroads":["Golden Digimental Pilgrims","Crest and Digimental Keepers","First Light Interworld Accord"],
    "Core Identity Repository":["Homeostasis Custodians","Choir Witness Wing","Gennai's Agents"]
  };
  const specialEdges={
    "Yagami Apartment":[[3,0],[0,1],[1,2]],"Partner Quiet Room":[[3,0],[0,1],[1,2]],
    "Ichijouji Home":[[0,2],[2,1],[1,3]],"Primary Village":[[2,0],[0,1],[0,3]],
    "Fuji TV and Bay Observatory":[[0,3],[3,1],[3,2]],
    "Mount Infinity":[[0,1],[1,2],[2,3]],"Piedmon's Nightmare Keep":[[0,1],[1,2],[2,3]],
    "Spiral Mountain Echo":[[0,1],[1,2],[2,3]],"First Light Observatory":[[0,1],[1,2],[2,3]],
    "Deep Maintenance Threshold":[[0,1],[1,2],[2,3]],"Contradictory Bridge":[[0,1],[1,2],[2,3]],
    "Choir's White Citadel":[[0,1],[1,2],[2,3]],"Runaway Locomon Line":[[0,3],[3,1],[1,2]],
    "MetalSeadramon Ocean":[[2,0],[0,1],[0,3]],"Whamon Crossing":[[2,0],[2,1],[0,3]],
    "Digi-Egg Shrine of Hope and Light":[[0,2],[1,2],[2,3]],
    "Digi-Egg Shrine of Kindness":[[0,2],[1,2],[2,3]],"Destiny Crossroads":[[0,2],[1,2],[2,3]]
  };
  function image(loc,area,source,sourceArea){
    const p=photoMap.get(source+"\0"+(sourceArea??""));assert(p,"Missing picture "+source+" "+sourceArea);
    assignments.push({location:loc,area,sourceLocation:source,sourceArea,imagePath:p.path});
    return {establishingShot:{imageUrl:input.imageBase+p.path,crop:{focus:{x:50,y:50},zoom:100}}};
  }
  function add(name,region,role,source,intro,quest,keys,profile){
    assert(!world[name],"Duplicate location "+name);const r=input.regions[region];assert(r,"Unknown region "+region);
    assert(keys.length===4,"Area count "+name);const sourceKeys=Object.keys(input.art[source].areas);
    const graph=Object.fromEntries(keys.map(k=>[k,[]]));
    for(const [a,b]of specialEdges[name]??[[0,1],[1,2],[1,3]]){graph[keys[a]].push(keys[b]);graph[keys[b]].push(keys[a]);}
    let basic=intro+"\n\n"+input.roles[role];
    basic+="\n\nThe explorable stops are "+keys.join(", ")+". Meet only the actual available residents and cast members established by the active scene. A notice, rumor or picture is a lead; it does not spawn an item, opponent, relic or new partnership automatically.";
    if(!profile)basic+="\n\nThis is an original campaign exploration layout inspired by the named source. Established characters keep their own relationships, custody and dated history.";
    if(input.protocols[region])basic+="\n\n"+input.protocols[region];
    if(input.lore[name])basic+="\n\n"+input.lore[name];
    if(r.realm==="Archive Branches")basic+="\n\nEntry from the core world is locked until the source branch, era, authenticated coordinate, compatible protocol and working stabilizer are established. Record who is physically present or represented and maintain an independent return endpoint. A visit does not overwrite the Adventure/Adventure 02 present.";
    if(r.realm==="Network Realms")basic+="\n\nRealm entry is locked until a discovered threshold, compatible protocol and dependable return anchor are established. A normal street, beach, distress signal or Internet connection is not automatic passage.";
    if(r.realm==="Digital World"&&!input.protocols[region])basic+="\n\nThe core present follows Adventure 02. Original battles remain historical unless the story establishes a specific surviving threat or a deliberately dated expedition. This atlas joins campaign travel routes rather than claiming every adapted game landmark shares one exact television map.";
    const areas={};
    keys.forEach((key,i)=>{
      let scene=input.scenery[source][i];
      if(!profile)scene=scene.replaceAll("Koushiro's","the operator's").replaceAll("Elecmon","the nursery keeper").replaceAll("Ken's","the resident's").replaceAll("the siblings'","the residents'").replaceAll("careful observation of a living egg","a supervised quiet conversation");
      let description=scene+"\n\n"+input.areaTasks[role][i];
      if(i===1)description+=" A possible investigation here concerns this specific lead: "+quest;
      description+=" The local passages lead to "+graph[key].join(" and ")+". Follow actual doors, paths and access conditions rather than treating an area link as a teleport.";
      areas[key]={description,paths:graph[key],visualTags:[r.realm,region,name,key],images:image(name,key,source,sourceKeys[i])};
    });
    let factions=overrides[name]??r.factions.filter(f=>role==="fortress"||!enemy.has(f));
    assert(factions.length&&factions.every(f=>factionSet.has(f)),"Faction references "+name);
    let hidden=quest+"\n\nTurn this lead into a concrete current situation with an actual willing witness, object or measurable effect. Preserve source dates and distinguish direct observation from theory. The supported result can be repair, rescue, fair trade, negotiation, recovered evidence or a safe withdrawal; do not require every scene to end in combat.";
    if(role==="fortress"||role==="wilderness")hidden+="\n\nUse the current individual's recorded form, learned move subset, active attribute and defenses. Vaccine has advantage over Virus, Virus over Data, and Data over Vaccine; morality is separate. Terrain, metal bodies and boss labels do not add blanket immunities. Imposed control and recognition damage require separate diagnoses.";
    if(role==="nursery"||role==="training")hidden+="\n\nFresh and In-Training care follows the actual lineage. Once Rookie is earned it becomes the partner's recorded stable base for normal temporary evolutions. Reversion retains wounds, fatigue, status and spent power. Severe exhaustion, Gatomon's established Champion base and independent mature species keep their explicit exceptions.";
    const radius=["home","clinic","workshop"].includes(role)?1:["school","nursery","market","training","archive","shrine"].includes(role)?2:3;
    let min=r.npcLevelRange.min,max=r.npcLevelRange.max;
    if(["home","school","nursery","clinic"].includes(role)){min=1;max=Math.min(max,35);}
    world[name]={name,basicInfo:basic,x:profile?.x??0,y:profile?.y??0,radius,region,complexityType:"complex",detailType:"detailed",areas,factions,visualTags:[r.realm,region,name,role],hiddenInfo:hidden,known:profile?.known??r.known,npcLevelRange:{min,max},images:image(name,null,source,null)};
  }
  for(const p of input.oldProfiles)add(p.location,p.region,roles[p.location]??"archive",p.location,p.intro,input.oldQuests[p.location],Object.keys(p.areas),p);
  for(const [name,region,role,source,intro,quest,keys]of input.newProfiles)add(name,region,role,source,intro,quest,keys,null);
  const regionGroups={};for(const loc of Object.values(world))(regionGroups[loc.region]??=[]).push(loc);
  for(const locations of Object.values(regionGroups)){
    const occupied=locations.filter(l=>originals.has(l.name));
    let candidates=[];for(let x=-32;x<=32;x+=8)for(let y=-32;y<=32;y+=8)candidates.push([x,y]);
    for(const loc of locations.filter(l=>!originals.has(l.name))){
      let chosen=[0,0];
      if(occupied.length){
        const score=([x,y])=>Math.min(...occupied.map(o=>Math.hypot(x-o.x,y-o.y)-o.radius-loc.radius))-0.18*Math.hypot(x,y);
        chosen=candidates.reduce((a,c)=>score(c)>score(a)?c:a);
      }
      [loc.x,loc.y]=chosen;occupied.push(loc);candidates=candidates.filter(p=>p[0]!==chosen[0]||p[1]!==chosen[1]);
    }
  }
  assert(Object.keys(world).length===154,"Location total");assert(Object.keys(regionGroups).length===37,"Region coverage");
  let count=0,maxBasic=0,maxHidden=0,maxArea=0;const descriptions=new Set(),imageURLs=new Set();
  for(const [name,loc]of Object.entries(world)){
    assert(name===loc.name,"Name identity");assert(input.regions[loc.region],"Region reference");
    assert(typeof loc.known==="boolean","Known boolean");assert(Math.abs(loc.x)+loc.radius<=50&&Math.abs(loc.y)+loc.radius<=50,"Map bounds");
    assert(loc.npcLevelRange.min>=1&&loc.npcLevelRange.max<=90&&loc.npcLevelRange.min<=loc.npcLevelRange.max,"Level band");
    assert(loc.basicInfo.length<=4000&&loc.hiddenInfo.length<=4000,"Location field cap");
    maxBasic=Math.max(maxBasic,loc.basicInfo.length);maxHidden=Math.max(maxHidden,loc.hiddenInfo.length);
    const seen=new Set();const todo=[Object.keys(loc.areas)[0]];
    while(todo.length){const key=todo.pop();if(seen.has(key))continue;seen.add(key);todo.push(...loc.areas[key].paths);}
    assert(seen.size===4,"Disconnected graph");
    for(const [key,a]of Object.entries(loc.areas)){
      assert(a.description.length>=120&&a.description.length<=4000,"Area field cap");maxArea=Math.max(maxArea,a.description.length);
      assert(!descriptions.has(a.description),"Duplicate area description");descriptions.add(a.description);
      assert(a.paths.length>0&&new Set(a.paths).size===a.paths.length,"Area paths");
      assert(a.paths.every(k=>k!==key&&loc.areas[k]?.paths.includes(key)),"Reciprocal valid paths");
      imageURLs.add(a.images.establishingShot.imageUrl);count++;
    }
    imageURLs.add(loc.images.establishingShot.imageUrl);
    if(originals.has(name)){const p=input.oldProfiles.find(p=>p.location===name);assert(JSON.stringify(Object.keys(p.areas))===JSON.stringify(Object.keys(loc.areas)),"Original area keys");assert(p.x===loc.x&&p.y===loc.y,"Original map anchor");}
  }
  for(const locations of Object.values(regionGroups))for(let i=0;i<locations.length;i++)for(let j=i+1;j<locations.length;j++){const a=locations[i],b=locations[j];if(originals.has(a.name)&&originals.has(b.name))continue;assert(Math.hypot(a.x-b.x,a.y-b.y)>a.radius+b.radius,"New map overlap");}
  assert(count===616&&imageURLs.size===410&&assignments.length===770,"Area or picture count");
  const text=JSON.stringify(world,null,2)+"\n";assert(text.length<=2000000,"Section cap");JSON.parse(text);
  return {world,text,assignments,report:{locations:154,areas:616,originalLocationsPreserved:82,originalAreaKeysPreserved:328,regions:37,imageAssignments:770,distinctImages:410,characters:text.length,characterLimit:2000000,maxBasicInfo:maxBasic,maxHiddenInfo:maxHidden,maxAreaDescription:maxArea,fieldLimit:4000,connectedReciprocalAreaGraphs:true,validRegionAndFactionReferences:true,originalMapAnchorsPreserved:true,newMapOverlaps:0}};
}
const result=buildLocations(input);
fs.writeFileSync('digimon/studio/Digimon_Locations_UPDATED.json',result.text);
fs.writeFileSync('digimon/studio/locations-validation.json',JSON.stringify(result.report,null,2)+'\n');
fs.writeFileSync('digimon/location-images/manifest.json',JSON.stringify(pictures,null,2)+'\n');
fs.writeFileSync('digimon/location-images/studio-assignments.json',JSON.stringify({campaign:input.campaign,locations:154,areas:616,assignments:result.assignments},null,2)+'\n');
console.log(JSON.stringify({...result.report,pictureBytes:pictures.reduce((n,p)=>n+p.bytes,0)},null,2));
