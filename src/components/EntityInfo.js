import React from 'react'

function EntityInfo(props){
    return (
        <div>
            <h2>Name: {props.name}</h2> 
            <p>Description: {props.description}</p>
            <button>Edit</button>
            <button>Delete</button>
        </div>
    )
}

export default EntityInfo