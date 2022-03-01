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
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



let likebtn=document.getElementsByClassName("likebtn")
for(let i=0;i<likebtn.length;i++){
    likebtn[i].addEventListener("click",(e)=>{
      e.preventDefault()
      e.stopImmediatePropagation()
        let apiconfig = {
            method: "POST",
            headers: {
              "content-type": "application/json",
              "X-CSRFToken": csrftoken,
            },
            body: JSON.stringify({
              story_id: parseInt(likebtn[i].value) 
            }),
          };

          fetch("http://127.0.0.1:8000/api/like/", apiconfig)
                .then((response) => response.json())
                .then(function (st) {
                  console.log(st);
                  let storyid=likebtn[i].value
                  let likecounter=document.getElementById(`likecounter-${storyid}`)
                  let likecounter2=document.getElementById(`likecounter`)
                  if (st.status=="liked"){
                    console.log("licked")
                    likebtn[i].style.backgroundColor="#DE3163";
                    likebtn[i].style.color="aliceblue"
                    likebtn[i].style.borderColor="#DE3163"  

                    likecounter.innerHTML=``
                    likecounter.innerHTML=`${st.count} likes`
                    likecounter2.innerHTML=`${st.count} likes`
                  }
                  else if(st.status=="unliked"){
                      console.log("unlicked")
                    likebtn[i].style.backgroundColor="white";
                    likebtn[i].style.color="dodgerblue"
                    likebtn[i].style.borderColor="dodgerblue" 
                    likecounter.innerHTML=``
                    likecounter.innerHTML=`${st.count} likes`
                    likecounter2.innerHTML=`${st.count} likes`
                  }

                 
                });




    })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("closebtn").addEventListener("click",(e)=>{
e.preventDefault()
document.getElementById("overlay").style.display="none"
})
////////////////////////////////////////////////////////////////////
fullstory=document.getElementsByClassName("cardtitlefull")
for(let i=0;i<fullstory.length;i++){
  fullstory[i].addEventListener("click",(e)=>{
    e.preventDefault()
    let storyid=fullstory[i].value

    let name=document.getElementById(`overlayuser-${storyid}`).value
    document.getElementById("overlay-name").innerHTML=name

    let postcount=document.getElementById(`postcount-${storyid}`).value
    document.getElementById("overlay-postcount").innerHTML=`Posts: ${postcount}`

    let likecount=document.getElementById(`likecount-${storyid}`).value
    document.getElementById("overlay-upreach").innerHTML=`Upreach: ${likecount}`


    let title=document.getElementById(`titleinput-${storyid}`).value
    document.getElementById("overlay-title").innerHTML=title

    let story=document.getElementById(`storyinput-${storyid}`).value
    document.getElementById("overlay-story").innerHTML=story

    let likes=document.getElementById(`hiddenlike-${storyid}`).value
    document.getElementById("likecounter").innerHTML=`${likes} likes`

    btnoverlay=document.getElementById("overlay-likebtn")
    btnoverlay.value=storyid

    btnoverlay.addEventListener("click",(e)=>{
          e.preventDefault()
          e.stopImmediatePropagation()
        let apiconfig = {
          method: "POST",
          headers: {
            "content-type": "application/json",
            "X-CSRFToken": csrftoken,
          },
          body: JSON.stringify({
            story_id: parseInt(storyid) 
          }),
        };

        fetch("http://127.0.0.1:8000/api/like/", apiconfig)
              .then((response) => response.json())
              .then(function (st) {
                console.log(st);
                //let storyid=likebtn[i].value
                //let likecounter=document.getElementById(`likecounter-${storyid}`)
                if (st.status=="liked"){
                  console.log("licked over")
                  


                }
                else if(st.status=="unliked"){
                    console.log("unlicked over")
                    
                  
                }

               
              });

    })


  

    let inner=document.getElementById(`carousel-${storyid}`).innerHTML
    document.getElementById("overlay-carousel").innerHTML=inner
    document.getElementById("overlay").style.display="block"
  })
}

