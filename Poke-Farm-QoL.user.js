// ==UserScript==
// @name         Poké Farm QoL NEW
// @namespace    https://github.com/KaizokuBento/
// @author       Bentomon
// @homepage	 https://github.com/KaizokuBento/PokeFarmShelter
// @downloadURL  https://github.com/KaizokuBento/PokeFarmShelter/raw/master/Poke-Farm-QoL.user.js
// @description  Quality of Life changes to Pokéfarm!
// @match        https://pokefarm.com/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/lodash/lodash/4.17.4/dist/lodash.min.js
// @resource     QoLSettingsMenuHTML    https://raw.githubusercontent.com/KaizokuBento/PokeFarmQoL/Test/resources/templates/qolSettingsMenuHTML.html
// @resource     shelterSettingsHTML    https://raw.githubusercontent.com/KaizokuBento/PokeFarmQoL/Test/resources/templates/shelterOptionsHTML.html
// @resource     QoLCSS                 https://raw.githubusercontent.com/KaizokuBento/PokeFarmQoL/Test/resources/css/pfqol.css
// @updateURL    https://github.com/KaizokuBento/PokeFarmQoL/raw/Test/Poke-Farm-QoL.user.js
// @version      0.0.2
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==


(function($) {
    'use strict';
    /////////////////////////////////////
    // Welcome to my first ever script!//
    // Let's hope everything works~    //
    /////////////////////////////////////

	let PFQoL = (function PFQoL() {

		const DEFAULT_USER_SETTINGS = { // default settings when the script gets loaded the first time
			//userscript settings
			shelterEnable: true,
			//shelter settings
			shelterSettings : {
				findCustom: "",
				findNewEgg: true,
				findNewPokemon: true,
				findShiny: true,
				findAlbino: true,
				findMelanistic: true,
				findPrehistoric: true,
				findDelta: true,
				findMega: true,
				findStarter: true,
				findCustomSprite: true,
				findMale: true,
				findFemale: true,
				findNoGender: true,
			}
		};

		const SETTINGS_SAVE_KEY = 'QoLSettings'; // the name of the local storage

		const VARIABLES = { // all the variables that are going to be used in fn
			userSettings : DEFAULT_USER_SETTINGS,
			
			i : 0,
			
			shelterSearch : [ //div class forme (alolan || totem) || Apocalyptic  pokemon || species? ||
				"findCustom", "",
				"findNewEgg", "egg",
				"findNewPokemon", "Pokémon",
				"findShiny", "[SHINY]",
				"findAlbino","[ALBINO]",
				"findMelanistic", "[MELANISTIC]",
				"findPrehistoric", "[PREHISTORIC]",
				"findDelta", "/_delta/", //[DELTA-FIRE] [DELTA-GHOST]
				"findMega", "[MEGA]",
				"findStarter", "[STARTER]",
				"findCustomSprite", "[CUSTOM SPRITE]",
				"findMale", "[M]",
				"findFemale", "[F]",
				"findNoGender", "[N]", 
			],
			
			shelterSearchSucces : [
			],
		}

		const TEMPLATES = { // all the new/changed HTML for the userscript
			headerSettingsLinkHTML	: `<a href=https://pokefarm.com/farm#tab=1>QoL Userscript Settings</a href>`,
			qolSettingsMenuHTML		: GM_getResourceText('QoLSettingsMenuHTML'),
			shelterSettingsHTML		: GM_getResourceText('shelterSettingsHTML'),
		}

		const OBSERVERS = {
			shelterObserver() {
				//observe change in shelterarea, function goes to fast to search for pokemon.
			}
		}

		const fn = { // all the functions for the script
			helpers: {
				toggleSetting(key, set = false) {
                    if (typeof set === 'boolean') {
                        let element = document.querySelector(`.qolsetting[data-key="${key}"]`);
                        if (element && element.type === 'checkbox') {
                            element.checked = set;
                        }
                    }
					if (typeof set === 'string') {
                        let element = document.querySelector(`.qolsetting[data-key="${key}"]`);
                        if (element && element.type === 'text') {
                            element.value = set;
                        }
                    }
					
                },
				
			},
			/** background stuff */
			backwork : { // backgrounds tuff
				loadSettings() { // initial settings on first run and setting the variable settings key
					if (localStorage.getItem(SETTINGS_SAVE_KEY) === null) {
						fn.backwork.saveSettings();
					} else if (localStorage.getItem(SETTINGS_SAVE_KEY) != VARIABLES.userSettings) {
						VARIABLES.userSettings = JSON.parse(localStorage.getItem(SETTINGS_SAVE_KEY));
					}
				},
				saveSettings() { // Save changed settings
					localStorage.setItem(SETTINGS_SAVE_KEY, JSON.stringify(VARIABLES.userSettings));
				},
				populateSettingsPage() {
                    for (let key in VARIABLES.userSettings) {
                        if (!VARIABLES.userSettings.hasOwnProperty(key)) {
                            continue;
                        }
                        let value = VARIABLES.userSettings[key];
                        if (typeof value === 'boolean') {
                            fn.helpers.toggleSetting(key, value, false);
                            continue;
                        }

                       if (typeof value === 'string') {
                            fn.helpers.toggleSetting(key, value, false);
                            continue;
					   }
                    }
					for (let key in VARIABLES.userSettings.shelterSettings) {
                        if (!VARIABLES.userSettings.shelterSettings.hasOwnProperty(key)) {
                            continue;
                        }
                        let value = VARIABLES.userSettings.shelterSettings[key];
                        if (typeof value === 'boolean') {
                            fn.helpers.toggleSetting(key, value, false);
                            continue;
                        }

                       if (typeof value === 'string') {
                            fn.helpers.toggleSetting(key, value, false);
                            continue;
					   }
                    }
                },
				
				setupHTML() { // injects the HTML changes from TEMPLATES into the site

					// Header link to Userscript settings
					document.querySelector('#head-right').insertAdjacentHTML('beforebegin', TEMPLATES.headerSettingsLinkHTML);

					// QoL userscript Settings Menu in farmnews
					if(window.location.href.indexOf("farm#tab=1") != -1){ // Creating the QoL Settings Menu in farmnews
						document.querySelector('#farmnews').insertAdjacentHTML("afterbegin", TEMPLATES.qolSettingsMenuHTML);
						fn.backwork.populateSettingsPage();
					}

					// shelter Settings Menu
					if (VARIABLES.userSettings.shelterEnable === true && window.location.href.indexOf("shelter") != -1) {
						document.querySelector("#shelterupgrades").insertAdjacentHTML("afterend", TEMPLATES.shelterSettingsHTML);
						document.querySelector("#shelteroptionsqol").insertAdjacentHTML("beforebegin", "<h3>QoL Settings</h3>");
						document.querySelector('#sheltercommands').insertAdjacentHTML('beforebegin', "<div id='sheltersuccess'></div>");
						fn.backwork.populateSettingsPage();
					}
				},
				setupCSS() { // All the CSS changes are added here
					GM_addStyle(GM_getResourceText('QoLCSS'));
				},

				startup() { // All the functions that are run to start the script on Pokéfarm
					return {
						'loading Settings'	: fn.backwork.loadSettings,
						'setting up CSS'	: fn.backwork.setupCSS,
						'setting up HTML' 	: fn.backwork.setupHTML,
					}
				},
				init() { // Starts all the functions.
					console.log('Starting up ..');
					let startup = fn.backwork.startup();
					for (let message in startup) {
						if (!startup.hasOwnProperty(message)) {
							continue;
						}
						console.log(message);
						startup[message]();
					}
				},
			}, // end of backwork

			/** public stuff */
			API : { // the actual seeable and interactable part of the userscript
				settingsChange(element, textElement) {
					if (JSON.stringify(VARIABLES.userSettings).indexOf(element) >= 0) { // userscript settings
						if (VARIABLES.userSettings[element] === false ) {
							VARIABLES.userSettings[element] = true;
						} else if (VARIABLES.userSettings[element] === true ) {
							VARIABLES.userSettings[element] = false;
						} else if (typeof VARIABLES.userSettings[element] === 'string') {
							VARIABLES.userSettings[element] = textElement;
						}
					} 
					if (JSON.stringify(VARIABLES.userSettings.shelterSettings).indexOf(element) >= 0) { // shelter settings
						if (VARIABLES.userSettings.shelterSettings[element] === false ) {
							VARIABLES.userSettings.shelterSettings[element] = true;
						} else if (VARIABLES.userSettings.shelterSettings[element] === true ) {
							VARIABLES.userSettings.shelterSettings[element] = false;
						} else if (typeof VARIABLES.userSettings.shelterSettings[element] === 'string') {
							VARIABLES.userSettings.shelterSettings[element] = textElement;
						}
					}
					fn.backwork.saveSettings();
				},
				
				shelterCustomSearch() { 
					const shelterValueArray = [];
					VARIABLES.shelterSearch[1] = VARIABLES.userSettings.shelterSettings.findCustom; //change customsearch in array to find what you need
					document.querySelector('#sheltersuccess').innerHTML="";
					
					for (let key in VARIABLES.userSettings.shelterSettings) { //loop runs till all sheltersettings are found (14)
						let value = VARIABLES.userSettings.shelterSettings[key];
						if (value === true || value != "") { //creates an array of items that should be found
							if (VARIABLES.shelterSearch.indexOf(key) >=0) {
								var searchKey = VARIABLES.shelterSearch[VARIABLES.shelterSearch.indexOf(key) + 1];
								shelterValueArray.push(searchKey);
							}
						}
					}
					;
					for (let key in shelterValueArray) {
						let value = shelterValueArray[key];
						if (value.startsWith("[")) {
							if ($("img[title*='"+value+"']").length) {  //img[TITLE] search. Shiny, Albino, Melanistic, Prehistoric, Mega, Starter, Custom Sprite & Gender search
								console.log($("img[title*='"+value+"']").length+" - "+value+" found");
								let result = $("img[title*='"+value+"']").length+" - "+value+" found";
								document.querySelector('#sheltersuccess').insertAdjacentHTML('beforeend',"<div>"+result+"</div>");
							}
						}	
					}
					

					console.log("1. create array. "+shelterValueArray.length+" - "+shelterValueArray);
					//console.log("2. create searchkeys. "+searchKey+" - "+searchKey);
				}, // end of shelterCustomSearch
			}, // end of API
		}; // end of fn

		fn.backwork.init();

		return fn.API;
	})(); // end of PFQoL function

	$(document).on('input', '.qolsetting', (function() {
		PFQoL.settingsChange(this.getAttribute('data-key'), $(this).val());
	}));
	
	$(document).on('change', 'input', (function() {
		PFQoL.shelterCustomSearch();
	}));
	
	$(document).on('click', '#sheltercommands ,#shelterarea', (function() {
		PFQoL.shelterCustomSearch();
	}));

})(jQuery); //end of userscript