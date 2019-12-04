import React from 'react'

function EntityInfo(props){
    return (
        <div>
            <h2>{props.name}</h2> 
            <p>{props.description}</p>
            <button>Edit</button>
        </div>
    )
}

export default EntityInfo