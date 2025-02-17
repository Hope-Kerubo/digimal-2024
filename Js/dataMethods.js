//display table data
function putTableIDStats(type, location, lat, lon, id){
    document.getElementById('stats').style.display = 'block';
    const table_stats = document.getElementById('stats_table');
    table_stats.innerHTML = '<tr> <th></th> <th></th> </tr> <tr> <td>'
        +type
        +':</td> <td>'
        +location
        +'</td> </tr> <tr> <td>Latitude:</td> <td><input type="text" id="lat" value='
        +lat
        +' readonly/></td> </tr> <tr> <td>Longitude:</td> <td><input type="text" id="lon" value='
        +lon
        +' readonly/></td> </tr><tr> <td id="head_id">Id:</td> <td><input type="text" id="v_id" value='
        +id
        +' readonly/></td> </tr>';

}

//function to zoom in by selection
function zoomIntoCounty(theLocation, distinct){
    var zoom_level = 10;

    if(distinct === 'county'){
        zoom_level = 10;
    }else if(distinct === 'sub_county'){
        zoom_level = 12;
    }else if(distinct === 'ward'){
        zoom_level = 14;
    }else if(distinct === 'location'){
        zoom_level = 15;
    }else if(distinct === 'sub_location'){
        zoom_level = 15;
    }else{
        zoom_level = 16;
    }

    console.log(theLocation)

    fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(theLocation)}`)
    .then(response => response.json())
    .then(data => {
      const filteredAddresses = data.filter(element => {
        return element.display_name.includes("Kenya");
      });                   

        if (filteredAddresses.length > 0) {
         map.setView([filteredAddresses[0].lat, filteredAddresses[0].lon], zoom_level);
        } else {
            console.log('.')
        }

    })
    .catch(error => {           

      alert("The village was not found, Enter nearby locations manually on the search bar  i.e location, village:");
        console.error('Error fetching coordinates:', error);
    });
    
}

function putTableStats(type, location, lat, lon){
    document.getElementById('stats').style.display = 'block';
    const table_stats = document.getElementById('stats_table');
    table_stats.innerHTML = '<tr> <th></th> <th></th> </tr> <tr> <td>'
        +type
        +':</td> <td>'
        +location
        +'</td> </tr> <tr> <td>Latitude:</td> <td><input type="text" id="lat" value='
        +lat
        +' readonly/></td> </tr> <tr> <td>Longitude:</td> <td><input type="text" id="lon" value='
        +lon
        +' readonly/></td> </tr>';

}

//showAndMarkLocation
function show_map_and_pin_location(type, location, lat, lon, id){
    var myIcon = L.icon({
        iconUrl: './maps/images/pin24.png',
        iconRetinaUrl: './maps/images/pin48.png',
        iconSize: [29, 24],
        iconAnchor: [9, 21],
        popupAnchor: [0, -14],
    })                            
    
    map.setView([lat, lon], 16);

    //var popup = '<div id="marker_popup"><b>'+type+': </b>'+location + '<br/><b>Latitude: </b>'+lat+'<br/><b>Longitude: </b>'+lon+'<br/><button onClick="postData()" class="post_btn">Post</button></div>'
    var popup = '<div id="marker_popup"><b>'+type+': </b>'+location + '<br/><b>Latitude: </b>'+lat+'<br/><b>Longitude: </b>'+lon+'</div>'

    var m = L.marker([lat, lon], {
    icon: myIcon,
    }).bindPopup(popup).addTo(map);
       
    if(id === undefined || id === null || id === ''){
        putTableStats(type, location, lat, lon)
    }else{        
        putTableIDStats(type, location, lat, lon, id)
    }
}

//search for an id of a village that has not specified there org id using the parent id
function searchForVillageParentWithParentId(parent_id, village_name){

}

//post to json server
function postData(){
    const lat = document.getElementById('lat').value;
    const long = document.getElementById('lon').value;

    if(document.getElementById('v_id')){
        const id = document.getElementById('v_id').value
        fetch('http://localhost:3000/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
    
            body: JSON.stringify({ 
                org_id: id,
                Latitude: lat,
                Longitude: long
            }),
        })
        .then(response => response.json())
        .then(data => alert('Successfully posted the co-ordinates!'))
        .catch(error => alert('Error:'+ error));

    }else{

        alert('Cannot post coordinates for a region that is not a village!')
    }
}