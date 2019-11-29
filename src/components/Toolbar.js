import React from 'react'
import AddRouteButton from './AddRouteButton'
import AddWaypointButton from './AddWaypointButton'

function Toolbar(){
    return (
        <div className='toolbar'>
            <AddWaypointButton/>
            <AddRouteButton/>
        </div>
    )
}

export default Toolbar