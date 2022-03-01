console.log(JSON.parse(document.getElementById("hello-data").textContent))
//////////////////////////////////////////////CSRF TOKEN///////////////////////////////////////////////////////////////////////
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

////////////////////////////////////////////////BUILDSLIST OF MARKERS AT START///////////////////////////////////////////////////////////////////////
let initialmarker = [];
function buildlist() {
  let url = "http://127.0.0.1:8000/api/cords/";

  fetch(url)
    .then((resp) => resp.json())
    .then(function (data) {
      fetch("http://127.0.0.1:8000/api/getid/")
        .then((resp) => resp.json())
        .then(function (id) {
          for (let i = 0; i < data.length; i++) {
            if (id == data[i].user) {
              initialmarker[i] = new google.maps.Marker({
                position: { lat: data[i].latitude, lng: data[i].longitude },
                map,
                title: "Hello World!",
              });
              ////////////////////////////////////////////////
              let apiconfig = {
                method: "POST",
                headers: {
                  "content-type": "application/json",
                  "X-CSRFToken": csrftoken,
                },
                body: JSON.stringify({
                  lat: data[i].latitude,
                  lng: data[i].longitude,
                }),
              };

              fetch("http://127.0.0.1:8000/api/infostory/", apiconfig)
                .then((response) => response.json())
                .then(function (st) {
                  console.log(st);

                  const infowindow = new google.maps.InfoWindow({
                    content: `${st}`,
                    shouldFocus: false,
                    disableAutoPan: true,
                  });

                  infowindow.open({
                    anchor: initialmarker[i],
                    map,
                  });
                });

              //////////////////////////////////////////////////////////

              //initialmarker[i].addListener("click", addstory);
            }
          }
        });
    });
}


///////////////////////////////////////////////////////////TO GET CURRENT POSITION///////////////////////////////////////////////////////////////
let map, pos, infowindow;

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
function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: pos,
    zoom: 7,
    fullscreenControl: false,
    streetViewControl: false,
    mapTypeControl: false,
  });

  let curr=document.getElementById("current")
  curr.addEventListener("click",(e)=>{
    e.preventDefault()
    console.log(pos,"POS")
    initialInfo(pos);
    
  })

  let innercontent = "add pin here?";
  infowindow = new google.maps.InfoWindow({
    content: innercontent,
    disableAutoPan: true,
  });
  //new ClickEventHandler(map,pos);
  marker = new google.maps.Marker();

  buildlist(map);
  map.addListener("dragstart", () => {
    
    if (!(infowindow.getMap() == null)) {
      infowindow.close();
    }

    let overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  });
  document.getElementById('mapload').style.display="flex"
  map.addListener("click", initialInfo);
  google.maps.event.addListener(map,'tilesloaded', function(){
    console.log("tiles loaded")
    document.getElementById('mapload').style.display="none";
    
})
 
}



///////////////////////////////////////HIDES OVERLAY/////////////////////////////////////////////////

function initialInfo(e) {
  if(e.lat){
    let infocord;
  
    infocord = e
    

  infowindow.setPosition(infocord);
  infowindow.shouldFocus = true;

  infowindow.close();
  infowindow.open(map);

  if (infowindow.getMap()) {
    map.panTo(infocord);
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
  }

  let cancel = document.getElementById("cancel");
  cancel.addEventListener("click", (e) => {
    e.preventDefault();
    infowindow.close();
    let overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  });

  PostCordToDb(infocord);
  }
  else{
    let infocord;
  
    infocord = e.latLng.toJSON();
    console.log(e,"INFOCORD")

  infowindow.setPosition(infocord);
  infowindow.shouldFocus = true;

  infowindow.close();
  infowindow.open(map);

  if (infowindow.getMap()) {
    map.panTo(infocord);
    let overlay = document.getElementById("overlay");
    overlay.style.display = "block";
  }

  let cancel = document.getElementById("cancel");
  cancel.addEventListener("click", (e) => {
    e.preventDefault();
    infowindow.close();
    let overlay = document.getElementById("overlay");
    overlay.style.display = "none";
  });

  PostCordToDb(infocord);
  }
  
  
}

/////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////PHOTO//////////////////////////////////////

//POST cord to DB  when clicked
function PostCordToDb(infocord) {
  

  let yesbtn = document.getElementById("yes-button");

  yesbtn.addEventListener("click", (e) => {
    e.preventDefault();
    console.log(JSON.parse(document.getElementById("hello-data").textContent))
    textarea = document.getElementById("story");
    storycontent = textarea.value;

  let textare = document.getElementById("story");
  let storytitle = document.getElementById("storytitle");
  let storyct = textare.value;
  let title = storytitle.value;
/////////////////////////////////////////////////////////////////////////////
let fd=new FormData()
  let imgtes=document.getElementById("imginitial")
  var ins = document.getElementById('imginitial').files.length;
  for (var x = 0; x < ins; x++) {
    console.log("inside")
      fd.append(`imginitial[${x}]`, document.getElementById('imginitial').files[x]);
  }
  fd.append("csrfmiddlewaretoken",csrftoken)
  fd.append("storyct",storyct)                                                                                                    
  fd.append("storytitle",title)
  fd.append("user",document.getElementById("USERID").value)
  fd.append("latitude",infocord.lat)
  fd.append("longitude",infocord.lng)
/////////////////////////////////////////////////////////////////////////////////////////////////
    console.log(storycontent, "click DB");

    if (storycontent != "") {
      console.log("post");

      fetch("http://127.0.0.1:8000/api/getid/")
        .then((resp) => resp.json())
        .then(function (id) {
          fetch("http://127.0.0.1:8000/api/postcord/", {
            method: "POST",
            headers: {
  
              "X-CSRFToken": csrftoken,
            },
            body:fd,
          })
            .then((response) => response.json())
            .then((e) => {
              console.log(e);
              document.getElementById("exist").style.display = "none";
              if (e == "exist") {
                document.getElementById("exist").style.display = "block";
              }
              if (e == "new cord uploaded") {
                let mapload=document.getElementById("mapload")
                mapload.style.display="flex"
                ///////////////////////////////////////////////////////////////////////////////////POINTER/////////////////////////////////////////////////////////////////////////
                marker.setPosition(infocord);
                marker.setMap(map);
                //marker.addListener("click", tempmarker);
                infowindow.close();
                //PushStory(infocord);
                let overlay = document.getElementById("overlay");
                overlay.style.display="none"
                //foverlay = document.getElementById("formoverlay");
                //foverlay.style.display = "none";

                
                initMap()
                
                textare.value=""
                storytitle.value=""
                let stories=document.getElementById("stories")
                stories.innerHTML=""
                FetchStories()
                imgtes.value=""
                let uploadimgtes=document.getElementById("uploadimgtes")
                    uploadimgtes.reset() 
                let preview=document.getElementById("preview")
                preview.innerHTML=""
                mapload.style.display="none"
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
    }
  });
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////
let imginitial = document.getElementById("imginitial");
imginitial.onchange = function (e) {
  let files = e.target.files;
  console.log(files[0]);
  for (let i = 0; i < files.length; i++) {
    imgpreview = document.createElement("img");
    imgpreview.src = URL.createObjectURL(files[i]);
    imgpreview.classList = "tempimg";
    document.getElementById("preview").appendChild(imgpreview);

    //document.getElementById("tempimg").src=URL.createObjectURL(files[0])
    //console.log(URL.createObjectURL(files[0]))
  }
};

////////////////////////////////////////////////////////////
FetchStories();
function FetchStories() {
  let overl=document.getElementById("stories-overlay")
      overl.style.display="flex"

  fetch("http://127.0.0.1:8000/api/getstory/")
    .then((response) => response.json())
    .then((allstories) => {
      photosloop(allstories);
    });
  function photosloop(allstories) {
    console.log(allstories[0].id, "GETSS STORYY");

    for (let i = 0; i < allstories.length; i++) {
      let storiesdiv = document.getElementById("stories");
      let x = document.createElement("div");
      let clonex = x.cloneNode(true);
      clonex.classList.add("col")
      clonex.innerHTML = `
      
      <div id="story-${i}" class="card rounded text-white bg-success mb-5" style="width:23rem">
      <input type="hidden" value=${i}> 
    <div id="header-${i}" class="card-header" style="position: relative">
    
    
      <h5 id="title-${i}" class="card-title">${allstories[i].title}</h5>
      <div id="postsettings-${i}" class="dropdown story-settings float-right">
  <button class=" dropdown-toggle drp m-3 " type="button" id="dropdownMenuButton" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><i class="fas fa-ellipsis-v"></i></button>
  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
    <a id="DeleteButton-${i}" class="dropdown-item" href="#">Delete</a>
  </div>
</div>
      
    

    </div>
<div>
    <div id="carouselControls-${i}" class="carousel slide" data-ride="carousel"style="overflow:hidden">
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
  </div>
  <div class="card-body" ">
    
    <p id="cardstory-${i}" class="card-text" >${allstories[i].story}</p>
  </div>


</div>
`;
      active = document.getElementsByClassName(`active`);

      storiesdiv.appendChild(clonex);

      document.getElementById(`DeleteButton-${i}`).addEventListener("click", deletestory);
      function deletestory(e) {
        e.preventDefault()
        let delConfig = {
          method: "DELETE",
          headers: {
            "content-type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({
            id: allstories[i].id,
          }),
        };

        fetch("http://127.0.0.1:8000/api/delete/", delConfig)
          .then((response) => response.json())
          .then(() => {
            let stories=document.getElementById("stories")
                stories.innerHTML=`
                <div id="stories-overlay" style="background-color: white; width: 100%;  height: 100%; z-index:200; pointer-events: none; z-index: 200; justify-content: center; border-radius: 1.8rem;">
          
                <div class="spinner-border text-dark" style="align-self: center;" role="status">
                <span class="sr-only">Loading...</span>
              </div>

        </div>
                
                `
                FetchStories()
                initMap()
          });

          


      }
      let config = {
        method: "POST",
        headers: {
          "content-type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify({
          id: allstories[i].id,
        }),
      };
      fetch("http://127.0.0.1:8000/api/photoperstory/", config)
        .then((response) => response.json())
        .then((nos) => {
          for (let j = 0; j < nos; j++) {
            let y = document.createElement("img");
            let cloney = y.cloneNode(true);
            cloney.classList = "photoitems";
            cloney.style.maxWidth = "100%";
            cloney.classList.add("d-block", "storyphotos");
            cloney.src = `http://127.0.0.1:8000/media/images/user/story_${allstories[i].id}.${j}`;
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

            zx2.appendChild(cloney);

            zx.appendChild(zx2);
            z.appendChild(zx);
            console.log(z.firstElementChild);
            //clonex.appendChild(cloney)
            console.log(i,allstories.length)
           
          }
        }).then(()=>{
          
          overl.style.display="none"
        })
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

let closebtn=document.getElementById("closebtn")
closebtn.addEventListener("click",(e)=>{
  e.preventDefault()
  console.log("close")
  let detailoverlay=document.getElementById("postdetail")
  detailoverlay.style.display="none"


})

let detailbtn=document.getElementById("stories")
detailbtn.addEventListener("click",(e)=>{
  if(e.target.nodeName== "H5"){
console.log(e)
let id=e.target.parentElement.parentElement.children[0].value
let car=e.target.parentElement.parentElement.children[2].innerHTML
console.log(car)
let res = car.replace(/carouselControls/g, "red");
console.log(res)
let overlaycar=document.getElementById("overlaycar")
overlaycar.innerHTML=res

let title=document.getElementById(`title-${id}`).innerHTML

let  overlaytitle=document.getElementById("overlaytitle")
overlaytitle.innerHTML=title


let story=document.getElementById(`cardstory-${id}`).innerHTML
console.log(story)
let  overlaystory=document.getElementById("overlaystory")
overlaystory.innerHTML=story





let detailoverlay=document.getElementById("postdetail")
detailoverlay.style.display="block"
}
})