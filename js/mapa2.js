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

function centrarMapa(position){
    miMapa.setZoom(18);
    miMapa.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
        map: miMapa,
        title:"Mi posición actual"
    });
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
   	solicitarEstimado();
    
};
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