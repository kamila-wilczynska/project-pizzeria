import {settings, select, classNames, } from './settings.js';  
import Product from './components/product.js';
import Cart from './components/cart.js';
import Booking from './components/Booking.js';
import Home from './components/home.js';
  
const app = {

  initPages: function () {
    const thisApp = this;
		
    thisApp.pages = document.querySelector(select.containerOf.pages).children;
    thisApp.navLinks = document.querySelectorAll(select.nav.links);
		
		
    const idFromHash = window.location.hash.replace('#/', '');
    console.log('idFromHash', idFromHash);
		
    let pageMatchingHash = thisApp.pages[0].id;
		
    for (let page of thisApp.pages) {
      if (page.id == idFromHash) {
        pageMatchingHash = page.id;
        break;
      }
    }
    
    thisApp.activatePage(pageMatchingHash);

    //Listenery do podstron	
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

  initHome: function(){
    const thisApp = this;
    const homeWidget = document.querySelector(select.containerOf.home);
    thisApp.home = new Home(homeWidget);
  },

  initCart: function(){
    const thisApp = this;

    const cartElem = document.querySelector(select.containerOf.cart);
    thisApp.cart = new Cart(cartElem);

    thisApp.productList = document.querySelector(select.containerOf.menu);

    thisApp.productList.addEventListener('add-to-cart', function(event){
      app.cart.add(event.detail.product);
    });
  },

  initMenu: function(){
    const thisApp = this;  

    for (let productData in thisApp.data.products){
      new Product(thisApp.data.products[productData].id, thisApp.data.products[productData]);
    }
  },

  

  initData: function(){
    const thisApp = this;

    thisApp.data = {};

    const url = settings.db.url + '/' + settings.db.products;

    fetch(url)
      .then(function(rawResponse){
        return rawResponse.json();
      })
      .then(function(parsedResponse){
        thisApp.data.products = parsedResponse;
        thisApp.initMenu();

      });
  },
 
  initBooking:function(){
    const thisApp = this;
    
    const reservationWidget = document.querySelector(select.containerOf.booking);
    thisApp.booking = new Booking(reservationWidget);

  },

  init: function(){
    const thisApp = this;
    //console.log('*** App starting ***');
    //console.log('thisApp:', thisApp);
    //console.log('classNames:', classNames);
    //console.log('settings:', settings);
    //console.log('templates:', templates);
    thisApp.initPages();
    thisApp.initHome();
    thisApp.initData();
    thisApp.initCart();
    thisApp.initBooking();
    
  },
};

app.init();
 