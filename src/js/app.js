


import { settings, select, classNames } from './settings.js';
import Product from './components/product.js';
import Cart from './components/cart.js';





const app = {
  initPages: function () {
    const thisApp = this;

    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);

    thisApp.activatePage(thisApp.pages[0].id);

    for(let link of thisApp.navLinks){
      link.addEventListener('click', function(event){
        const clickedElement = this;
        event.preventDefault();

        /*get  page if href attribute */

        const id = clickedElement.getAttribute('href').replace('#', '');

        /*run thisApp.activatePage */
        thisApp.activatePage(id);
      });
    }


    
  },

  activatePage: function (pageId) {
    const thisApp = this;

    /*add class "active to matching pages, remove from non-matching" */
    for (let page of thisApp.pages) {
      page.classList.toggle(
        classNames.pages.active,
        page.id == pageId
      );
    }
    /*add class "active to matching links, remove from non-links" */
    for (let link of thisApp.navLinks) {
      link.classList.toggle(
        classNames.nav.active,
        link.getAttribute('href') == '#' + pageId
      );
  
    }

  },


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
    const url = settings.db.url + '/' + settings.db.product;
    
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
    thisApp.initPages();
    //thisApp.initMenu();

    thisApp.initData();

    thisApp.initCart();

  },
};



app.init();
