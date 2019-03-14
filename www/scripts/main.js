

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

        } else  if (page.matches('#route-desc-page')) {


            let route = getRoute(page.data.route);

            page.querySelector('.route-desc-title-span').innerHTML = route.title;
            page.querySelector('.route-desc-length-span').innerHTML = route.length;
            page.querySelector('.route-desc-numStations-span').innerHTML = route.numStations;
            page.querySelector('.route-desc-duration-span').innerHTML = route.duration;
            page.querySelector('.route-desc-description').innerHTML = route.description;

            page.querySelector('.route-desc-map').setAttribute("style", "background-image: url('" + route.mapPreview + "')")

            page.querySelector('.map-button').onclick = function() {
                bringPageTop('route-map-template', {data:{route: page.data.route}});
            };

        } else if (page.matches('#route-map-page')) {

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

            else if(page == 'text-view-template')
                existingPageIndex = findPageInNav(nav, '#text-view-page', function(data) {
                    return data.text == options.data.text;
                });

            console.log("index to use: " + existingPageIndex);
            console.log(nav.pages[existingPageIndex]);
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






