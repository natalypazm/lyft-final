function setObjectLocalStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
function getObjectLocalStorage(key) {
    var value = localStorage.getItem(key);
    return JSON.parse(value);
}

var miMapa;
var latLongLabo={
    lat: -16.457389199999998,
    lng: -71.5315308
}
var opcionesMapa = {
    enableHighAccuracy: true
}

function initMap() {
    miMapa = new google.maps.Map(document.getElementById('map'),{
        center: {
            lat: latLongLabo.lat,
            lng: latLongLabo.lng},
            zoom: 18
        });
};

var ubicacionActual="aqui";
var currentMaker=null;
var direccion=null;

function geoActual(mygeo, position, id) {

  var latlng = position;
  mygeo.geocode({'location': latlng}, function(results, status) {
    if (status === google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        $('#'+id).html(results[0].formatted_address);
        miubicacion= results[0].formatted_address;
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

function centrarMapa(position){
    miMapa.setZoom(18);
    miMapa.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        map: miMapa,
        title:"Mi posición actual",
        icon:"image/cliente.png"
    });
    var marker1 = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude+0.002, position.coords.longitude),
        map: miMapa,
        title:"auto1",
        icon: "image/carro.png"
    });
     var marker2 = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude+0.0004, position.coords.longitude),
        map: miMapa,
        title:"auto2",
        icon: "image/carro.png"
    });
      var marker3 = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude+0.0034),
        map: miMapa,
        title:"auto3",
        icon: "image/carro.png"
    });
    var marker4 = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude+0.0004, position.coords.longitude),
        map: miMapa,
        title:"auto4",
        icon: "image/carro.png"
    });
    var marker5 = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude+0.0034),
        map: miMapa,
        title:"auto5",
        icon: "image/carro.png"
    });

    var mygeo= new google.maps.Geocoder;
    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer();
    geoActual(mygeo, marker.position,'direccion');

};


function init(){
    if(navigator.geolocation){
        console.log('soportado');
        navigator.geolocation.watchPosition(centrarMapa);
    }
    else
    {
        console.log('no soportado');
    }
     $("#listaCarros li").mouseover(function(){
            $(this).addClass("active");
            $(this).addClass("morado");
        });
    $("#listaCarros li").mouseleave(function(){
            $(this).removeClass("active");
            $(this).removeClass("morado");
    });
    $("#listaCarros li").click(function(){
            var direccion= $('#direccion').text();
            var auto=  $(this).find('strong').text();
            if(auto=='Line')
            {
              setObjectLocalStorage('tipo','1');
              setObjectLocalStorage('auto',auto);
              escogiTipo= true;
            }
            if(auto=='Lyft')
            {
              setObjectLocalStorage('tipo','2'); 
              setObjectLocalStorage('auto',auto); 
              escogiTipo= true; 
            }
            if(auto=='Plus')
            {
              setObjectLocalStorage('tipo','3');  
              setObjectLocalStorage('auto',auto); 
              escogiTipo= true;
            }
            if(auto=='Primiun')
            {
              setObjectLocalStorage('tipo','4');
              setObjectLocalStorage('auto',auto);
              escogiTipo= true;   
            }
            setObjectLocalStorage('midireccion',direccion);
        });
        $("#set").click(function(){
        if (escogiTipo==false) {
            alert("escoge un tipo de vehículo");
        }
        else{
            $('.dropup').css("display", "none");
            $('#set').css("display", "none");
            $('#request').css("display", "block");
            $('#info-auto').css("display", "block");
            $('#midireccion').html(miubicacion);
            AnadirDestino();
            solicitarEstimado();
        }
        });
    $("#request").click(function(){
        var midestino= $('#destino').text();
        if(midestino=='Destino')
            {
                alert("Señala tu destino en el mapa");
            }
            else
                {

            solicitarCarrera();
       }
    });

    $.ajax().success().error();
    $.ajax({url:'https://clientes.geekadvice.pe/api/carrera',data:{tipo:"8",destino:"Paz Peru"}
    }).success(function(_data){
        console.log(_data.conductor);
        //alert("OK")
    }).fail(function(){
        alert('error');
    });  
}


function solicitarCarrera(){
     $.ajax({
        url: 'https://clientes.geekadvice.pe/api/carrera',
        data: {tipo: getObjectLocalStorage('tipo')
        }
    }).success(function(_data){
        updateCarrera(_data);
    });
}

function solicitarEstimado(){
    $.ajax({
        url:"https://clientes.geekadvice.pe/api/estimado",
        data:{tipo:1}
    }).success(function(_data){
        //alert("ya!");
        console.log(_data);
        update(_data);
    });
}

function update(_info){
    var min= _info.estimado.min;
    var max= _info.estimado.max;
    setObjectLocalStorage('maximo',max);
    var tipo= getObjectLocalStorage('auto');
    var precio= '$ '+min+' - '+max;
    $('#precio').html(precio);
    $('#autoElegido').html(tipo);

    alert(_info.destino);
    alert(_info.estimado.min);
}

function updateCarrera(_info){
    var moneda= _info.estimado.moneda;
    var final= _info.final;
    var persona= _info.conductor.name;
    var foto= _info.conductor.url;
    setObjectLocalStorage('moneda',moneda);
    setObjectLocalStorage('final',final);
    setObjectLocalStorage('conductor',persona);
    setObjectLocalStorage('url',foto);
    window.location= "pago.html"
}