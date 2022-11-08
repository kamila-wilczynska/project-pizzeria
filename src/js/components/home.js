
import { templates, } from '../settings.js';

class Home {
  constructor(element) {
    const thisHome = this;

    thisHome.render(element);
    thisHome. initCarousel();
    


  }


  render(element) {
    const thisHome = this;

    const generatedHTML = templates.homePageWidget;

    thisHome.dom = [];
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
  }

  initCarousel(){
    const elem = document.querySelector('.main-carousel');
    console.log(elem);
    // eslint-disable-next-line no-undef
    const flkty = new Flickity( elem, {
      cellAlign: 'left',
      contain: true
 
    });
    
    console.log(flkty);

  }
  
}



export default Home;