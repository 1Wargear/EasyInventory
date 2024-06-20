/**
 * The global Variable keeps track wether the header is currently expanded or not in small screen mode
 */
let isHeaderExpanded = false;
/**
 * The global Variable keeps track of the current image map areas on screen
 */
const mapAreas = [];

/**
 * Toggles the headers expansion state based
 */
function response_expandHeader() {
    if(isHeaderExpanded) {
        document.getElementById('mainNav').classList.remove('collapse');
        document.getElementById('headerBtns').classList.remove('collapse');
    } 
    else {
        document.getElementById('mainNav').classList.add('collapse');
        document.getElementById('headerBtns').classList.add('collapse');
    }
    isHeaderExpanded = !isHeaderExpanded;
}

/**
 * Automatticaly expands the header if the screen is wide enought
 */
function response_autoToogle() {
    isHeaderExpanded = window.innerWidth > 800;
    response_expandHeader();
}

/**
 * Initializes the map areas with the percentages from the area elements on screen
 */
function response_initMap() {
    const areas = document.querySelectorAll('area');
    areas.forEach(element => {
        mapAreas.push(element.coords.split(','));
    });
}

/**
 * Scales the map areas to match different screen sizes based on the percentages and the scaling factor of the respective axis
 */
function response_resizeMap() {
    const areas = document.querySelectorAll('area');

    if(document.getElementById('floorplanImage') === null)
        return;

    const xFactor = document.getElementById('floorplanImage').clientWidth * 0.01;
    const yFactor = document.getElementById('floorplanImage').clientHeight * 0.01;
    let i = 0;
    areas.forEach(element => {
        const oldCoords = mapAreas[i++];
        element.coords = `${oldCoords[0] * xFactor},${oldCoords[1] * yFactor},${oldCoords[2] * xFactor},${oldCoords[3] * yFactor}`;
    });
}

/**
 * Wraper for all functions that need to respond to screen size changes
 */
function response_respond(){
    response_autoToogle();
    response_resizeMap();
}

window.onresize = response_respond;
window.onload = response_respond;