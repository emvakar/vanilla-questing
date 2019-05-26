import axios from 'axios';

// ALLIANCE CONTENT
import human from '../routes/alliance/human.json';
import gnorf from '../routes/alliance/gnorf.json';
import nelf from '../routes/alliance/nelf.json';
import alliance_shared from '../routes/alliance/shared.json';
import alliance_quests from '../routes/alliance/quests.json';

// HORDE CONTENT
import trorc from '../routes/horde/trorc.json';
import tauren from '../routes/horde/tauren.json';
import undead from '../routes/horde/undead.json';
import horde_shared from '../routes/horde/shared.json';
import horde_quests from '../routes/horde/quests.json';

// DEVELOPMENT
import dev_route from '../routes/dev/route.json';
import dev_quests from '../routes/dev/quests.json';

// RACE SPECIFIC STARTERS
const races = {
   alliance: new Map([
      ['human', human],
      ['dwarf', gnorf],
      ['gnome', gnorf],
      ['nelf', nelf]
   ]),
   horde: new Map([
      ['orc', trorc],
      ['troll', trorc],
      ['tauren', tauren],
      ['undead', undead],
   ])
}

// ASSEMBLE JSON DATA
function route(race) {

   // PLACEHOLDER
   let content = {};

   // GENERATE ALLIANCE BUILD
   if (races.alliance.has(race)) {
      content = {
         quests: alliance_quests,
         route: {
            ...races.alliance.get(race),
            ...alliance_shared
         }
      }

   // GENERATE HORDE BUILD
   } else if (races.horde.has(race)) {
      content = {
         quests: horde_quests,
         route: {
            ...races.horde.get(race),
            ...horde_shared
         }
      }
   }

   // CONSTRUCT & RETURN DATA OBJECT
   return {
      quests: content.quests,
      route: content.route.path,
      hearthstones: hearthstones(content.route.path)
   }
}

// RANDOM ROUTE
function random() {

   // PICK A RACE RANDOMLY
   const collective = [ ...races.alliance.keys(), ...races.horde.keys() ];
   const race = Math.floor((Math.random() * collective.length) + 0);

   // CONSTRUCT BUILD
   const build = route(collective[race]);

   // RETURN FINALIZED BUILD
   return {
      data: build,
      current: Math.floor((Math.random() * build.route.length - 1) + 1)
   }
}

// SPECIFIC ROUTE
function specific({ icon, block }) {
   return route(icon).then(data => {
      return {
         data: data,
         current: block,
      }
   });
}

// IMPORTED DATASET
function custom(url, faction) {
   return axios.get(url).then(response => {

      let quests = {}

      if (faction === 'alliance') {
         quests = alliance_quests;
      } else {
         quests = horde_quests
      }

      return {
         data: {
            quests: quests,
            route: response.data.path,
            hearthstones: hearthstones(response.data.path)
         },
         current: 0
      }
   })
}

// DEVELOPMENT DATASET
function dev() {
   return {
      data: {
         quests: dev_quests,
         route: dev_route.path,
         hearthstones: hearthstones(dev_route.path)
      },
      current: 0
   }
}

// FIND HEARTHSTONE BLOCK INDEXES
function hearthstones(route) {
   const container = [];

   // ASSEMBLE LIST OF EACH 'SET HS' OCCURRENCE
   route.forEach((block, index) => {
      block.waypoints.forEach(waypoint => {
         if (waypoint.special !== undefined) {
            waypoint.special.forEach(message => {
               if (typeof message === 'string' && message.toLowerCase() === 'set hearthstone') {
                  container.push({
                     block: index,
                     zone: block.zone
                  });
               }
            });
         }
      });
   });

   return container;
}

// CHECK IF RACE EXISTS --- FORCE LOWERCASE
function exists(race) {

   // MAKE UNITED MAP
   const keys = new Map([
      ...races.alliance,
      ...races.horde
   ]);

   // PERFORM & RETURN CHECK
   return keys.has(race.toLowerCase())
}

export {
   random,
   specific,
   custom,
   dev,
   exists
}