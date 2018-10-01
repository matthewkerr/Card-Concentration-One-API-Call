import React from 'react';
import cardBack from '../../assets/playing-card-back.png';
const Card = (props) => {
    let newClass = props.class + " empty"
    let imagePath = props.facedown ? cardBack : props.imagePath;
    if ( props.matched ) { imagePath = "" }

    return( 
        <div onClick={ props.matched ? null : props.clicked} className={newClass}>
        <img width="100" src={ imagePath } />
        </div>
    );
}

export default Card;