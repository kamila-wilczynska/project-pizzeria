
import { templates, select, settings, classNames  } from '../settings.js';
import utils from '../utils.js';
import AmountWidget from './amountWidget.js';
import DatePicker from './datePicker.js';
import HourPicker from './hourPicker.js';

class Booking {
  constructor(element) {
    const thisBooking = this;
    
    
	
    thisBooking.render(element);	
    thisBooking.initWidgets();
    thisBooking.getData();
    thisBooking.initTables();
    thisBooking.Starter();
    

  }

  getData(){
    const thisBooking = this;

    const startDateParam = settings.db.dateStartParamKey + '=' + utils.dateToStr(thisBooking.datePicker.minDate);
    const endDateParam = settings.db.dateEndParamKey + '=' + utils.dateToStr(thisBooking.datePicker.maxDate);

    const params = {
      booking: [
        startDateParam,
        endDateParam,
      ],
      eventsCurrent: [
        settings.db.notRepeatParam,
        startDateParam,
        endDateParam,
      ],
      eventsRepeat: [
        settings.db.repeatParam,
        endDateParam,
      ],
    };

    // console.log('getData params', params);

    const urls = {
      booking:       settings.db.url + '/' + settings.db.bookings
                                     + '?' + params.booking.join('&'),
      eventsCurrent: settings.db.url + '/' + settings.db.events  
                                     + '?' + params.eventsCurrent.join('&'),
      eventsRepeat:  settings.db.url + '/' + settings.db.events  
                                     + '?' + params.eventsRepeat.join('&'),
    };

    // console.log('getData urls', urls);

    Promise.all([
      fetch(urls.booking),
      fetch(urls.eventsCurrent),
      fetch(urls.eventsRepeat),
    ])
      .then(function(allResponses){
        const bookingsResponse = allResponses[0];
        const eventsCurrentResponse = allResponses[1];
        const eventsRepeatResponse = allResponses[2];
        return Promise.all([
          bookingsResponse.json(),
          eventsCurrentResponse.json(),
          eventsRepeatResponse.json(),
        ]);
      })
      .then(function([bookings, eventsCurrent, eventsRepeat]){
        console.log(bookings);
        console.log(eventsCurrent);
        console.log(eventsRepeat);
        thisBooking.parseData(bookings, eventsCurrent, eventsRepeat);
      });
  }

  parseData(bookings, eventsCurrent, eventsRepeat){
    const thisBooking = this;

    thisBooking.booked = {};

    for(let item of bookings){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    for(let item of eventsCurrent){
      thisBooking.makeBooked(item.date, item.hour, item.duration, item.table);
    }

    const minDate = thisBooking.datePicker.minDate;
    const maxDate = thisBooking.datePicker.maxDate;
    
    for(let item of eventsRepeat){
      if(item.repeat == 'daily'){
        for(let loopDate = minDate; loopDate <= maxDate; loopDate = utils.addDays(loopDate, 1)){
          thisBooking.makeBooked(utils.dateToStr(loopDate), item.hour, item.duration, item.table);
        }
      }
    }
    //console.log('thisBooking.booked', thisBooking.booked);

    thisBooking.updateDOM();
  }

  makeBooked(date, hour, duration, table){
    const thisBooking = this;

    if(typeof thisBooking.booked[date] == 'undefined'){
      thisBooking.booked[date] = {};
    }

    const startHour = utils.hourToNumber(hour);

    for(let hourBlock = startHour; hourBlock < startHour + duration; hourBlock += 0.5){
      // console.log('loop', hourBlock);

      if(typeof thisBooking.booked[date][hourBlock] == 'undefined'){
        thisBooking.booked[date][hourBlock] = [];
      }
  
      thisBooking.booked[date][hourBlock].push(table);
    }
  }

  updateDOM(){
    const thisBooking = this;

    thisBooking.date = thisBooking.datePicker.value;
    thisBooking.hour = utils.hourToNumber(thisBooking.hourPicker.value);

    let allAvailable = false;

    if(
      typeof thisBooking.booked[thisBooking.date] == 'undefined'
      ||
      typeof thisBooking.booked[thisBooking.date][thisBooking.hour] == 'undefined'
    ){
      allAvailable = true;
    }

    for(let table of thisBooking.dom.tables){
      let tableId = table.getAttribute(settings.booking.tableIdAttribute);
      if(!isNaN(tableId)){
        tableId = parseInt(tableId);
      }

      if(
        !allAvailable
        &&
        thisBooking.booked[thisBooking.date][thisBooking.hour].includes(tableId)
      ){
        table.classList.add(classNames.booking.tableBooked);
      } else {
        table.classList.remove(classNames.booking.tableBooked);
      }
    }
  }

  initTables() {
    const thisBooking = this;

    for(let table of thisBooking.dom.tables){
      table.addEventListener('click', function(event){
        if(event.target.classList.contains(classNames.booking.tableBooked)){
          alert('Ten stolik jest już zajęty');
        }
        const clickedTable = table.getAttribute('data-table');
        if(!event.target.classList.contains(classNames.booking.tableSelected)){
          for(let lastTable of thisBooking.dom.tables){
            if(lastTable.classList.contains(classNames.booking.tableSelected)){
              lastTable.classList.remove(classNames.booking.tableSelected);
              const index = thisBooking.selectedTable.indexOf(clickedTable);
              thisBooking.selectedTable.splice(index, 1);
            }
          }
          event.target.classList.add(classNames.booking.tableSelected); 
          thisBooking.selectedTable.push(clickedTable);
        } else {
          event.target.classList.remove(classNames.booking.tableSelected);
          const index = thisBooking.selectedTable.indexOf(clickedTable);
          thisBooking.selectedTable.splice(index, 1);
        }
        
      });
      thisBooking.dom.wrapper.addEventListener('updated', function(){
        table.classList.remove(classNames.booking.tableSelected);
        thisBooking.selectedTable = [];
        console.log( thisBooking.selectedTable);
      });
     
    }  
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
    thisBooking.dom.datePicker = thisBooking.dom.wrapper.querySelector(select.widgets.datePicker.wrapper);
    thisBooking.dom.hourPicker = thisBooking.dom.wrapper.querySelector(select.widgets.hourPicker.wrapper);
    thisBooking.dom.tables = thisBooking.dom.wrapper.querySelectorAll(select.booking.tables);
    thisBooking.dom.floorPlan = thisBooking.dom.wrapper.querySelector(select.booking.floorPlan);
    thisBooking.dom.starter = thisBooking.dom.wrapper.querySelector(select.booking.starters);
  }

  initWidgets(){
    const thisBooking = this;

    thisBooking.peopleAmount = new AmountWidget(thisBooking.dom.peopleAmount);
    thisBooking.dom.peopleAmount.addEventListener('updated', function(){
      
    }); 

    thisBooking.hoursAmount = new AmountWidget(thisBooking.dom.hoursAmount);
    thisBooking.dom.hoursAmount.addEventListener('updated', function(){
      
    });

    thisBooking.datePicker = new DatePicker(thisBooking.dom.datePicker);
    thisBooking.hourPicker = new HourPicker(thisBooking.dom.hourPicker);

    thisBooking.dom.wrapper.addEventListener('updated', function(){
      thisBooking.updateDOM();
    });
    thisBooking.dom.floorPlan.addEventListener('clicked', function(){

    });
	
  }

  Starter(event){
    const thisBooking = this;

    thisBooking.dom.starter.addEventListener('click', function(){

      const starter = event.target;
      if(event.target.type == 'checkbox' && event.target.tagName == 'INPUT'&& event.target.name == 'starter'){
        if(starter.checked){
          thisBooking.starters.push(starter.value);          
        } else if (!starter.checked){
          const starterId = thisBooking.starters.indexOf(starter.value);
          thisBooking.starters.splice(starterId, 1);
        }        
		
      }
    });
  }
  sendOrder(){
    const thisBooking = this;

    const url = settings.db.url + '/' + settings.db.bookings;

    const sendload = {
      'date': thisBooking.datePicker.value,
      'hour': thisBooking.hourPicker.value, //(w formacie HH:ss)
      'table': thisBooking.booking.tableIdAttribute,
      'duration': thisBooking.hoursAmount.value,
      'ppl': thisBooking.peopleAmount.value,
      'starters': thisBooking.starters,
      'phone': thisBooking.select.cart.phone,
      'address': thisBooking.dom.address.value,
    };

    
    thisBooking.makeBooked(sendload.date, sendload.hour, sendload.duration, sendload.table);
    

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(sendload),
    };
      
    fetch(url, options);
    thisBooking.updateDOM;

  }
}
	
export default Booking;