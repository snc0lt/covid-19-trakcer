import React from 'react'
import { Map as LeafMap, TileLayer } from "react-leaflet";
import './Map.css'
import { showDataOnMap } from './utils';
function Map( { center, zoom, countries, casesType }) {
  return (
    <div className='map'>
      <LeafMap center={center} zoom={zoom}>
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; <a href='http://osm.org/copyright'>OpenStreetMap</a> contributors"
        />
        {showDataOnMap(countries, casesType)}
      </LeafMap>
    </div>
  )
}

export default Map
