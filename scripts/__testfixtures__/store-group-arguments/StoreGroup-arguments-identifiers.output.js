// LICENSE : MIT
"use strict";
import { StoreGroup } from "almin";
import CartStore from "./CartStore/CartStore";
import ProductStore from "./ProductStore/ProductStore";
import CustomerStore from "./CustomerStore/CustomerStore";
// repository
import productRepository from "../infra/ProductRepository";
import cartRepository from "../infra/CartRepository";
import customerRepository from "../infra/CustomerRepository";
export default class AppStore {
    /**
     * @returns {StoreGroup}
     */
    static create() {
        let cartStore = new CartStore(cartRepository);
        let customerStore = new CustomerStore(customerRepository);
        let productStore = new ProductStore(productRepository);
        return new StoreGroup({
            "cart": cartStore,
            "customer": customerStore,
            "product": productStore
        });
    }
}