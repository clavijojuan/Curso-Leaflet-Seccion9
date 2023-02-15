
const bounds = L.latLngBounds([
    [13.274277, -80.067026],
    [-5.100372, -65.924605],
]);

const pathDefecto = {
    color: 'black'
}

const pathGrupo =  {
    color: 'red'
}

const divIcon = L.divIcon({
    className: 'fa-solid fa-heart myDivIcon',
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30]
})

const map = L.map('map', {
    minZoom:6,
    maxZoom:22,
    center: [4.881729, -73.437706],
    maxBounds: bounds
})

map.fitBounds(bounds);

const scale = L.control.scale({
    position: 'bottomright'
}).addTo(map)

const baseMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxNativeZoom: 19,
    maxZoom: 22,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const darkMap = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png', {
	maxNativeZoom: 20,
    maxZoom: 22,
	attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
});

const group = L.featureGroup().addTo(map);

group.on('layeradd', (evento) => {
    const { layer } = evento;
    if(layer?.dragging){
        layer.setIcon(divIcon)
    }
    else {
        layer.setStyle(pathGrupo)
    }
})

const baseLayers = {
    "Streets": baseMap,
    "Dark": darkMap,
}

const overlays = {
    "Feature Group": group
}

const controlLayers = L.control.layers( baseLayers, overlays, {
    collapsed: false
} ).addTo(map);


const crearCapa = (latlng, type, grouped) => {
    let layer;

    if( type === 'marker' ) layer = L.marker(latlng, { draggable: true });
    else if( type === 'circleMarker') layer = L.circleMarker(latlng, { ...pathDefecto });
    else if( type === 'polygon' ) layer = L.polygon(latlng, { ...pathDefecto });
    else if( type === 'polyline') layer = L.polyline(latlng, { ...pathDefecto });

    if(grouped){
        group.addLayer(layer);
    }
    else {
        layer.addTo(map);
        controlLayers.addOverlay(layer, type);
    }
    layer.bindTooltip(type);
    crearPopup(layer, grouped);
}


const crearPopup = (layer, grouped) => {

    const contenedor = document.createElement('div');
    contenedor.classList.add('popupContent');

    const grupoBtn = document.createElement('button');
    const capaBtn = document.createElement('button');
    const cancelarBtn = document.createElement('button');

    cancelarBtn.classList.add('cancelar');
    grupoBtn.classList.add('proceso');
    capaBtn.classList.add('proceso');

    cancelarBtn.innerText = 'Cancelar';
    grupoBtn.innerText = 'GeoJSON del grupo';
    capaBtn.innerText = 'GeoJSON de la capa';

    const contenedorBotones = document.createElement('div');
    contenedorBotones.append(cancelarBtn);
    if( grouped ) contenedorBotones.append(grupoBtn);
    contenedorBotones.append(capaBtn);

    const div = document.createElement('div');
    div.innerText = '¿Qué proceso desea realizar?'

    contenedor.append(div);
    contenedor.append(contenedorBotones);

    cancelarBtn.addEventListener('click', () => {
        layer.closePopup();
    })

    capaBtn.addEventListener('click', () => {
        sidebar.innerText = JSON.stringify(layer.toGeoJSON()); 
    })

    grupoBtn.addEventListener('click', () => {
        sidebar.innerText = JSON.stringify(group.toGeoJSON());
    })

    layer.bindPopup(contenedor);
}