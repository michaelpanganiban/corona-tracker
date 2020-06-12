import React, {useState, useEffect} from 'react'

import {Popover, OverlayTrigger, ListGroup} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css'
import ReactMapGL, {Marker} from 'react-map-gl'

import { fetchCases } from "../redux/actions/action-map"
import { useSelector, useDispatch } from 'react-redux'


const Map = () => {
    const mapReducer = useSelector(state => state.reducerMap)
    const dispatch = useDispatch()
    const [viewport, setViewport] = useState({
        zoom: 1.5,
        width: '100vw',
        height: '100vh',
        center: [0, 20]
    })

    const ICON = `M20.2,15.7L20.2,15.7c1.1-1.6,1.8-3.6,1.8-5.7c0-5.6-4.5-10-10-10S2,4.5,2,10c0,2,0.6,3.9,1.6,5.4c0,0.1,0.1,0.2,0.2,0.3
  c0,0,0.1,0.1,0.1,0.2c0.2,0.3,0.4,0.6,0.7,0.9c2.6,3.1,7.4,7.6,7.4,7.6s4.8-4.5,7.4-7.5c0.2-0.3,0.5-0.6,0.7-0.9
  C20.1,15.8,20.2,15.8,20.2,15.7z`;
    const SIZE = 16;

    useEffect(()=>{
        const fetchCase = async () => {
            await fetch("data.json")
            .then(response => response.json())
            .then(data => {
                dispatch(fetchCases(data))
            })
            .catch(err => {
                console.log(err);
            })
        }
        fetchCase()
    },[])
    const {places, reports} = mapReducer.cases

    const convertDate = (dt) =>{
        let d = new Date(dt)
        return d.getDate() +' '+ months(parseInt(d.getMonth())) + ' ' + d.getFullYear()
    }
    const months = (index) => {
        let month = new Array();
        month[0] = "January";
        month[1] = "February";
        month[2] = "March";
        month[3] = "April";
        month[4] = "May";
        month[5] = "June";
        month[6] = "July";
        month[7] = "August";
        month[8] = "September";
        month[9] = "October";
        month[10] = "November";
        month[11] = "December";

        return month[index];
    }
   
    const UpdatingPopover = React.forwardRef(
        ({children,  ...props }, ref) => {
            const country = places.find(place => place.id === children.placeId)
            return (
                <Popover id="popover-contained" ref={ref} content {...props}>
                    <Popover.Title as="h3">{country.name} | {country.country}</Popover.Title>
                    <Popover.Content>
                    <ListGroup variant="flush">
                        <ListGroup.Item><b>Date:</b> {convertDate(children.date)}</ListGroup.Item>
                        <ListGroup.Item><b>Infected:</b> {(children.infected)? children.infected: 0}</ListGroup.Item>
                        <ListGroup.Item><b>Recovered:</b> {(children.recovered)? children.recovered: 0}</ListGroup.Item>
                        <ListGroup.Item><b>Dead:</b> {(children.dead)? children.dead: 0}</ListGroup.Item>
                    </ListGroup>
                    </Popover.Content>
                </Popover>
            );
        },
    )
    
    return (
            <div>
                {/* <OverlayTrigger trigger="click" placement="right" overlay={popover}>
                    <Button variant="success">Click me to see</Button>
                </OverlayTrigger> */}
                <ReactMapGL
                    {...viewport}
                    mapboxApiAccessToken = {'pk.eyJ1IjoibWlrZWxpY2lvdXMiLCJhIjoiY2tiMGJlZngwMDY4cDJ6bXV3dWF0cjJwcCJ9.zw69qwm7_FCWvLfmHfEAqw'}
                    mapStyle="mapbox://styles/mapbox/dark-v10"
                    onViewportChange = {(viewport) => setViewport(viewport)}
                >
                    {
                        reports && reports.filter(report => !report.hide).map(m => {
                            const currentPlace = places.find(place => place.id === m.placeId)
                            let color = ''
                            if(m.infected < 10)
                                color = 'grey'
                            else if(m.infected > 10 && m.infected < 100)
                                color = 'blue'
                            else
                                color = 'red' 
                            return (
                                
                                  <Marker     
                                      key = {m.id}
                                      latitude={currentPlace.latitude}
                                      longitude={currentPlace.longitude}
                                  >
                                    <svg
                                        height={SIZE}
                                        viewBox="0 0 24 24"
                                        style={{
                                            cursor: 'pointer',
                                            fill: `${color}`,
                                            stroke: 'white',
                                            transform: `translate(${-SIZE / 2}px,${-SIZE}px)`
                                        }}
                                    >
                                        <OverlayTrigger trigger="click" placement="right" overlay = {<UpdatingPopover id="popover-contained">{m}</UpdatingPopover>}>
                                          <path d={ICON} />
                                        </OverlayTrigger>
                                    </svg>
                                  </Marker>
                            )
                        })
                    }
                </ReactMapGL>
            </div>
    )
}

export default Map
