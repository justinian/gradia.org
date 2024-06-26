const MAXZOOM = 4;
const GROUPS = [
    {name: "towns", minZoom: 1.5, maxZoom: MAXZOOM, radius: 4},
    {name: "cities", minZoom: 1, maxZoom: MAXZOOM, radius: 7},
    {name: "states", minZoom: -0.5, maxZoom: 2, radius: 0},
];

function map_resizer(mapdiv) {
    return () => {
        const parentHeight = mapdiv.parentElement.clientHeight;
        mapdiv.style.height = `${parentHeight}px`;
    };
}

export default async function setupMap(mapdiv, target, zoom) {
    const xTiles = 10;
    const yTiles = 10;
    const mapWidth = 1000;
    const mapHeight = 1369;
    const bounds = [[0,0], [mapHeight,mapWidth]];

    const resizer = map_resizer(mapdiv);
    addEventListener('resize', resizer);
    resizer();

    const icons = {
        city: L.icon({ iconUrl: '/images/city_marker.svg', iconSize: [20, 20], iconAnchor: [10, 10], }),
    };

    let map = L.map(mapdiv, {
        crs: L.CRS.Simple,
        maxBounds: bounds,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
    });

    L.tileLayer('/tiles/{z}_{x}_{y}.webp', {
        bounds: bounds,
        tileSize: L.point(mapWidth/xTiles, mapHeight/yTiles),
        minZoom: -0.5,
        maxZoom: MAXZOOM,
        minNativeZoom: 0,
        maxNativeZoom: 0,
        noWrap: true,
        attribution: "Generated with <a href='https://azgaar.github.io/Fantasy-Map-Generator/'>Azgaar's Fantasy Map Generator</a>"
    }).addTo(map);

    map.fitBounds(bounds);

    if (target)
        map.setView(target, zoom || 0);
    else
        map.setView([817,345], zoom || 0);

    const groups = new Map();
    for (const desc of GROUPS) {
        const group = {
            name: desc.name,
            minZoom: desc.minZoom,
            maxZoom: desc.maxZoom,
            radius: desc.radius,
            group: L.layerGroup(),
        };
        console.log("Adding group", group);
        groups.set(desc.name, group);
    }

    let coordsPopup = L.popup();
    map.on('click', e => {
        if (e.originalEvent.ctrlKey) {
            coordsPopup
                .setLatLng(e.latlng)
                .setContent(`Location: [${e.latlng.lat}, ${e.latlng.lng}]`)
                .openOn(map);
        }
    });

    const checkMarkers = (map) => {
        const z = map.getZoom();
        console.log("Checking markers at zoom", z);

        groups.forEach(group => {
            const shouldHave = (z >= group.minZoom && z <= group.maxZoom);
            console.log("   ", group, shouldHave);
            if (shouldHave) {
                if (!map.hasLayer(group.group))
                    map.addLayer(group.group);
            } else {
                if (map.hasLayer(group.group))
                    map.removeLayer(group.group);
            }
        });
    };
    map.on('zoomend', e => {
        checkMarkers(map);
    });

    fetch('/mapmarkers.json')
        .then( resp => resp.json() )
        .then( markers => {
            markers.forEach(marker => {
                let group = groups.get(marker.group);
                if (!group || !marker.pos)
                    return;

                const onClick = () => {
                    window.location.href = `/pages/${marker.name}`;
                };

                const tipOptions = {
                    direction: 'bottom',
                    className: `map-tooltip-${group.name}`,
                    permanent: true,
                    interactive: true,
                };

                const label = marker.label || marker.name;

                if (group.radius) {
                    let m = L.circleMarker(marker.pos, {
                        radius: group.radius,
                        color: "black",
                        fill: true,
                        fillColor: "white",
                        fillOpacity: 1,
                        weight: 1,
                    })
                        .bindTooltip(label, tipOptions)
                        .on('click', onClick)
                        .addTo(group.group);

                    m.getTooltip().on('click', onClick);
                } else {
                    const t = L.tooltip(tipOptions)
                        .setLatLng(marker.pos)
                        .setContent(label)
                        .on('click', onClick)
                        .addTo(group.group);
                }

            });
            checkMarkers(map);
        });
}
