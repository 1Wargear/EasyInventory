/**
 * Fetches the floorplan with the specified heatmapoverley if enabled
 */
async function heatmap_loadMap() {
    const floorplanImage = document.getElementById('floorplanImage');
    const heatmapActive = document.getElementById('heatMapActive').checked;
    console.log(heatmapActive);

    if(!heatmapActive){
        floorplanImage.src = 'EasyInventory/data/floorplan.svg';
        return;
    }

    const heatmap = document.querySelector('input[name="heatMap"]:checked').value;
    console.log(heatmap);
    
    if(heatmap === 'itemCount'){
        floorplanImage.src = 'EasyInventory/data/floorplanHeatMapItemCount.svg';
    }
    if(heatmap === 'notifications'){
        floorplanImage.src = 'EasyInventory/data/floorplanHeatMapNotifications.svg';
    }
}
