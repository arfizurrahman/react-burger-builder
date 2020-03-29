import React, { useState } from "react";
import { connect } from "react-redux";

import Auxiliary from "../Auxiliary/Auxiliary";
import classes from "./Layout.module.css";
import Toolbar from "../../components/Navigation/Toolbar/Toolbar";
import SideDrawer from "../../components/Navigation/SideDrawer/SideDrawer";

const layout = props => {

	const [showSideDrawer, setShowSideDrawer] = useState(false);

	const sideDrawerClosedHandler = () => {
        setShowSideDrawer(false)
	};

	const sideDrawerToggleHandler = () => {
		setShowSideDrawer(!showSideDrawer);
	};

	return (
		<Auxiliary>
			<Toolbar
				isAuth={props.isAuthenticated}
				drawerToggleClicked={sideDrawerToggleHandler}
			/>
			<SideDrawer
				isAuth={props.isAuthenticated}
				closed={sideDrawerClosedHandler}
				open={showSideDrawer}
			/>
			<main className={classes.Content}>{props.children}</main>
		</Auxiliary>
	);
};

const mapStateToProps = state => {
	return {
		isAuthenticated: state.auth.token !== null
	};
};

export default connect(mapStateToProps)(layout);
