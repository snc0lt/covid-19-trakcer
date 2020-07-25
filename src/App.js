import React, { useState, useEffect } from 'react';
import { Select, MenuItem, Card, CardContent } from '@material-ui/core';
import axios from 'axios'
import FormControl from '@material-ui/core/FormControl'
import InfoBox from './InfoBox';
import Map from './Map';
import Table from './Table';
import { sortData, prettyStats } from './utils'
import './App.css';
import Graph from './Graph';
import 'leaflet/dist/leaflet.css'

function App() {
  const [countries, setCountries] = useState([])
  const [country, setCountry] = useState('Worldwide')
  const [countryInfo, setCountryInfo] = useState(null)
  const [tableData, setTableData] = useState([])
  const [ mapCountries, setMapCountries ] = useState([])
  const [ casesType, setCasesType ] = useState('cases')
  const [ mapZoom, setMapZoom ] = useState(2.5)
  const [mapCenter, setMapcenter] = useState({
    lat: 34.80746,
    lng: -40.4796
  })

  useEffect(() => {
    const getData = async () => {
      const { data } = await axios.get('https://disease.sh/v3/covid-19/all')
      setCountryInfo(data)
    }
    getData()
  }, [])

  useEffect(() => {
    const getCountries = async () => {
      const { data } = await axios.get('https://disease.sh/v3/covid-19/countries')
      const countries = data.map(country => (
        {
          name: country.country,
          value: country.countryInfo.iso2
        }
      ))
      const sortedData = sortData(data)
      setMapCountries(data)
      setCountries(countries)
      setTableData(sortedData)
    }
    getCountries()
  }, [])

  const onCountryChange = async (e) => {
    const countryCode = e.target.value
    setCountry(countryCode)

    const url = countryCode === 'Worldwide' 
    ? 'https://disease.sh/v3/covid-19/all' 
    : `https://disease.sh/v3/covid-19/countries/${countryCode}`

    const {data} = await axios(url)
    setCountryInfo(data)
    setMapcenter([data.countryInfo.lat, data.countryInfo.long])
    setMapZoom(4)
  }

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid 19 tracker..!</h1>
          <FormControl className='app__dropdown'>
            <Select variant='outlined' value={country} onChange={onCountryChange}>
              <MenuItem value='Worldwide'>Worldwide</MenuItem>
              {
                countries.map(country => (
                  <MenuItem key={country.name} value={country.value}>{country.name}</MenuItem>
                ))
              }
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox 
          active={casesType === 'cases'} isOrange
          title='Coronaviru Case' onClick={e => setCasesType('cases')}
          cases={countryInfo && prettyStats(countryInfo.todayCases)} 
          total={countryInfo && prettyStats(countryInfo.cases)} />

          <InfoBox 
          active={casesType === 'recovered'} isGreen
          title='Recovered' onClick={e => setCasesType('recovered')}
          cases={countryInfo && prettyStats(countryInfo.todayRecovered)} 
          total={countryInfo && (prettyStats(countryInfo.recovered))} />

          <InfoBox 
          active={casesType === 'deaths'} isRed
          title='Death' onClick={e => setCasesType('deaths')}
          cases={countryInfo && prettyStats(countryInfo.todayDeaths)} 
          total={countryInfo && prettyStats(countryInfo.deaths)} />
        </div>
        <Map casesType={casesType} center={mapCenter} zoom={mapZoom} countries={mapCountries} />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases by Country</h3>
          <Table countries={tableData} />
          <h3 style={{marginBottom: '20px'}}>Worldwide new {casesType}</h3>
          <Graph className='app__graph' casesType={casesType}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
