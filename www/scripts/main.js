

(function() {
    'use strict';

    mapboxgl.accessToken = 'pk.eyJ1Ijoicm9ld2Vuc3RydW5rIiwiYSI6ImNqczRrYXF1aTAzMHg0YXBjMnY3YjhlZ2UifQ.66lXPOMIIaOYodE8TenWrg';

    // Page init event
    document.addEventListener('init', function(event) {
        let page = event.target;


        /*  Home Button on every page  */
        if (!page.matches('#start-page')) {
            page.querySelector('.home-button').onclick = function() {
                bringPageTop('start-template');
            };

            if(page.querySelector('.back-button')) {
                page.querySelector('.back-button').onclick = function () {
                    popPage();
                };
            }
        }


        if (page.matches('#start-page')) {

            page.querySelector('#tutti-button').onclick = function() {
                bringPageTop('route-desc-template', {data:{route:'tutti'}});
            };
            page.querySelector('#mezzo-button').onclick = function() {
                bringPageTop('route-desc-template', {data:{route:'mezzo'}});
            };
            page.querySelector('#piccolo-button').onclick = function() {
                bringPageTop('route-desc-template', {data:{route:'piccolo'}});
            };

            page.querySelector('#info-button').onclick = function() {
                bringPageTop('text-view-template', {data:{text:'info'}});
            };
            page.querySelector('#impressum-button').onclick = function() {
                bringPageTop('text-view-template', {data:{text:'credits'}});
            };

        }
        else if (page.matches('#route-desc-page')) {


            let route = getRoute(page.data.route);

            page.querySelector('.route-desc-title-span').innerHTML = route.title;
            page.querySelector('.route-desc-length-span').innerHTML = route.length;
            page.querySelector('.route-desc-numStations-span').innerHTML = route.numStations;
            page.querySelector('.route-desc-duration-span').innerHTML = route.duration;
            page.querySelector('.route-desc-description').innerHTML = route.description;

            page.querySelector('.route-desc-map').setAttribute("style", "background-image: url('" + route.mapPreview + "')");

            page.querySelector('.route-desc-map-play').onclick = function() {
                bringPageTop('station-template', {data:{route: page.data.route, station: 0}});
            }

            page.querySelector('.map-button').onclick = function() {
                bringPageTop('route-map-template', {data:{route: page.data.route}});
            }

        }
        else if (page.matches('#station-page')) {


            let route = getRoute(page.data.route);
            let station = route.stations[page.data.station];

            page.querySelector('.next-station-button').onclick = function() {
                let nextStation = (route.stations.length > page.data.station + 1?page.data.station + 1:0);
                bringPageTop('station-template', {data:{route: page.data.route, station: nextStation}});
            }

            page.querySelector('.station-title-span').innerHTML = station.title;
            page.querySelector('.station-description').innerHTML = station.text;
            page.querySelector('.station-quotes').innerHTML = station.source;

            page.querySelector('.station-img').setAttribute("style", "background-image: url('" + station.img + "')");

            page.querySelector('.ear-audio').src = station.textAudio;

            let stopVoiceFn = null;
            let playVoiceFn = function() {
                page.querySelector('.ear-button').setAttribute("style", "background-image: url('img/NoEar.png')");
                page.querySelector('.ear-audio').play();
                page.querySelector('.ear-button').onclick = stopVoiceFn;
            };

            stopVoiceFn = function() {
                page.querySelector('.ear-button').setAttribute("style", "background-image: url('img/Ear.png')");
                page.querySelector('.ear-audio').pause();
                page.querySelector('.ear-audio').currentTime = 0;
                page.querySelector('.ear-button').onclick = playVoiceFn;
            };

            page.querySelector('.ear-button').onclick = playVoiceFn;

            page.querySelector('.ear-audio').ontimeupdate = function() {
                let time = "";
                if(this.currentTime > 0) {
                    let sec = (Math.floor(this.duration) - Math.floor(this.currentTime))
                    time = "0:" + (sec < 10?"0":"") + sec;
                }
                page.querySelector('.ear-time').innerHTML = time;
            }

            page.querySelector('.ear-audio').onended = function() {
                page.querySelector('.ear-button').setAttribute("style", "background-image: url('img/Ear.png')");
                page.querySelector('.ear-button').onclick = playVoiceFn;
                page.querySelector('.ear-time').innerHTML = "";
            }


            if(station.audioFile != null) {

                page.querySelector('.notes-text-button').setAttribute("style", "visibility: visible");

                console.log(page.querySelector('.audio-player'));


                page.querySelector('.audio-player').onloadedmetadata = function() {
                    let min = Math.floor(this.duration / 60.0);
                    let sec = (min > 0?Math.round((this.duration / 60.0) % min * 60.0):Math.round((this.duration / 60.0) * 60.0));
                    page.querySelector('.station-audio-player-time-total').innerHTML = min + ":" + (sec < 10?"0":"") + sec;
                    page.querySelector('.station-audio-player-time-current').innerHTML = "0:00";
                }

                page.querySelector('.audio-player').ontimeupdate = function() {

                    let time = "0:00";
                    let percent = 0;
                    if(this.currentTime > 0) {
                        let min = Math.floor(this.currentTime / 60.0);
                        let sec = (min > 0?Math.round((this.currentTime / 60.0) % min * 60.0):Math.round((this.currentTime / 60.0) * 60.0));
                        time = min + ":" + (sec < 10?"0":"") + sec;

                        percent = this.currentTime / this.duration * 100.0;
                    }


                    page.querySelector('.station-audio-player-time-current').innerHTML = time;
                    page.querySelector('.station-audio-player-slider-foreground').setAttribute("style", "width: " + percent + "%;");
                }
                page.querySelector('.audio-player').src = station.audioFile;

                let stopAudioFn = null;
                let playAudioFn = function() {
                    page.querySelector('.station-audio-button').setAttribute("style", "background-image: url('img/Pause.png')");
                    page.querySelector('.audio-player').play();
                    page.querySelector('.station-audio-button').onclick = stopAudioFn;
                };

                stopAudioFn = function() {
                    page.querySelector('.station-audio-button').setAttribute("style", "background-image: url('img/Play.png')");
                    page.querySelector('.audio-player').pause();
                    page.querySelector('.station-audio-button').onclick = playAudioFn;
                };

                page.querySelector('.station-audio-button').onclick = playAudioFn;

                let switchToText = null;
                let switchToAudio = function () {
                    stopVoiceFn();
                    page.querySelector('.notes-text-button').setAttribute("style", "visibility: visible; background-image: url('img/Text.png')");
                    page.querySelector('.ear-button').setAttribute("style", "display: none");
                    page.querySelector('.station-content').hidden = true;
                    page.querySelector('.station-audio').setAttribute("style", "display: block");

                    page.querySelector('.notes-text-button').onclick = switchToText;
                };

                switchToText = function () {
                    page.querySelector('.notes-text-button').setAttribute("style", "visibility: visible; background-image: url('img/Notes.png')");
                    page.querySelector('.ear-button').setAttribute("style", "display: inline-block");
                    page.querySelector('.station-audio').setAttribute("style", "display: none");
                    page.querySelector('.station-content').hidden = false;

                    page.querySelector('.notes-text-button').onclick = switchToAudio;
                }

                page.querySelector('.notes-text-button').onclick = switchToAudio;


                page.querySelector('.station-audio-composer').innerHTML = station.audioComposer;
                page.querySelector('.station-audio-title').innerHTML = station.audioTitle;
                page.querySelector('.station-audio-label').innerHTML = station.audioLabel;

            }

            page.querySelector('.map-button').onclick = function() {
                bringPageTop('route-map-template', {data:{route: page.data.route, station: 0}});
            };

        }
        else if (page.matches('#route-map-page')) {

            let route = getRoute(page.data.route);

            let map = new mapboxgl.Map({
                container: page.querySelector('.map'),
                style: 'mapbox://styles/mapbox/streets-v11',
                center: [8.8790541, 51.9352382],
                zoom: 15
            });

            window.map = {
                instance: map,
                route: route
            };

            map.addControl(new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            }));

            map.on('load', function () {

                map.addLayer(route.geomap);
            });
        }
    });

    /* ROUTES */
    function getRoute(routeId) {

        let route = null;

        window.appData.routes.forEach(function(value) {
            if(value.route === routeId)
                route = value;
        });

        return route;
    }

    function bringPageTop(page, options) {

        let nav = document.querySelector('#navigator');

        if(page == 'start-template') {
            nav.bringPageTop('start-template');

        } else {

            let existingPageIndex = -1;


            if(page == 'route-desc-template')
                existingPageIndex = findPageInNav(nav, '#route-desc-page', function(data) {
                    return data.route == options.data.route;
                });

            else if(page == 'route-map-template')
                existingPageIndex = findPageInNav(nav, '#route-map-page', function(data) {
                    return data.route == options.data.route;
                });

            else if(page == 'station-template')
                existingPageIndex = findPageInNav(nav, '#station-page', function(data) {
                    return data.route == options.data.route && data.station == options.data.station;
                });

            else if(page == 'text-view-template')
                existingPageIndex = findPageInNav(nav, '#text-view-page', function(data) {
                    return data.text == options.data.text;
                });

//            console.log("index to use: " + existingPageIndex);
//            console.log(nav.pages[existingPageIndex]);
            if(existingPageIndex > -1)
                nav.bringPageTop(existingPageIndex);
            else
                nav.pushPage(page, options);
        }
    }

    function findPageInNav(nav, pageName, dataCheckFn) {
        let existingPageIndex = -1;
        nav.pages.forEach(function(p, i) {

            if(p.matches(pageName) && dataCheckFn(p.data)) {
                existingPageIndex = i;
            }
        });

        return existingPageIndex;
    }

    function popPage() {

        let nav = document.querySelector('#navigator');

        if(nav.pages.length > 1)
            nav.bringPageTop(nav.pages.length - 2);
    }

})();






