//////////////////////////////////////////////CSRF TOKEN///////////////////////////////////////////////////////////////////////
function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
      const cookies = document.cookie.split(';');
      for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          // Does this cookie string begin with the name we want?
          if (cookie.substring(0, name.length + 1) === (name + '=')) {
              cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
              break;
          }
      }
  }
  return cookieValue;
}
const csrftoken = getCookie('csrftoken')

////////////////////////////////////////////////BUILDSLIST OF MARKERS AT START///////////////////////////////////////////////////////////////////////
let initialmarker
function buildlist(){
  let url='http://127.0.0.1:8000/api/cords/'

  fetch(url)
  .then((resp)=>resp.json())
  .then(function(data){

fetch("http://127.0.0.1:8000/api/getid/").then((resp)=>resp.json()).
then(function(id){

for(let i=0;i<data.length;i++)
{ 
  if(id==data[i].user){

     initialmarker=new google.maps.Marker({
      position: { lat: data[i].latitude, lng:data[i].longitude },
      map,
      title: "Hello World!",
    });

    initialmarker.addListener("click",addstory)
  }


}

})
  
  })
}

function addstory(e){
  latlngID=e.latLng.toJSON();
  
  
fetch('http://127.0.0.1:8000/api/cordtoid/', {
method: 'POST',
headers: {
  'content-type': 'application/json',
  "X-CSRFToken":csrftoken

},
body:JSON.stringify({
  "latitude": latlngID.lat,
  "longitude": latlngID.lng,
})
})
.then((response) =>response.json()).then((e)=>{ getstory(e)}).catch(err => {console.log(err)})


function getstory(markercordid){
  let apiconfig={
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      "X-CSRFToken":csrftoken
    
    },
    body:JSON.stringify({
      "latlng": markercordid,
    })
    }
fetch("http://127.0.0.1:8000/api/markerstory/",apiconfig).then((response) =>response.json()).then(function(st){
console.log(st)

})
}


}


  




///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////TO GET CURRENT POSITION///////////////////////////////////////////////////////////////
let map,pos,infowindow


if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
    },
    () => {
      handleLocationError(true, infoWindow, map.getCenter());
    }
  );
} else {
  // Browser doesn't support Geolocation
  handleLocationError(false, infoWindow, map.getCenter());
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
//////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////INITMAP/////////////////////////////////////////////
function Map() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: pos,
    zoom: 12,
  });
  let innercontent="add pin here?"
   infowindow = new google.maps.InfoWindow({
    content: innercontent,
    disableAutoPan:true
  });
  //new ClickEventHandler(map,pos);
  marker=new google.maps.Marker();

  buildlist(map)
  map.addListener("dragstart", () => {
    console.log(infowindow.getMap()==null,"info")
    if(!(infowindow.getMap()==null)){
      
      infowindow.close()
    
    }
    
    let overlay=document.getElementById("overlay")
    overlay.style.display="none"
    
  })
  map.addListener("click",initialInfo)
}

///////////////////////////////////////HIDES OVERLAY/////////////////////////////////////////////////


function initialInfo(e){

  let infocord;
  infocord=e.latLng.toJSON()
  
  infowindow.setPosition(infocord)
  infowindow.shouldFocus=true;
  
  infowindow.close();
  infowindow.open(map);
  

  if(infowindow.getMap()){
    map.panTo(infocord)
    let overlay=document.getElementById("overlay")
    overlay.style.display="block"
  }

  let cancel=document.getElementById("cancel")   
  cancel.addEventListener("click",()=>{
    infowindow.close();
    let overlay=document.getElementById("overlay")
    overlay.style.display="none"

  })
  
  PostCordToDb(infocord)
}

/////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////

//POST cord to DB  when clicked
function PostCordToDb(infocord){
let yesbtn=document.getElementById("yes-button")
  
  
yesbtn.addEventListener('click',(e)=>{
  console.log("post")

  fetch("http://127.0.0.1:8000/api/getid/")
  .then((resp)=>resp.json()).then(function(id){

    fetch('http://127.0.0.1:8000/api/postcord/', {
method: 'POST',
headers: {
  'content-type': 'application/json',
  "X-CSRFToken":csrftoken

},
body:JSON.stringify({
  "latitude": infocord.lat,
  "longitude": infocord.lng,
  "user": id
})
})
.then((response) =>response.json()).then((e)=>{console.log(e)
  document.getElementById("exist").style.display="none"
  if(e=="exist"){
    document.getElementById("exist").style.display="block"
  }
  if(e=="new cord uploaded"){///////////////////////////////////////////////////////////////////////////////////POINTER/////////////////////////////////////////////////////////////////////////
    marker.setPosition(infocord)
    marker.setMap(map)
    marker.addListener("click",tempmarker)
    infowindow.close()
    PushStory(infocord)
    let overlay=document.getElementById("overlay")
    overlay.style.display="none"
  }
  

})
.catch(err => {
  console.log(err)
})

  })

})


}


////////////////////////////////////////////////////////////////////////////////////////////////
function tempmarker(e){
  latlngID=e.latLng.toJSON();
  
  
fetch('http://127.0.0.1:8000/api/cordtoid/', {

method: 'POST',
headers: {
  'content-type': 'application/json',
  "X-CSRFToken":csrftoken

},
body:JSON.stringify({
  "latitude": latlngID.lat,
  "longitude": latlngID.lng,
})
  })
.then((response) =>response.json()).then((e)=>{ getstory(e)}).catch(err => {console.log(err)})


function getstory(markercordid){
  let apiconfig={
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      "X-CSRFToken":csrftoken
    
    },
    body:JSON.stringify({
      "latlng": markercordid,
    })
    }
fetch("http://127.0.0.1:8000/api/markerstory/",apiconfig).then((response) =>response.json()).then(function(st){


console.log(st,"from second")

})
}


}

////////////////////////////////////////////////////////////////////////////////////////////////

function PushStory(cord){
  textarea=document.getElementById("story")
  storycontent=textarea.value
  console.log("story content",storycontent)
fetch('http://127.0.0.1:8000/api/getid/').then((response) =>response.json()).then((userid)=>{ cordinatesAPI(userid)})

function cordinatesAPI(userid){
apiconfig={

  method: 'POST',
  headers: {
    'content-type': 'application/json',
    "X-CSRFToken":csrftoken
  
  },
  body:JSON.stringify({
    "latitude": cord.lat,
    "longitude": cord.lng,
  })
    }
fetch('http://127.0.0.1:8000/api/cordtoid/',apiconfig).then((response) =>response.json()).then((cordinateID)=>{ storyAPI(cordinateID,userid)})

}

function storyAPI(cordinateID,userid){
  config={
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      "X-CSRFToken":csrftoken
    
    },
    body:JSON.stringify({
      "story": storycontent,
      "user_id": userid,
      "latlng":cordinateID
  })
    }
fetch('http://127.0.0.1:8000/api/addstory/',config).then((response) =>response.json()).then(function (st){

})

}
textarea.value=""; 
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////