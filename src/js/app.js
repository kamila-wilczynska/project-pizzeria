


import { settings, select} from './settings.js';
import Product from './components/product.js';
import Cart from './components/cart.js';

 

const app = {
  initMenu: function () {
    const thisApp = this;
    //console.log('thisApp.data', thisApp.data);
    for (let productData in thisApp.data.products) {
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },


  initData: function () {
    const thisApp = this;
    thisApp.data = {};
    const url = settings.db.url + '/' + settings.db.products;
    //connect with url
    fetch(url)
    //convert data to JS
      .then(function (rawResponse) {
        return rawResponse.json();
      })
    //show data in console
      .then(function (parsedResponse) {
        console.log('parsedResponse: ', parsedResponse);

        /* save parsedResponse at thisApp.data.products */
        thisApp.data.products = parsedResponse;
        
        /* execute initMenu method */
        thisApp.initMenu();

      });
    console.log('thisApp.data', JSON.stringify(thisApp.data));
  },
  initCart: function () {
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);
    
    thisApp.productList = document.querySelector(select.containerOf.menu);
    thisApp.productList.addEventListener('add-to-cart', function (event) {
      app.cart.add(event.detail.product);

    });
  },

  init: function () {
    const thisApp = this;
    // console.log('*** App starting ***');
    // console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);

    thisApp.initData();

    thisApp.initCart();

  },
};



app.init();
