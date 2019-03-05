const { Carousel, Image, BrowseCarouselItem, BasicCard, Button } = require('actions-on-google');

module.exports ={
  getRandomMessage:(arr)=>{
    if(arr.length===1){
      return arr[0];
    }
    var index = (Math.floor(Math.random() * 100))% arr.length;
    return arr[index];
  },
  
  buildCarouselItem(obj,key,title,desc,image){
    obj[key]={
      title:title,
      description:desc,
      image:new Image({
        url:image,
        alt:`${key} - ${title}`
      })
    };
    return obj;
  },
  
  buildBrowserCarouselItem(title,desc,image,url,footer){
    return new BrowseCarouselItem({
      title: title,
      url: url,
      description: desc,
      image: new Image({
        url: image,
        alt: title,
      }),
      footer: footer,
    });
  },
  
   buildCardItem(title, subtitle, desc, button_title, button_url, image){
     return new BasicCard({
        title: title,
        subtitle: subtitle,
        text: desc,
        buttons: new Button({
          title: button_title,
          url: button_url,
        }),
        image: new Image({
          url: image,
          alt: title,
        }),
        display: 'CROPPED',
      });
  },
  
  isEmpty(val){
    if(val==='' || 
       val===undefined || 
       val==='undefined' || 
       val===null || val===[] || 
       (Object.keys(val).length === 0 && val.constructor === Object) ||
       (Array.isArray(val) && val.length===0)){
      return true;
    }
    return false;
  },
  
  sortByDateAsc(arr, date_attr){
    arr.sort(function(date1, date2){
      return date1[date_attr].getTime() - date2[date_attr].getTime();
    });
    return arr;
  }
};