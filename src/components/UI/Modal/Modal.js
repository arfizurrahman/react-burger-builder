import React from "react";

import classes from "./Modal.module.css";
import Auxiliary from "../../../hoc/Auxiliary/Auxiliary";
import Backdrop from "../Backdrop/Backdrop";

const modal = props => {
	// shouldComponentUpdate(nextProps, nextState) {
	//     return nextProps.show !== props.show ||
	//     nextProps.children !== props.children;
	// }

	return (
		<Auxiliary>
			<Backdrop clicked={props.modalClosed} show={props.show} />
			<div
				className={classes.Modal}
				style={{
					transform: props.show
						? "translateY(0)"
						: "translateY(-100vh)",
					opacity: props.show ? "1" : "0"
				}}>
				{props.children}
			</div>
		</Auxiliary>
	);
};

export default React.memo(modal, (prevProps, nextProps) => {
    return nextProps.show === prevProps.show && nextProps.children === prevProps.children;
});
