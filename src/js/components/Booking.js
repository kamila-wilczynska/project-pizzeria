
import { templates, select,  } from '../settings.js';
//import utils from '../utils.js';
import AmountWidget from './amountWidget.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    
    
	
    thisBooking.render(element);	
    thisBooking.initWidgets();
    thisBooking.getData();

  }

  render(element) {
    const thisBooking = this;
    //generate html from templates.bookingWidget
    const generatedHTML = templates.bookingWidget();

    //generate empty object
    thisBooking.dom = {};
    thisBooking.dom.wrapper = element; //reference for container
    thisBooking.dom.wrapper.innerHTML = generatedHTML;
	
    thisBooking.dom.peopleAmount = thisBooking.dom.wrapper.querySelector(select.booking.peopleAmount);
    thisBooking.dom.hoursAmount = thisBooking.dom.wrapper.querySelector(select.booking.hoursAmount);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('updated', function(){
      
    }); 

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('updated', function(){
      
    });
    
  }
}
	
export default Booking;