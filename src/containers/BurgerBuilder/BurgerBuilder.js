import React, { useState, useEffect, useCallback } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import axios from "../../axios-orders";

import Auxiliary from "../../hoc/Auxiliary/Auxiliary";
import Burger from "../../components/Burger/Burger";
import BuildControls from "../../components/Burger/BuildControls/BuildControls";
import Modal from "../../components/UI/Modal/Modal";
import OrderSummary from "../../components/Burger/OrderSummary/OrderSummary";
import Spinner from "../../components/UI/Spinner/Spinner";
import withErrorHandler from "../../hoc/withErrorHandler/withErrorHandler";
import * as actions from "../../store/actions/index";

const burgerBuilder = props => {
	const [purchasing, setPurchasing] = useState(false);

  const dispatch = useDispatch();

  const ings = useSelector(state => state.burgerBuilder.ingredients);
  const price = useSelector(state => state.burgerBuilder.totalPrice);
  const error = useSelector(state => state.burgerBuilder.error);
  const isAuthenticated = useSelector(state => state.auth.token !== null);

	const onIngredientAdded = useCallback(ingName => dispatch(actions.addIngredient(ingName)), []);
	const onIngredientRemoved = useCallback(ingName => dispatch(actions.removeIngredient(ingName)),[]);
	const onInitIngredients = useCallback(() => dispatch(actions.initIngredients()), []);
	const onInitPurchase = useCallback(() => dispatch(actions.purchaseInit()), []);
	const onSetAuthRedirectPath = useCallback(path => dispatch(actions.setAuthRedirectPath(path)), []);
    
	useEffect(() => {
		onInitIngredients();
	}, [onInitIngredients]);

	const updatePurchaseState = ingredients => {
		const sum = Object.keys(ingredients)
			.map(igKey => {
				return ingredients[igKey];
			})
			.reduce((sum, el) => {
				return sum + el;
			}, 0);

		return sum > 0;
	};

	const purchaseHandler = () => {
		if (isAuthenticated) {
			setPurchasing(true);
		} else {
			onSetAuthRedirectPath("/checkout");
			props.history.push("/auth");
		}
	};

	const purchaseCancelHandler = () => {
		setPurchasing(false);
	};

	const purchaseContinueHandler = () => {
		onInitPurchase();
		props.history.push("/checkout");
	};

	const disabledInfo = {
		...ings
	};

	for (let key in disabledInfo) {
		disabledInfo[key] = disabledInfo[key] <= 0;
	}
	let orderSummary = null;

	let burger = error ? (
		<p>Ingredients can't be loaded!</p>
	) : (
		<Spinner />
	);

	if (ings) {
		burger = (
			<Auxiliary>
				<Burger ingredients={ings} />
				<BuildControls
					purchasable={updatePurchaseState(ings)}
					price={price}
					disabled={disabledInfo}
					ordered={purchaseHandler}
					isAuth={isAuthenticated}
					ingredientAdded={onIngredientAdded}
					ingredientRemoved={onIngredientRemoved}
				/>
			</Auxiliary>
		);
		orderSummary = (
			<OrderSummary
				price={price}
				purchaseCancelled={purchaseCancelHandler}
				purchaseContinued={purchaseContinueHandler}
				ingredients={ings}
			/>
		);
	}

	return (
		<Auxiliary>
			<Modal show={purchasing} modalClosed={purchaseCancelHandler}>
				{orderSummary}
			</Modal>
			{burger}
		</Auxiliary>
	);
};

const mapStateToProps = state => {
	return {
		ings: state.burgerBuilder.ingredients,
		price: state.burgerBuilder.totalPrice,
		error: state.burgerBuilder.error,
		isAuthenticated: state.auth.token !== null
	};
};

const mapDispatchToProps = dispatch => {
	return {
		onIngredientAdded: ingName => dispatch(actions.addIngredient(ingName)),
		onIngredientRemoved: ingName =>
			dispatch(actions.removeIngredient(ingName)),
		onInitIngredients: () => dispatch(actions.initIngredients()),
		onInitPurchase: () => dispatch(actions.purchaseInit()),
		onSetAuthRedirectPath: path =>
			dispatch(actions.setAuthRedirectPath(path))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withErrorHandler(burgerBuilder, axios));
