import React from 'react'

function EntityList(props){

    const listItems = []
    let key = 0

    for (const entity of props.entities){
        listItems.push(
            <li 
                key={key} 
                className={key===props.selected ? 'selected': ''}
                onClick={() => props.selectEntity(entity.id, true)}
            >
                    {entity.name}
            </li>)
        key += 1
    }

    return (
        <ul className='entity-list'>
            {listItems}
        </ul> 
    )
}

export default EntityList