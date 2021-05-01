import React from "react";

const CardBody = ({product, subscriber, toggle, change}) => {
    //const {product, subscriber} = props
    let style= "btn btn-primary"
    let text = "START"
    if (toggle) {
        style = "btn btn-danger"
        text = "STOP"
    }
  return (
    <div className="card-body">
      <p className="card-text">Product Count: {product}</p>
      <p className="card-text">Subscriber Count: {subscriber}</p>
      <button className={style} onClick={change}>
        {text}
      </button>{" "}      
    </div>
  );
}

export default CardBody;