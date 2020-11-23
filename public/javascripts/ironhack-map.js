function initMap() {

    // Crear mapa

    const mapInstance = new google.maps.Map(document.querySelector('#ironMap'),
        {
            center: directions.ironhackMad.coords,
            zoom: 5.5,
            styles: mapStyles.retro
        }
    )

    new google.maps.Marker({
        map: mapInstance,
        position: directions.ironhackMad.coords,
        title: directions.ironhackMad.title
    })

    new google.maps.Marker({
        map: mapInstance,
        position: directions.ironhackBcn.coords,
        title: directions.ironhackBcn.title
    })

    new google.maps.Marker({
        map: mapInstance,
        position: directions.ironhackPt.coords,
        title: directions.ironhackPt.title
    })
}