(function(){
  'use strict';

  window.app = {};

  app.alertMessage = function(){
      ons.notification.alert('Tapped!');
  };

  app.showDetail = function(index) {
    document.querySelector('#myNavigator').pushPage('detail.html',
      {
        data : {
          itemIndex: index
        }
      }
    );
  };

  var items = [
    {
        title: 'ÇÕÇ∂Ç‹ÇËÇÃäC',
        label: 'WORLD 1',
        thumbnail: 'images/Background/sample1.png'
    },
    {
        title: 'ê·å¥ÇÃëÂín',
        label: 'WORLD 2',
        thumbnail: 'images/Background/sample3.png'
    },
  {
      title: 'ééó˚ÇÃçªîô',
      label: 'WORLD 3',
      thumbnail: 'images/Background/sample4.png'
}
  ];

  document.addEventListener('init', function(event) {
    var page = event.target;
    if(page.id === "home-page") {
      var onsListContent = document.querySelector('#main-list').innerHTML;

      items.forEach(function(item, index) {
        var onsListItem = '<ons-list-item tappable onclick="app.showDetail(' + index + ')">' +
            '<div class="left">' +
              '<div class="list__item__thumbnail picture" style="background-image:url(' + item.thumbnail + ');"></div>' +
            '</div>' +
            '<div class="center">' +
              '<div class="list__item__title">' + item.title + '</div>' +
              '<span class="label">' + item.label + '</span>' +
            '</div>' +
          '</ons-list-item>'
        ;

        onsListContent += onsListItem;
      });

      document.querySelector('#main-list').innerHTML = onsListContent;
    }

    if(page.id === "detail-page") {
      var item = items[(page.data || {}).itemIndex] || {};
      page.querySelector('#title').innerHTML = item.title || 'foo';
      // page.querySelector('#desc').innerHTML = item.desc || 'bar';
      page.querySelector('#label').innerHTML = item.label || 'baz';
      page.querySelector('.list__item__thumbnail').setAttribute('style', 'background-image:url(' + item.thumbnail + ');')

      var i = 5,
        onsListContent = '',
        onsListItem = document.querySelector('#lorem-list').innerHTML;

      while(i--) {
          var onsListItem = '<ons-list-item tappable>' +
              '<div class="left">' +
                '<div class="list__item__title">STAGE ' + (5 - i) + '</div>' +
              '</div>' +
            '</ons-list-item>'
          ;
          onsListContent += onsListItem;
      }

      document.querySelector('#lorem-list').innerHTML = onsListContent;
    }

  });

})();
