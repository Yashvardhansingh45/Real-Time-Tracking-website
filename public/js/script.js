const socket = io();

if(navigator.geolocation){
    navigator.geolocation.watchPosition(
        (position) => {
        const {latitude, longitude} = position.coords;
        socket.emit('sendLocation', {latitude, longitude});
}, (error)=>{
    console.log(error);
 }, {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
 }
);
}

const map=L.map("map").setView([0,0],16);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution: "© YASH VARDHAN SINGH",
}).addTo(map);

const markers = {};

socket.on("receiveLocation", (data) => {
    const {id, latitude, longitude} = data;
    map.setView([latitude, longitude]);
    if(markers[id]){
        markers[id].setLatLng([latitude, longitude]);
    }
    else{
        markers[id] = L.marker([latitude, longitude]).addTo(map);
    }
});

socket.on("A user disconnected", (id) => {
    if(markers[id]){
    map.removeLayer(markers[id]);
    delete markers[id];
    }
});