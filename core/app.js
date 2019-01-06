// FETCH NEEDED MODULES
var func = require('./modules/func.js');
var map = require('./modules/map.js');
var events = require('./modules/events.js');
var build = require('./modules/build.js');
var storage = require('./modules/storage.js');
var render = require('./modules/render.js');

// START THE LOADING PROMPT
func.loading();

// GLOBAL SETTINGS OBJECT
var settings = {
   background: {
      width: 1440,
      height: 960
   },
   storage: 'vanilla-questing',
   cooldown: 1000,
   moving: false,
   lastevent: null
}

// CALIBRATE SELECTOR SIZES & CENTER MAP
settings = func.calibrate(settings);
map.position(settings);

// CHECK STORAGE
storage.check(settings.storage);

// RECALIBRATE & CENTER AGAIN IF WINDOW SIZE CHANGES
window.onresize = () => {
   settings = func.calibrate(settings);
   map.position(settings);
}

// ADD VARIOUS EVENTS
events.move_map(settings);
events.map_highlight();
events.submenu();
events.log_menu();
events.preload(func);
events.new_profile(func, storage, render, build);
events.load(render, build, func);

// RENDER RANDOM BLOCK ON LOAD
build.random().then((data) => {

   // RENDER A RANDOM BLOCK & ENABLE BROWSING ON LOAD
   render.map(data);
   events.browsing(data, render, settings, storage);

   // CLOSE THE LOADING PROMPT AFTER 1s
   sleep(settings.cooldown).then(() => { func.close_prompt(); });
});