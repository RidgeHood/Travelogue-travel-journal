

let map, infoWindow;

function initMap() {
   infoWindow = new google.maps.InfoWindow();
   if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        map = new google.maps.Map(document.getElementById("map"), {
            center: pos,
            zoom: 11.8,
            mapId:'e1f3167ce011c8c1',
        
          });


          const cityCircle = new google.maps.Circle({
            strokeColor: "#4e82f2",
            strokeOpacity: 0.1,
            strokeWeight: 2,
            fillColor: "#f0305d",
            fillOpacity: 0.35,
            
            map,
            center: pos,
            clickable: false
          })

          const cityCircle2 = new google.maps.Circle({
            strokeColor: "#4e82f2",
            strokeOpacity: 0.1,
            strokeWeight: 2,
            fillColor: "#7f82e3",
            fillOpacity: 0.35,
            
            map,
            center: pos,
            clickable: false
          })

          document.getElementById("slider").addEventListener("input",()=>{
              let rangevalue= parseInt(document.getElementById("slider").value);
              console.log(rangevalue);
              cityCircle.setRadius(rangevalue);
              cityCircle2.setRadius(rangevalue+2500);

              fetchPlaceDetails(pos,rangevalue);


            })


            
              



          new ClickEventHandler(map,pos);

          const locationButton = document.createElement("button");
  

  locationButton.textContent = "your location";
  locationButton.classList.add("custom-map-control-button");
  map.controls[google.maps.ControlPosition.TOP_CENTER].push(locationButton);
  locationButton.addEventListener("click", () => {
    // Try HTML5 geolocation.
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          infoWindow.setPosition(pos);
          infoWindow.setContent("You are here");
          infoWindow.open(map);
          map.setCenter(pos);
        },
        () => {
          handleLocationError(true, infoWindow, map.getCenter());
        }
      );
    } else {
      // Browser doesn't support Geolocation
      handleLocationError(false, infoWindow, map.getCenter());
    }
  });


      },
      () => {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  }
  else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }








  
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
  infoWindow.setPosition(pos);
  infoWindow.setContent(
    browserHasGeolocation
      ? "Error: The Geolocation service failed."
      : "Error: Your browser doesn't support geolocation."
  );
  infoWindow.open(map);
}




function isIconMouseEvent(e) {
    return "placeId" in e;
  }
  
  class ClickEventHandler {
    map;
    
    constructor(map) {
      
      this.map = map;
      
      // Listen for clicks on the map.
      this.map.addListener("click", this.handleClick.bind(this));
    }
    handleClick(event) {
      console.log("You clicked on: " + event.latLng);
      // If the event has a placeId, use it.
      if (isIconMouseEvent(event)) {
        console.log("You clicked on place:" + event.placeId);
        // Calling e.stop() on the event prevents the default info window from
        // showing.
        // If you call stop here when there is no placeId you will prevent some
        // other map click event handlers from receiving the event.
        
    
      }
    }
    
    
  }
  var info;
function fetchPlaceDetails(cord,rad){
const proxyurl = "https://cors-anywhere.herokuapp.com/";
var url
url=`https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=attractions&location=${cord.lat},${cord.lng}&radius=${rad}&type=tourist_attraction&key=AIzaSyAAikNagrgJlCUicIvsQIKfc4HprdRQ5WQ`
axios.get( proxyurl+url)
.then(res=>{ info=res.data.results
  console.log(info.length)
  console.log(info[0].geometry.location)
console.log(info[0]['name'])
injectPlacedetails(info);
 injectmarker(info);   
})

}

function injectPlacedetails(info){
document.getElementById('placelist').innerHTML=''
for (var i = 0; i < info.length; i++) {
    var name = info[i]["name"];
    var li = document.createElement('li');
    li.innerHTML = name;
    li.classList="list-group-item"  
    document.getElementById('placelist').appendChild(li);
}
}
let markerarray=[];
function injectmarker(info){
 if(markerarray.length==0){
   console.log("true")
  }else{
    console.log("false")
    console.log(markerarray)
    for(var i=0;i<info.length;i++){
      markerarray[i].setMap(null)
    }
  }
  for(var i=0;i<info.length;i++){  
  markerarray[i]=new google.maps.Marker({
    position: info[i].geometry.location,
    map,
    title: "Hello World!",
  });
  
}

}
  