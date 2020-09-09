import React from 'react'

export default (props) => {
    console.log(props)

    return (
    <span>
        { props.number && typeof parseInt(props.number) == 'number' ? Math.pow(props.number,2) : 'Invalid number' } { !!props.unit && props.unit }
    </span>
    )
}