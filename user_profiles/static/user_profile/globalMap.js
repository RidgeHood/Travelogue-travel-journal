
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}
const csrftoken = getCookie("csrftoken");
////////////////////////////////////////////////////////////////////////////




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
          zoom: 14,
          mapId: "e1f3167ce011c8c1",
          fullscreenControl: false,
          streetViewControl: false,
          mapTypeControl: false,
        });

        infoWindow.setPosition(pos);
        infoWindow.setContent(`<h5 id="you">YOU ARE HERE</h5>`);
        infoWindow.setZIndex(100);
        infoWindow.open(map);
      
        const cityCircle = new google.maps.Circle({
          strokeColor: "#4e82f2",
          strokeOpacity: 0.1,
          strokeWeight: 2,
          fillColor: "#f0305d",
          fillOpacity: 0.35,

          map,
          center: pos,
          clickable: false,
        });

        const cityCircle2 = new google.maps.Circle({
          strokeColor: "#4e82f2",
          strokeOpacity: 0.1,
          strokeWeight: 2,
          fillColor: "#7f82e3",
          fillOpacity: 0.35,

          map,
          center: pos,
          clickable: false,
        });

        document.getElementById("slider").addEventListener("input", () => {
          let rangevalue = parseInt(document.getElementById("slider").value);
          let radinitial=document.getElementById("basic-addon1")
          
          radinitial.innerText=`${rangevalue/1000}KM Radius`;

          console.log(rangevalue);
          cityCircle.setRadius(rangevalue);
          cityCircle2.setRadius(rangevalue + 2500);

          fetchPlaceDetails(pos, rangevalue);
        });
        fetchPlaceDetails(pos);

        new ClickEventHandler(map, pos);

        let curr=document.getElementById("current")
        curr.addEventListener("click", () => {
          // Try HTML5 geolocation.

          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const pos = {
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent(`<h5 id="you">YOU ARE HERE</h5>`);
                infoWindow.open(map);
                infoWindow.setZIndex(100);
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
  } else {
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
    
    // If the event has a placeId, use it.
    if (isIconMouseEvent(event)) {
      
      // Calling e.stop() on the event prevents the default info window from
      // showing.
      // If you call stop here when there is no placeId you will prevent some
      // other map click event handlers from receiving the event.
    }
  }
}
var info;
async function fetchPlaceDetails(cord, rad=5000) {
  const proxyurl = "https://cors-anywhere.herokuapp.com/";
  var url;
  url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=attractions&location=${cord.lat},${cord.lng}&radius=${rad}&type=tourist_attraction&key=AIzaSyAAikNagrgJlCUicIvsQIKfc4HprdRQ5WQ`;
  await axios.get(proxyurl + url).then((res) => {
    info = res.data.results;
    
    injectPlacedetails(info);
    injectmarker(info);
  });
}

async function injectPlacedetails(info) {
  let card = document.getElementById("placelist");
  let trip=[]
  for (let i = 0; i < info.length; i++) {
    var div = document.createElement("div");
    

    var name = info[i]["name"];
    var li = document.createElement("div");
    let img = document.createElement("img");
    let y = li.cloneNode(true);

    trip.push({"name":name,"lat":info[i].geometry.location.lat,"lng":info[i].geometry.location.lng})
    
    y.innerHTML = `
    <div id="story-${i}" class="card rounded text-white bg-success mb-5"  ">
      <div class="card-header" style="position: relative"><h5 class="card-title">${name}</h5>
      <button id="settrip-${i}" value="${i}" class="float right btn btn-outline-primary" href="">Set Trip</button>
      </div>

      <div id="carouselControls-${i}" class="carousel slide" data-ride="carousel">
      <div id="inner-${i}" class="carousel-inner-${i}">
      </div>
    <a class="carousel-control-prev" href="#carouselControls-${i}" role="button" data-slide="prev">
      <span class="carousel-control-prev-icon" aria-hidden="true"></span>
      <span class="sr-only">Previous</span>
    </a>
    <a class="carousel-control-next" href="#carouselControls-${i}" role="button" data-slide="next">
      <span class="carousel-control-next-icon" aria-hidden="true"></span>
      <span class="sr-only">Next</span>
    </a>
  </div>


</div>`;

    document.getElementById("placelist").appendChild(y);

    let settrip=document.getElementById(`settrip-${i}`)
    settrip.addEventListener("click",(e,)=>{
      e.preventDefault();
      let tripp=trip
      
       apiconfig = {
         method: "POST",
         headers: {
           "content-type": "application/json",
           "X-CSRFToken": csrftoken,
         },
         body: JSON.stringify({
                placename: tripp[i].name,
           lat: tripp[i].lat,
          lng: tripp[i].lng
         }),
       };
 
      const pushtrip=fetch("http://127.0.0.1:8000/api/set-trip/",apiconfig).then((response) => response.json())
    })
   

    const fet = await fetch(
      `https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id=${info[i].place_id}&key=AIzaSyAAikNagrgJlCUicIvsQIKfc4HprdRQ5WQ`
    )
      .then((resp) => resp.json())
      .then(function (e) {
        let temp = e.result.photos,len;
        

    

        for (var j = 0; j < 5; j++) {
          let x = img.cloneNode(true);
          x.classList = "placephoto";
          try {
            x.src = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${temp[j].photo_reference}&key=AIzaSyAAikNagrgJlCUicIvsQIKfc4HprdRQ5WQ`;
            if (temp[j].height > temp[j].width){
              x.classList.add("portrait")
            }
            else{
              x.classList.add("landscape")
            }

            //x.classList.add("d-block")
            let z = document.getElementById(`inner-${i}`);
            let div = document.createElement("div");
            let div2 = document.createElement("div");
            let zx = div.cloneNode(true);
            let zx2 = div2.cloneNode(true);
            zx.classList = "carousel-item";
            zx2.classList.add("d-flex","justify-content-center");
            if (j == 0) {
              zx.classList.add("active");
            }

            zx2.appendChild(x);

            zx.appendChild(zx2);
            z.appendChild(zx);
          } catch {
            
          }
        }
      });
  }
}


function injectmarker(info) {
  let markerarray = []; 
  if (markerarray.length == 0) {
    
  } else {
    
    for (var i = 0; i < info.length; i++) {
      markerarray[i].setMap(null);
    }
  }
  for (let i = 0; i < info.length; i++) {

      markerarray[i] = new google.maps.Marker({
      position: info[i].geometry.location,
      map,
      title: info[i]["name"],
    });

    const infowindow = new google.maps.InfoWindow({
      content: info[i]["name"],
      shouldFocus: false,
      disableAutoPan: true,
    });

    infowindow.open({
      anchor: markerarray[i],
      map,
    });

  }
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////

let hilights=document.getElementById("hilights")
if (hilights.children.length==0){
  hilights.innerHTML="No Place Reminders"
}
hilights.addEventListener("click",(e)=>{
  e.preventDefault()
  console.log(e)
  console.log(e.target.nodeName)
  if(e.target.nodeName=="BUTTON"){
    console.log("yes")
    deleterem()
    function deleterem() {
      let delConfig = {
        method: "DELETE",
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          id:e.target.value,
        }),
      };

      fetch("http://127.0.0.1:8000/api/set-trip/", delConfig)
        .then((response) => response.json())
        .then((res) => {
          console.log(res)
          if (res== "trip deleted"){
            e.target.parentElement.parentElement.remove()
            console.log(hilights.children)
            if (hilights.children.length==0){
              hilights.innerHTML="No Place Reminders"
            }
          }
        });
    }
  }
})