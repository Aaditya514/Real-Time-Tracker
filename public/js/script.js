const socket = io();
// Listen for location updates from the server
if(navigator.geolocation){
    navigator.geolocation.watchPosition((position)=>{
        const {latitude,longitude} = position.coords; 
        socket.emit('send-location',{latitude,longitude});
    },(error)=>{
        console.error(error);
    },{
        enableHighAccuracy:true,
        maximumAge:0,
        timeout:5000
    })
}
// Initialize the map
const map = L.map("map").setView([0,0],16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{
    attribution:"Aaditya"
}).addTo(map);
//initialize a marker variable
const markers = {};

// Listen for location updates from other users
socket.on("receive-location",(data)=>{
    const{id,latitude,longitude} = data;
    map.setView([latitude,longitude]);
    //if marker for this id already exists, update its position
    if(markers[id]){
        markers[id].setLatLng([latitude,longitude]);
    }else{
        //create a new marker
        const marker = L.marker([latitude,longitude]).addTo(map);
        markers[id] = marker;
    }
})
// Listen for user disconnections
socket.on("user-disconnected",(id)=>{
    //remove the marker from the map
    if(markers[id]){
        map.removeLayer(markers[id]);
        delete markers[id];
    }
});