


import { settings, select, classNames } from './settings.js';
import Product from './components/products.js';
import Cart from './components/cart.js';
import Booking from './components/Booking.js';





const app = {
  initPages: function () {
    const thisApp = this;
	
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
    
	
    const idFromHash = window.location.hash.replace('#/', '');
	
    let pageMatchingHash = thisApp.pages[0].id;
	
    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    //Listenery do podstron
    thisApp.activatePage(pageMatchingHash);
	
    for (let link of thisApp.navLinks) {
      link.addEventListener('click', function (event) {
        const clickedElement = this;
        event.preventDefault();
	
        const id = clickedElement.getAttribute('href').replace('#', '');
	
        thisApp.activatePage(id);
	
        window.location.hash = '#/' + id;
      });
    }
  },
	
  activatePage: function (pageId) {
    const thisApp = this;
    // add class'active' to matching PAGES, remove from non-matching
    for (let page of thisApp.pages) {
      page.classList.toggle(classNames.pages.active, page.id == pageId);
    }
    // add class'active' to matching LINKS, remove from non-matching
    for (let link of thisApp.navLinks) {
      link.classList.toggle(classNames.nav.active, link.getAttribute('href') == '#' + pageId);
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

  initBooking: function(){
    const thisApp = this;
    
    const reservationWidget = document.guerySelector(select.containerOf.booking);
    thisApp.booking = new Booking(reservationWidget);

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
    thisApp.initBooking();

  },
};



app.init();
