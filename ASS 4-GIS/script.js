const map = L.map('map').setView([-6.921, 106.922], 13);

const osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
});

const baseMaps = {
    "OpenStreetMap": osm,
    "Citra Satelit": satellite
};

const batasKotaLayer = L.layerGroup().addTo(map);
const jalanMacetLayer = L.layerGroup().addTo(map);
const titikBangkitanLayer = L.layerGroup().addTo(map);

fetch('batas_kota.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: "#007bff", 
                    weight: 3,
                    opacity: 0.7,
                    fillColor: "#007bff",
                    fillOpacity: 0.1
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<h3>${feature.properties.nama}</h3>`);
            }
        }).addTo(batasKotaLayer);
    });

fetch('jalan_macet.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: "#dc3545", 
                    weight: 5,
                    opacity: 0.8
                };
            },
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<h4>${feature.properties.nama_jalan}</h4><p>Status: ${feature.properties.status}</p>`);
            }
        }).addTo(jalanMacetLayer);
    });

fetch('titik_bangkitan.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            onEachFeature: function(feature, layer) {
                layer.bindPopup(`<strong>${feature.properties.nama}</strong><br>Kategori: ${feature.properties.kategori}`);
            }
        }).addTo(titikBangkitanLayer);
    });

const overlayMaps = {
    "Batas Kota (Poligon)": batasKotaLayer,
    "Jalan Rawan Macet (Poliline)": jalanMacetLayer,
    "Titik Bangkitan (Penanda)": titikBangkitanLayer
};

L.control.layers(baseMaps, overlayMaps).addTo(map);