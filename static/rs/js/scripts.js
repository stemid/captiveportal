$(document).ready(function () {

    // create custom testable modernizr objects
    Modernizr.addTest('ie7', $('.lt-ie8').length > 0);
    Modernizr.addTest('sliderexist', $('.flexslider').length > 0);
    //Modernizr.addTest('addthis', $('.addthis').length > 0);
    Modernizr.addTest('jqueryuiexist', $('.input-date, .diary-case-documents').length > 0);
    Modernizr.addTest('responsivetablesexists', $('.body table').length > 0);
    Modernizr.addTest('seachinputexist', $('input.search-input-field').length > 0);
    Modernizr.addTest('sortabletableexist', $('.sortable').length > 0);
    Modernizr.addTest('knockout', $('.knockout').length > 0);
    Modernizr.addTest('megamenuexists', $('.has-mega').length > 0);
    Modernizr.addTest('articlenavigationexists', $('.navigation-article').length > 0);
    Modernizr.addTest('carecenterexists', $('.care-center').length > 0);

    Modernizr.load([{
        // Test
        test: Modernizr.sliderexist,
        // If yes
        yep: { 'flexneeded': '/Static/js/plugins/jquery.flexslider-min.js' },
        callback: {
            'flexneeded': function (url, result, key) {
                jQuery(function () {

                    // Adapt maxitems by viewport
                    if (Modernizr.mq('only screen and (max-width: 650px)')) {
                        $maxSliderItems = 1;
                    }
                    else {
                        $maxSliderItems = 2;
                    }

                    //FLEXSLIDER MAIN FUNCTION
                    $('.rsk-slider').flexslider({
                        animation: "animate", slideshow: false, slideshowSpeed: 7000, animationSpeed: 600, useCSS: true, touch: true, controlNav: true, directionNav: false, controlsContainer: ".flexslider-control, .bullet-list", manualControls: ".flexslider-control li",
                        start: function () {
                            $('.rsk-slider .flex-viewport').fadeTo(10, 1, function () {
                                $('.flexslider-control').fadeTo(10, 1);
                            });
                            removeSliderTabIndex();
                        }
                    });// END FLEX SLIDER FUNCTION

                    //FLEXSLIDER FOOTER FUNTION
                    $('.rsk-footer-slider').flexslider({
                        animation: "animate", direction: "horizontal", slideshow: false, slideshowSpeed: 7000, animationLoop: false, useCSS: true, touch: true, directionNav: true, controlNav: false, itemWidth: 250, itemMargin: 0, minItems: $maxSliderItems, maxItems: $maxSliderItems
                    });

                    //FLEXSLIDER ARTICLE FUNTION
                    if ($('.rsk-article-slider').find('.slides li').length < 2) {
                        $('.rsk-article-slider').flexslider({
                            animation: "animate", direction: "horizontal", slideshow: false, slideshowSpeed: 7000, animationSpeed: 600, useCSS: true, touch: false,
                            start: function () {
                                $('.rsk-article-slider .flex-viewport').fadeTo(10, 1);
                                adjustSliderHeight();
                                removeSliderTabIndex();
                            }
                        });
                    } else {
                        $('.rsk-article-slider').flexslider({
                            animation: "animate", direction: "horizontal", slideshow: false, slideshowSpeed: 7000, animationSpeed: 600, useCSS: true, touch: true,
                            start: function () {
                                $('.rsk-article-slider .flex-viewport').fadeTo(10, 1);
                                adjustSliderHeight();
                                removeSliderTabIndex();
                            }
                        });
                    }
                    // END FLEX SLIDER FUNCTION

                })  //END JQUERY FUNTION
            }
        }
    },
    {
        test: Modernizr.ie7,
        yep: { 'ie7exists': '/Static/js/plugins/ie7.js' }
    },
    {
        test: Modernizr.megamenuexists,
        yep: { 'hoverIntent': '/Static/js/plugins/jquery.hoverIntent.r7.min.js' },
        callback: {
            'hoverIntent': function () {
                jQuery(function () {

                    var megamenuConfig = {
                        over: megamenuShow,
                        timeout: 200, //def 0
                        interval: 200, //def 100
                        sensitivity: 7, //def 100
                        out: megamenuHide
                    };
                    $('.has-mega').hoverIntent(megamenuConfig);

                }) // END JQUERY FUNC
            }
        }//END CALLBACK
    },
    {
        test: Modernizr.input.placeholder, //CHECK if placeholder plugin is needed
        nope: { 'placeholderneeded': '/Static/js/plugins/jquery.placeholder.min.js' },
        callback: {
            'placeholderneeded': function (url, res, key) {
                jQuery(function () {
                    $('input[type="text"], input[type="email"], input[type="number"], textarea').placeholder(); // init placeholder plugin
                })
            }
        }
    },
    //{
    //    test: Modernizr.addthis,
    //    yep: { 'activate-addthis': 'http://s7.addthis.com/js/300/addthis_widget.js' }/* ,
    //   callback: {
    //        'activate-addthis': function() {
    //            jQuery(function () {
    //                loadAddThis();
    //            })
    //        } 
    //    }*/
    //},

      {
          test: Modernizr.knockout, //CHECK if knockout is needed 
          yep: {
              'knockout': '//cdnjs.cloudflare.com/ajax/libs/knockout/2.3.0/knockout-min.js'
          },
          callback: {
              'knockout': function () {
                  jQuery(function () {

                      // Check if we are on a list page
                      if ($('#itemList').length > 0) {

                          function CheckValue(id) {
                              var val = document.getElementById(id).value;
                              if (/^\s*$/.test(val)) {
                                  //value is either empty or contains whitespace characters
                                  return false;
                              }
                              else {
                                  return val;
                              }
                          }

                          function Tag(data) {
                              this.Name = ko.observable(data.Name);
                              this.Id = ko.observable(data.Id);
                              this.IsActive = ko.observable(data.IsActive);
                          }

                          function FileLink(data) {
                              if (data) {
                                  this.LinkName = data.LinkName;
                                  this.Url = data.Url;
                                  this.CssClass = data.CssClass;
                                  if (data.CssClass == "multi-docs") {
                                      this.Target = "_self";
                                  } else {
                                      this.Target = "_blank";
                                  }
                              }
                          }

                          function ListItem(data) {
                              this.Title = ko.observable(data.Title);
                              this.Url = ko.observable(data.Url);
                              this.TeaserText = ko.observable(data.TeaserText);
                              this.TeaserImageUrl = ko.observable(data.TeaserImageUrl);
                              this.Category = ko.observable(data.Category);
                              this.PublishedDate = ko.observable(data.PublishedDate);
                              this.Day = ko.observable(data.EventStartDay);
                              this.Month = ko.observable(data.EventStartMonth);
                              this.DayMonth = ko.observable(data.EventStartDayMonth);
                              this.EndDayMonth = ko.observable(data.EventEndDayMonth);
                              this.Year = ko.observable(data.EventStartYear);
                              this.EndYear = ko.observable(data.EventEndYear);
                              this.CanOrder = ko.observable(data.CanOrder);
                              this.FileLink = ko.observable(new FileLink(data.FileLink));
                              this.ShowDate = ko.observable(data.ShowDate);
                              this.ShowEndDate = ko.observable(data.ShowEndDate);
                              this.ShowEndYear = ko.observable(data.ShowEndYear);
                              this.CourseStateClosed = ko.observable(data.CourseStateClosed);
                              this.CourseStateOpen = ko.observable(data.CourseStateOpen);
                              this.CourseStateFull = ko.observable(data.CourseStateFull);
                              this.CourseStateOld = ko.observable(data.CourseStateOld);
                              this.IsEducation = ko.observable(data.IsEducation);
                              this.EducationType = ko.observable(data.EducationType);
                              this.Languages = ko.observableArray([]);
                          }

                          function LanguageVersion(data) {
                              this.Title = ko.observable(data.Title);
                              this.Url = ko.observable(data.Url);
                          }

                          function CreateListItem(data) {
                              var item = new ListItem(data);
                              if (data.OtherLanguages) {
                                  var languages = [];
                                  for (j = 0; j < data.OtherLanguages.length; j++) {
                                      languages.push(new LanguageVersion(data.OtherLanguages[j]));
                                  }
                                  item.Languages(languages);
                              }
                              return item;
                          }

                          function ItemListModel() {
                              // Data
                              var self = this;

                              self.Items = ko.observableArray([]);
                              self.Scopes = ko.observableArray([]);
                              self.Roles = ko.observableArray([]);
                              self.Tags = ko.observableArray([]);
                              self.page = 1;
                              self.tagsToShow = 11;
                              self.hitsToShow = $('#hitsToShow').val()

                              // Empty handler but it's needed for the knockout foreach so do not remove
                              renderedHandler = function () { }

                              self.sortCategories = function () {
                                  $(".category-list li a").not(".active").each(function () {
                                      $(this).closest('li').remove();
                                      $(this).closest('li').appendTo('.category-list');
                                  });
                              }

                              self.getCategories = function (isClick) {
                                  var cats = [];
                                  var hash = location.hash.replace("#", "");
                                  $.each(hash.split("-").slice(0, -1), function (index, item) {
                                      if (item.indexOf('c') == 0) {
                                          var item = item.slice(1);
                                          cats.push(parseInt(item));
                                      }
                                  });
                                  return cats;
                              }

                              self.getRoles = function (isClick) {
                                  var roles = [];
                                  var hash = location.hash.replace("#", "");

                                  $.each(hash.split("-").slice(0, -1), function (index, item) {
                                      if (item.indexOf('r') == 0) {
                                          var item = item.slice(1);
                                          roles.push(parseInt(item));
                                      }
                                  });
                                  return roles;
                              }

                              self.getScope = function (isClick) {
                                  // Check if we got the value from the hidden else get it from the elements
                                  var scope = [];
                                  var queryScope = querystring('scope');
                                  if (queryScope.length) {
                                      return queryScope;
                                  }
                                  else {
                                      var hash = location.hash.replace("#", "");

                                      $.each(hash.split("-").slice(0, -1), function (index, item) {
                                          if (item.indexOf('s') == 0) {
                                              var item = item.slice(1);
                                              scope.push(parseInt(item));
                                          }
                                      });
                                      return scope;
                                  }
                              }


                              self.filterList = function (isClick) {
                                  $('#itemList').hide();
                                  $('#showMoreItemsLink').addClass('hide');
                                  $('#ajax-loader').show();
                                  $('#showMoreTagLink').addClass('hidden');
                                  // Reseting page
                                  self.page = 1;

                                  var cats = self.getCategories(isClick);
                                  var scope = self.getScope(isClick);
                                  var roles = self.getRoles(isClick);
                                  var from = $('#start-date').val();
                                  var to = $('#end-date').val()
                                  var showUpcoming = $('#showUpcoming').length && $('#showUpcoming').hasClass('active');
                                  var onlyOpen = $("#filterEduOpen").prop('checked');

                                  var datastring = "{" +
                                            "page:" + self.page +
                                            ",hitsToShow:" + self.hitsToShow +
                                            ",categories: [" + cats + "]" +
                                            ",scope: [" + scope + "]" +
                                            ",roles: [" + roles + "]" +
                                            ",filterFrom:\"" + from + "\"" +
                                            ",filterTo:\"" + to + "\"" +
                                            ",showUpcoming:" + showUpcoming
                                    + "}";
                                  var url = $('#filterUrl').val();
                                  url += "filter";

                                  $.ajax({
                                      type: "POST",
                                      url: url,
                                      data: datastring,
                                      contentType: "application/json; charset=utf-8",
                                      dataType: "json",
                                      success: function (filterModel) {
                                          // Populate items
                                          var items = [];

                                          for (i = 0; i < filterModel.ListItems.length; i++) {
                                              if (onlyOpen === true && filterModel.ListItems[i].CourseStateOpen === true && filterModel.ListItems[i].CourseStateOld === false) {
                                                  items.push(CreateListItem(filterModel.ListItems[i]));
                                              }
                                              else if (onlyOpen === false || onlyOpen === undefined) {
                                                  items.push(CreateListItem(filterModel.ListItems[i]));
                                              }
                                              else {
                                                  var filteredOut = $("#filteredOut").val();
                                                  $("#filteredOut").val(parseInt(filteredOut) + 1);
                                              }
                                          }
                                          self.Items(items);

                                          // Populate scope
                                          if (filterModel.Scopes != null) {
                                              self.Scopes(filterModel.Scopes);
                                          }

                                          // Populate roles
                                          if (filterModel.Roles != null) {
                                              self.Roles(filterModel.Roles);
                                          }

                                          // Populate tags
                                          var tags = [];
                                          for (i = 0; i < filterModel.Tags.length; i++) {
                                              tags.push(new Tag(filterModel.Tags[i]));
                                          }
                                          self.Tags(tags);

                                          if (self.Items().length == filterModel.TotalHits)
                                              $('#showMoreItemsLink').addClass('hide');
                                          else
                                              $('#showMoreItemsLink').removeClass('hide');

                                          $('.navigation-block .ajax-loader').hide();
                                          $('.navigation-block .filter-nav-list').show();
                                          $('.hidden-scope #show-scope-button').show();
                                          $('.hidden-cats #show-cats-button').show();
                                          $('#ajax-loader').hide();
                                          $('#itemList').show();
                                          $(".category-list li a").not(".active").each(function () {
                                              $(this).closest('li').remove();
                                              $(this).closest('li').appendTo('.category-list');
                                          });
                                          $('.category-nav:not(.hidden-cats) .category-list li:nth-child(n+' + self.tagsToShow + ')').hide();
                                          if ($('.category-nav:not(.hidden-cats) .category-list li').length > 10) {
                                              $('#showMoreTagLink').removeClass('hidden');
                                              $('#showMoreTagLink').bind('click', function (e) {
                                                  e.preventDefault(e);
                                                  $('.category-list li:nth-child(n+11)').show();
                                                  $('#showMoreTagLink').addClass('hidden');
                                              });
                                          };

                                          $("#clickCounter").val(1);
                                          var currentList = $("#itemList > li").length;

                                          if (onlyOpen && currentList < self.hitsToShow) {
                                              itemListModel.showMore(true);
                                              itemListModel.page++;
                                          }

                                          var pageQuery = window.location.search;
                                          var currentPage = pageQuery.substr(pageQuery.length - 1, pageQuery.length);

                                          if (currentPage > Math.round((currentList / itemListModel.hitsToShow))) {
                                              itemListModel.showMore(true);
                                              itemListModel.page = currentPage;
                                          }
                                      }
                                  });
                                  var sort = self.sortCategories();
                              }

                              self.showMore = function (isClick) {
                                  $('#showMoreItemsLink').hide();
                                  $('#ajax-loader').show();
                                  $('#showMoreTagLink').addClass('hidden');
                                  var cats = self.getCategories(isClick);
                                  var scope = self.getScope(isClick);
                                  var roles = self.getRoles(isClick);
                                  var from = $('#start-date').val();
                                  var to = $('#end-date').val()
                                  var showUpcoming = $('#showUpcoming').length && $('#showUpcoming').hasClass('active');
                                  var onlyOpen = $("#filterEduOpen").prop('checked');

                                  var datastring = "{" +
                                            "page:" + self.page +
                                            ",hitsToShow:" + self.hitsToShow +
                                            ",categories: [" + cats + "]" +
                                            ",scope: [" + scope + "]" +
                                            ",roles: [" + roles + "]" +
                                            ",filterFrom:\"" + from + "\"" +
                                            ",filterTo:\"" + to + "\"" +
                                            ",showUpcoming:" + showUpcoming
                                    + "}";
                                  var url = $('#filterUrl').val();
                                  url += "filter";

                                  $.ajax({
                                      type: "POST",
                                      url: url,
                                      data: datastring,
                                      contentType: "application/json; charset=utf-8",
                                      dataType: "json",
                                      success: function (filterModel) {

                                          for (i = 0; i < filterModel.ListItems.length; i++) {

                                              if (onlyOpen === true && filterModel.ListItems[i].CourseStateOpen === true && filterModel.ListItems[i].CourseStateOld === false) {
                                                  self.Items.push(new ListItem(filterModel.ListItems[i]));
                                              }
                                              else if (onlyOpen === false || onlyOpen === undefined) {
                                                  self.Items.push(new ListItem(filterModel.ListItems[i]));
                                              }
                                              else {
                                                  var filteredOut = $("#filteredOut").val();
                                                  $("#filteredOut").val(parseInt(filteredOut) + 1);
                                              }

                                          }

                                          // Populate scope
                                          if (filterModel.Scopes != null) {
                                              self.Scopes(filterModel.Scopes);
                                          }

                                          // Populate roles
                                          if (filterModel.Roles != null) {
                                              self.Roles(filterModel.Roles);
                                          }

                                          // Populate tags
                                          var tags = [];
                                          for (i = 0; i < filterModel.Tags.length; i++) {
                                              tags.push(new Tag(filterModel.Tags[i]));
                                          }
                                          self.Tags(tags);

                                          if (self.Items().length + parseInt($("#filteredOut").val()) >= filterModel.TotalHits)
                                              $('#showMoreItemsLink').addClass('hide');

                                          $('#ajax-loader').hide();
                                          $('#showMoreItemsLink').show();

                                          var currentList = $("#itemList > li").length;
                                          var shouldbe = self.hitsToShow * $("#clickCounter").val();

                                          if (onlyOpen && currentList < shouldbe) {
                                              itemListModel.showMore(true);
                                              itemListModel.page++;
                                          }

                                          var pageQuery = window.location.search;
                                          var currentPage = pageQuery.substr(pageQuery.length - 1, pageQuery.length);

                                          if (currentPage > Math.round((currentList / itemListModel.hitsToShow))) {
                                              itemListModel.showMore(true);
                                              itemListModel.page = currentPage;
                                          } else {

                                              var origin = window.location.origin;
                                              var path = window.location.pathname;
                                              var hash = window.location.hash;
                                              var newUrl = path + "?page=" + itemListModel.page + hash;

                                              window.history.pushState("test", "testar", newUrl);

                                              if (currentList > itemListModel.hitsToShow) {

                                                  var Nth = currentList - itemListModel.hitsToShow - 1;
                                                  var elem = $("#itemList > li:nth(" + Nth + ")");

                                                  $('html, body').animate({
                                                      scrollTop: elem.offset().top
                                                  }, 500);
                                              }

                                          }
                                      }
                                  });
                              }
                          }

                          var itemListModel = new ItemListModel();
                          itemListModel.filterList();

                          function UpdateUrlHash(type, id, isAdd) {
                              var caturl = type + id + '-';
                              var activecats = window.location.hash
                              activecats = activecats.replace(caturl, "");
                              if (isAdd)
                                  activecats += caturl;
                              window.location.hash = activecats;
                          }

                          // Binding click events
                          ko.bindingHandlers.tagClick = {
                              init: function (element, valueAccessor) {

                                  element.onclick = function (evt) {
                                      $(this).toggleClass('active');
                                      // URL HASH UPDATE
                                      if ($(this).hasClass('active')) {
                                          UpdateUrlHash('c', $(this).attr('id'), true);
                                      }
                                      else {
                                          UpdateUrlHash('c', $(this).attr('id'));
                                      }

                                      itemListModel.filterList(true);
                                  }
                              }
                          }
                          ko.bindingHandlers.roleClick = {
                              init: function (element, valueAccessor) {

                                  element.onclick = function (evt) {
                                      // URL HASH UPDATE
                                      if ($(this).prop('checked')) {
                                          UpdateUrlHash('r', $(this).attr('id'), true);
                                      }
                                      else {
                                          UpdateUrlHash('r', $(this).attr('id'));
                                      }

                                      itemListModel.filterList(true);
                                  }
                              }
                          }
                          ko.bindingHandlers.scopeClick = {
                              init: function (element, valueAccessor) {

                                  element.onclick = function (evt) {
                                      // URL HASH UPDATE
                                      if ($(this).prop('checked')) {
                                          UpdateUrlHash('s', $(this).attr('id'), true);
                                      }
                                      else {
                                          UpdateUrlHash('s', $(this).attr('id'));
                                      }

                                      itemListModel.filterList(true);
                                  }
                              }
                          }

                          ko.applyBindings(itemListModel);

                          $('#datefilterbutton').bind('click', function FilterList() {
                              itemListModel.filterList(true);
                          });
                          $('#showUpcoming').bind('click', function FilterList() {
                              if ($(this).hasClass('active')) {
                                  $(this).text($('#simple-list-view-type-text').val());
                              }
                              else {
                                  $(this).text($('#extended-list-view-type-text').val())
                              }
                              $(this).toggleClass('active');
                              itemListModel.filterList(true);
                          });
                          $('#showMoreItemsLink').bind('click', function GetMoreDocuments() {
                              var clickCounter = $("#clickCounter").val();
                              $("#clickCounter").val(parseInt(clickCounter) + 1);
                              itemListModel.page++;
                              itemListModel.showMore(true);

                          });

                          $('#filterEduOpen').bind('click', function GetMoreDocuments() {
                              itemListModel.filterList(true);
                          });

                          $('#show-cats-button').bind('click', function () {
                              $(this).closest('.category-nav').toggleClass('show');
                              $(this).toggleClass('active');
                          });

                          $('#show-scope-button').bind('click', function () {
                              $(this).closest('.navigation-block').toggleClass('show');
                              $(this).toggleClass('active');
                          });

                      }
                      else {
                          // Document for Knockout binding
                          function Document(data) {
                              this.FileName = ko.observable(data.FileName);
                              this.PathAndFileName = ko.observable(data.PathAndFileName);
                              this.MetaData = ko.observable(data.MetaData);
                          }

                          function DocumentListViewModel() {
                              // Data
                              var self = this;

                              self.page = 1;
                              self.pageSize = 10;

                              self.Documents = ko.observableArray([]);
                              self.TotalNumberOfHits = ko.observable();

                              var committeeId = $('#committeeId').val();

                              if (committeeId.length < 1)
                                  committeeId = null;

                              var startDate = $('#startDate').val();

                              if (startDate.length < 1)
                                  startDate = null;

                              var endDate = $('#endDate').val();

                              if (endDate.length < 1)
                                  endDate = null;

                              self.getDocs = function () {
                                  $.ajax({
                                      type: "POST",
                                      url: "GetMoreDocuments/",
                                      data: "{page:" + self.page + ", PageSize:" + self.pageSize + ", CommitteeId:" + committeeId + ", StartDate:" + startDate + ", EndDate:" + endDate + "}",
                                      contentType: "application/json; charset=utf-8",
                                      dataType: "json",
                                      success: function (allData) {
                                          for (i = 0; i < allData.Documents.length; i++) {
                                              self.Documents.push(new Document(allData.Documents[i]));
                                          }
                                          self.TotalNumberOfHits(allData.TotalNumberOfHits);
                                          if (self.Documents().length == self.TotalNumberOfHits())
                                              $('#showMoreDocsLink').toggle();
                                      }
                                  });
                              }
                          }

                          var documentListViewModel = new DocumentListViewModel();
                          documentListViewModel.getDocs();
                          ko.applyBindings(documentListViewModel);

                          $('#showMoreDocsLink').bind('click', function GetMoreDocuments() {
                              documentListViewModel.page++;
                              documentListViewModel.getDocs();
                          });
                      }
                  })
              }
          } //end callback
      },
       {
           test: Modernizr.jqueryuiexist,
           yep: {
               'jqueryui': '',
               'jqueryui-theme': '/Static/css/ui-lightness/jquery-ui-1.10.4.custom.min.css'
           },
           callback: {
               'jqueryui': function () {


                   function setDateLang(lang) {
                       if (lang == "sv") {
                           return SwedishCalender = {
                               MonthNames: ['Januari', 'Februari', 'Mars', 'April', 'Maj', 'Juni', 'Juli', 'Augusti', 'September', 'Oktober', 'November', 'December'],
                               ShortDayNames: ['Sö', 'Må', 'Ti', 'On', 'To', 'Fr', 'Lö'],
                               DayNames: ['Söndag', 'Måndag', 'Tisdag', 'Onsdag', 'Torsdag', 'Fredag', 'Lördag']
                           };
                       }
                       else if (lang == "en") {
                           return EnglishCalender = {
                               MonthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                               ShortDayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
                               DayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                           };
                       }
                   }

                   // Initilize datepicker
                   // But also set the correct month names
                   var DateLang = $("html").attr("lang");
                   var currentLang = setDateLang(DateLang);

                   jQuery(function () {
                       $('.input-date:not(.custom)').datepicker({
                           dateFormat: "yy-mm-dd",
                           monthNames: currentLang.MonthNames,
                           dayNamesMin: currentLang.ShortDayNames,
                           firstDay: 1
                       }, { defaultDate: +7 }
                       );
                   })

                   // Open order dialog för diarys
                   $("#opener").bind('click', function (e) {
                       e.preventDefault(e);
                       $("#dialog").dialog("open");
                   });

                   $("#dialog").dialog({
                       autoOpen: false,
                       modal: true,
                       width: 500,
                       resizable: false
                   });
               }
           } //end callback
       },
       {
           test: Modernizr.responsivetablesexists, //CHECK if responsivetablesexists 
           yep: {
               'responsivetable': '/Static/js/plugins/responsive-tables.js'
           },
           callback: {
               'responsivetable': function () {
                   jQuery(function () {
                       $('.article .body table').addClass("responsive-table");
                       $('.accordion-content .body table').addClass("responsive-table");

                       $('.responsive-table').each(function () {
                           if ($(this).find('tbody').find('tr').first().children().length == 2) {
                               $(this).closest('.responsive-table').find('th, td').addClass('w-50');
                           }
                           if ($(this).find('tbody').find('tr').first().children().length == 3) {
                               $(this).closest('.responsive-table').find('th, td').addClass('w-33');
                           }
                           if ($(this).find('tbody').find('tr').first().children().length == 4) {
                               $(this).closest('.responsive-table').find('th, td').addClass('w-25');
                           }
                           if ($(this).find('tbody').find('tr').first().children().length == 5) {
                               $(this).closest('.responsive-table').find('th, td').addClass('w-20');
                           }
                           $(this).find('th:first-child, td:first-child').addClass('first');
                       });

                   })
               }
           } //end callback
       },
    {
        test: Modernizr.articlenavigationexists, //CHECK if articlenavigation
        yep: {
            'foundation': '/Static/js/libs/foundation.js',
            'foundation-magellan': '/Static/js/plugins/foundation.magellan.js',
            'localscroll': '/Static/js/plugins/jquery.localscroll.js'
        },
        callback: {
            'localscroll': function () {

                // Create destination for top of page link
                $('body').attr('id', 'navigation-link-top');
                $('body').attr('data-magellan-destination', 'navigation-link-top');

                // Create links for navigation
                $("article .navigation-header").each(function () {
                    var index = $(".navigation-header").index(this) + 1;
                    var linkname = "navigation-link-" + index;
                    var text = $(this).text();
                    $(this).attr('id', linkname);
                    $(this).attr('data-magellan-destination', linkname);
                    $("<li><a data-magellan-arrival='" + linkname + "' href='#" + linkname + "'><span class='icon' aria-hidden='true'></span>" + text + "</a></li>").insertBefore(".navigation-link-top");
                });

                //Init foundation assets (magellan sticky nav)
                $(document).foundation({ active_class: 'active' });

                //Init localscroll
                var localScrollLinks = $('#article-nav-list li');
                $(localScrollLinks).localScroll({ duration: '100', axis: 'y', offset: { top: -10 } });

                // Click events and adjustments for touch devices
                var windowWidth = $(window).width();
                if (windowWidth < 1025) {
                    $(".article-navigation").prependTo(".navigation-article .body");
                    $('.article-navigation').show();

                    $('.article-navigation-title').bind('click', function () {
                        $('#article-nav-list').slideToggle('400', function () {
                            $('.article-navigation-title').toggleClass('active');
                        });
                    });

                    $('#article-nav-list a').bind('click', function () {
                        $('#article-nav-list').slideToggle('400', function () {
                            $('.article-navigation-title').removeClass('active');
                        });
                    });

                }
                var windowWidth = $(window).width();
                if (windowWidth < 651) {
                    var localScrollLinks = $('#article-nav-list li');
                    $(localScrollLinks).localScroll({ duration: '100', axis: 'y', offset: { top: -50 } });
                }

            }

        } //end callback
    },

    {
        test: Modernizr.carecenterexists, //CHECK if articlenavigation
        yep: {
            'foundation': '/Static/js/libs/foundation.js',
            'foundation-magellan': '/Static/js/plugins/foundation.magellan.js',
            'localscroll': '/Static/js/plugins/jquery.localscroll.js'
        },
        callback: {
            'localscroll': function () {

                // Create destination links in main menu 
                $("#main-nav-list .local-link a").each(function () {
                    var index = $("#main-nav-list .local-link a").index(this) + 1;
                    var linkname = "navigation-link-" + index;
                    var text = $(this).text();
                    $(this).attr('href', '#' + linkname);
                    $(this).attr('data-magellan-arrival', linkname);
                });

                // Create destination links in mobile menu
                $("#mobile-nav-list .local-link a").each(function () {
                    var index = $("#mobile-nav-list .local-link a").index(this) + 1;
                    var linkname = "navigation-link-" + index;
                    var text = $(this).text();
                    $(this).attr('href', '#' + linkname);
                    $(this).attr('data-magellan-arrival', linkname);
                });

                // Create arrival links in headers 
                $(".navigation-header").each(function () {
                    var index = $(".navigation-header").index(this) + 1;
                    var linkname = "navigation-link-" + index;
                    var text = $(this).text();
                    $(this).attr('id', linkname);
                    $(this).attr('data-magellan-destination', linkname);
                });

                //Init foundation assets (magellan sticky nav)
                $(document).foundation({ active_class: 'active' });

                //Init localscroll
                var localScrollLinks = $('#main-nav-list .local-link, #mobile-nav-list .local-link');
                $(localScrollLinks).localScroll({ duration: '100', axis: 'y', offset: { top: -70 } });

                // Close mobile menu when clicked local link
                $('#mobile-nav-list .local-link a').bind('click', function () {
                    $('.close-menu').trigger('click');
                });

            }

        } //end callback
    },


    {
        test: Modernizr.seachinputexist, //CHECK if seachinputexist 
        yep: {
            'autocomplete': ''
        },
        callback: {
            'autocomplete': function () {
                jQuery(function () {
                    var input = $('input.search-input-field');

                    input.autocomplete(
                    {
                        minLength: 3,
                        source: function (request, response) {
                            var siteId = $("#siteGUID").val();
                            var path = "/find/rest/autocomplete/get/" + request.term + "/5" + "?tag=siteid:" + siteId;
                            $.ajax({
                                url: path,
                                type: "GET",
                                dataType: "json",
                                success: function (data) {
                                    // Create the list and add it to the div
                                    var url = $('#search-url').val();
                                    var ul = $('.typeahead-list');
                                    if (!$('.typeahead-focused').length) {
                                        if (ul) {
                                            ul.remove();
                                        }
                                        $('.typeahead-container').removeClass('typeahead-focused');
                                    }
                                    ul = $(document.createElement('ul')).addClass('typeahead-list');

                                    for (var i = 0; i < data.Hits.length; i++) {
                                        console.log("Hit=", data.Hits[i].Query);
                                        var href = url + '?query=' + data.Hits[i].Query;
                                        ul.append('<li><a href="' + href + '">' + data.Hits[i].Query + '</a></li>')
                                    }

                                    $('input.search-input-field:focus').closest('.typeahead-container').append(ul);

                                    //Keydown events for keyboard navigation
                                    $('input.search-input-field:focus').keydown(function (e) {
                                        if (e.keyCode == 40) {
                                            $(this).closest('.typeahead-container').addClass('typeahead-focused');
                                            e.preventDefault();
                                            $(this).closest('.typeahead-container').find('.typeahead-list li:first-child').find('a').focus();
                                        }
                                    });
                                    $('.typeahead-list li:first-child a').keydown(function (e) {
                                        if (e.keyCode == 38) {
                                            $('.typeahead-container').removeClass('typeahead-focused');
                                            e.preventDefault();
                                            $(this).closest('.typeahead-container').find('input.search-input-field').focus();
                                        }
                                    });
                                    $('.typeahead-list li a').keydown(function (e) {
                                        if (e.keyCode == 40) {
                                            e.preventDefault();
                                            $(this).closest('li').next().find('a').focus();
                                        }
                                        if (e.keyCode == 38) {
                                            e.preventDefault();
                                            $(this).closest('li').prev().find('a').focus();
                                        }
                                    });

                                }
                            }); //ajax
                        }
                    });

                    // Prevent search if search term ends with blank space to prevent HTTP 500 error on server
                    input.on('autocompletesearch', function (e) {
                        var suffix = this.value.substr(this.value.length - 1);
                        if (suffix === " ") {
                            e.preventDefault();
                        }
                    });

                    input.on('input', function (e) {
                        if ('' == this.value) {
                            var ul = $('.typeahead-list');
                            if (ul)
                                ul.remove();
                        }
                    });

                })
            }
        } //end callback
    },
    {
        test: Modernizr.sortabletableexist, //CHECK if tablesorter is needed 
        yep: {
            'tablesorter': '/Static/js/plugins/jquery.tablesorter.min.js'
        },
        callback: {
            'tablesorter': function () {
                jQuery(function () {
                    $('.sortable').tablesorter(); //init tablesorterplugin
                })
            }
        } //end callback
    }]); //END modernizr load

    //goTo function added
    $.fn.goTo = function () {
        $('html, body').animate({
            scrollTop: $(this).offset().top + 'px'
        }, 'fast');
        return this; // for chaining...
    }

    //adjust height if only one slide is used. 
    function adjustSliderHeight() {
        if ($('.flexslider .slides li').length <= 3) {
            $('.flexslider').addClass('adjust-margin');
        }
    }
    //Remove tabindex on sliders
    function removeSliderTabIndex() {
        $('.flexslider a').attr('tabindex', -1);
    }

    //Tab shortcutmenu
    $('#tab-support-list a').bind({
        focus: function () {
            $('#tab-support-container').addClass('show-tabmenu');
            $(this).parent().addClass('show');

        },
        blur: function () {
            $('#tab-support-container').removeClass('show-tabmenu');
            $(this).parent().removeClass('show');
        }
    });

    //Initialize accessibleMegaMenu (tab functionality)
    $(".menu-accessible").accessibleMegaMenu({
        uuidPrefix: "accessible-megamenu",
        topNavItemClass: "tab-friendly",
        panelClass: "sub-nav",
        panelGroupClass: "sub-nav-group"
    });

    // remove megamenu and accessibleMegaMenu if touch device
    if ($('html').hasClass("touch")) {
        $('#main-nav-list li').removeClass('has-mega');
        $('#main-nav-list li').removeClass('tab-friendly');
    }

    // Send searchquery to server
    function MakeSearch(query) {
        var url = $('#search-url').val();
        var fullUrl = url + '?query=' + encodeURIComponent(query);

        var siteId = querystring('siteId');
        if (siteId.length)
            fullUrl += '&siteid=' + siteId;

        if ($('#page-search-exact-phrase').length && $('#page-search-exact-phrase').is(':checked'))
            fullUrl += '&exactphrase=true';

        window.location.assign(fullUrl);
    }

    // execute search
    $('#search-btn').bind('click', function () {
        var query = $('#header-search').val();
        MakeSearch(query);
    });

    // Make enter click the search button
    $("#header-search").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#search-btn").click();
        }
    });

    // execute search on page
    $('#page-search-btn').bind('click', function () {
        var query = $('#page-search-field').val();
        MakeSearch(query);
    });

    // Make enter click the search button
    $("#page-search-field").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#page-search-btn").click();
        }
    });

    // execute search on mobile
    $('#mobile-search-btn').bind('click', function () {
        var query = $('#mobile-search').val();
        MakeSearch(query);
    });


    // Make enter click the search button
    $("#mobile-search").keyup(function (event) {
        if (event.keyCode == 13) {
            $("#mobile-search-btn").click();
        }
    });

    //expand - search
    $('.mobile-search').bind('click', function () {
        $(this).toggleClass('expanded');
        $('#mobile-search-container').toggle();
    });

    //Mobilemenu - pre-expand on pageload ,if activepage is part of sublevel
    $('#mobile-nav-list li.active').each(function () {
        $(this).parents('#mobile-nav-list ul').show();
        $(this).parents('.has-children').addClass('expanded');
        $(this).children('ul').first().show();
    });
    $('#mobile-nav-list li.active.has-children').addClass('expanded');

    //expand mobile menu
    $('.expand-menu').bind('click', function () {
        $('#mobile-controls').toggleClass('expanded');
        $('#mobile-nav-list').slideToggle(150, function () {
            $(this).toggleClass('expanded');
        });
    });

    //Mobilemenu - expand children
    $('#mobile-nav-list .has-children .expand').bind('click', function () {
        $(this).parent('.has-children').toggleClass('expanded');
        $(this).siblings('ul').slideToggle(150);
    });

    //Mobilemenu - close
    $('.close-menu').bind('click', function () {
        $('#mobile-nav-list').slideUp(150, function () {
            $('#mobile-controls li a.expanded').removeClass('expanded');
            $('#mobile-controls li a').focus();
            $('#mobile-controls').removeClass('expanded');
        });
    });

    //Supportmenu, expand in handheld
    $('.mobile-expand-link').bind('click', function () {
        $('.language-expand-link').removeClass('active');
        $(this).toggleClass('active');
        $('#support-menu .help-menu-item').toggle()
        $('#support-menu .lang-menu-item').hide()
    });

    //Language supportmenu, expand in handheld
    $('.language-expand-link').bind('click', function () {
        $('.mobile-expand-link').removeClass('active');
        $(this).toggleClass('active');
        $('#support-menu .help-menu-item').hide()
        $('#support-menu .lang-menu-item').toggle()
    });


    //SupportMenu "tab functionality"
    $('#support-menu .has-dropdown > a').bind('click', function () {
        if ($(this).hasClass('active')) {
            $('#support-menu .has-dropdown > a').removeClass('active');
            $('#support-menu .dropdown-menu.expanded').removeClass('expanded');

        } else if ($(this).not('active')) {
            $('#support-menu .has-dropdown > a').removeClass('active');
            $('#support-menu .dropdown-menu.expanded').removeClass('expanded');
            $(this).addClass('active');
            $(this).siblings('#support-menu .dropdown-menu').addClass('expanded');
        }
    });

    //Committe toggle list
    $('.toggle-list .has-dropdown > a').bind('click', function (e) {
        e.preventDefault();
        $(this).parent().toggleClass('expanded')
        $(this).siblings('.drop-down').slideToggle(200, function () {

        });
    });

    // Mega menu - add classes
    $('#main-nav-list li:nth-child(n+5)').children('.mega-menu').addClass('right');
    $('#main-nav-list li:last-child').children('.mega-menu').addClass('last-child');


    //Toggle contatct info
    $('.minor .toggle-button').bind('click', function (e) {
        e.preventDefault();
        $(this).toggleClass('active');
        $(this).siblings().slideToggle(150, function () {
            $(this).toggleClass('active');
        });
    });

    $('.toggle-form').bind('click', function (e) {
        e.preventDefault();
        $(this).parent().parent().siblings('.hide').slideToggle('400', function () {
            $(this).toggleClass('active');
        });
    });

    $('.order-btn').bind('click', function () {
        $('.order-form-block').slideToggle('400', function () {
            $('.order-form-block input, .order-form-block textarea').focus();
            $('.order-btn').toggleClass('active');
        });
    });

    // Sign up block
    $('#toggle-signup').bind('click', function () {
        $('.sign-up-block').slideToggle('400', function () {
            $('.sign-up-block input, .sign-up-block  textarea').focus();
            $('#toggle-signup').toggleClass('active');
        });
    });

    // Toggle sign language
    $('.toggle-sign-lang').bind('click', function () {
        if ($('.easy-to-read-block').hasClass("active")) {
            $('.toggle-easy-to-read.close').trigger("click");
        }
        $('.toggle-sign-lang').toggle();
        $('.sign-lang-block').toggleClass('active');
        $('.sign-lang-block').toggleClass('hided');
    });

    // Toggle easy to read
    $('.toggle-easy-to-read').bind('click', function () {
        if ($('.sign-lang-block').hasClass("active")) {
            $('.toggle-sign-lang.close').trigger("click");
        }
        $('.easy-to-read-block').slideToggle('800', function () {
            $('.toggle-easy-to-read').toggle();
            $('.easy-to-read-block').toggleClass('active');
        });
    });

    // Hide sign laguage after page load (due to bright cove video embed in small devices)
    if ($('.sign-lang-block').length) {
        $('.sign-lang-block').addClass('hided');
    }

    // Show form if it's a postback
    if ($('#form-ispostback').val()) {
        $('.toggle-form').click();
        $('.signup-btn').click();
        $('#form-ispostback').goTo();
    }

    // Show form if it's a postback
    if ($('#order-form-ispostback').val()) {
        $('.order-btn').click();
    }

    // Spamfilter, prevent form post for contact forms if hidden field has a value 
    $("#contactform").submit(function (event) {
        if ($('#hidden-field').val() != '') {
            event.preventDefault();
        }
    });

    // Toggle checkboxlist
    $('.check-all > .checkbox').bind('click', function () {
        var checkboxlist = $('.filter-nav-list li .checkbox');
        checkboxlist.attr('checked', !checkboxlist.attr('checked'));
    });

    // Close alert .msg
    $('.close-link').bind('click', function () {
        $(this).closest('.alert').slideToggle('fast');
        setCookie("largeCrisisBoxHasBeenClosed", true);
    });

    // Close cookie .msg

    if (Modernizr.localstorage) {
        if (!JSON.parse(window.localStorage.getItem("cookieBoxHasBeenClosed"))) {
            $("#cookie-info-box").removeClass("hide");
        }
    }
    else if (Modernizr.cookies) {
        if (!JSON.parse(getCookie("cookieBoxHasBeenClosed"))) {
            $("#cookie-info-box").removeClass("hide");
        }
    }


    $('#close-cookies').bind('click', function () {
        $('#cookie-info-box').slideToggle('fast');
        if (Modernizr.localstorage) {
            window.localStorage.setItem("cookieBoxHasBeenClosed", true);
        }
        else {
            setExpCookie("cookieBoxHasBeenClosed", true, 999);
        }
    });

    //Sitemap toogle
    $('.sitemap-list li.has-children .expand').bind('click', function () {
        $(this).toggleClass('active');
        $(this).closest('li.has-children').find('ul:first').slideToggle('400', function () {
        });
    });

    $('.expand-sitemap').bind('click', function () {
        $('.sitemap-list ul').show();
        $('.expand').addClass('active');
    });

    $('.close-sitemap').bind('click', function () {
        $('.sitemap-list ul.sm-lower-level').hide();
        $('.expand').removeClass('active');
    });


    //AO list toggle
    $('.ao-nav-list li a').bind('click', function () {
        $('.ao-nav-list li a').removeClass('active');
        $(this).addClass('active');
    });

    // Prevent click on empty link on article image slider
    $(".rsk-article-slider .slide-link").click(function () {
        return false;
    });




    // minimize breadcrumb
    if ($('.breadcrumb-nav').length) {

        if ($('.breadcrumb-list li').length > 3) {
            $('.breadcrumb-list li:nth-last-child(-n+4)').addClass('inline');
            $('.breadcrumb-list li:nth-last-child(4) a').text('...');
        } else {
            $('.breadcrumb-list li').addClass('inline');
        }
    }

    // Toggle Elected listview
    $('.electedtoggle').bind('click', function () {
        if (!$(this).hasClass('active')) {
            $('.person-list').toggleClass('hide');
            $('.electedtoggle').removeClass('active');
            $(this).addClass('active');
        }
    });

    // Toggle Event listview
    $('.meetingtoggle').bind('click', function (e) {
        e.preventDefault();
        if (!$(this).hasClass('active')) {
            $('.meeting-list').toggleClass('hide');
            $('.meetingtoggle').removeClass('active');
            $(this).addClass('active');
        }
        if ($(this).hasClass('next')) {
            window.location.hash = "next-meetings";
        } else {
            window.location.hash = "previous-meetings";
        }
    });

    // Open coming events if open
    if (window.location.hash.indexOf('next-meetings') == 1) {
        $('.view-switcher .prev-view .meetingtoggle').removeClass('active');
        $('.view-switcher .next-view .meetingtoggle').addClass('active');
        $('.meeting-list.prev-view').addClass('hide');
        $('.meeting-list.next-view').removeClass('hide');
    }

    // Toggle simple listview in listing pages
    $('#listing-view-switcher a').bind('click', function (isReadback) {
        if (!$(this).hasClass('active')) {
            $('#listing-view-switcher a').removeClass('active');
            $(this).addClass('active');
            //$('#simple-list-view-type').val(!$('#simple-list-view-type').val());
            $('#itemList').toggleClass('simple-list-view');
            $('.search-results-list').toggleClass('simple-list-view');
        }
    });

    // Readback listview value
    if ($('#simple-list-view-type').length) {
        if ($('#simple-list-view-type').val() == 'true') {
            $('#listing-view-switcher .simple-view a').click();
        }
    }

    // Mega Menu functions
    function megamenuShow() {
        $('#main-nav-list li.hover').removeClass('hover');
        $(this).children('.mega-menu').addClass('expanded');
        $(this).addClass('hover');
    }
    function megamenuHide() {
        $(this).children('.mega-menu').removeClass('expanded');
        if ($(this).hasClass('hover')) {
            $(this).removeClass('hover');
        }
    }

    // Track cookies
    function setCookie(cookieName, value) {
        var escapedValue = escape(value);

        var now = new Date();
        now.setTime(now.getTime() + (99 * 24 * 60 * 60 * 1000));

        document.cookie = cookieName + "=" + value + "; path=/;" + "expires=" + now.toGMTString();
    }

    function setExpCookie(cookieName, value, days) {
        var escapedValue = escape(value);

        var now = new Date();
        now.setTime(now.getTime() + (days * 24 * 60 * 60 * 1000));

        document.cookie = cookieName + "=" + value + "; path=/;" + "expires=" + now.toGMTString();
    }

    function getCookie(name) {
        var value = "; " + document.cookie;
        var parts = value.split("; " + name + "=");
        if (parts.length == 2) return parts.pop().split(";").shift();
    }

    // Job search button click
    $('#job-search').bind('click', function () {
        var kvp = '';
        var p = querystring('page');
        var catValue = $('#work-category').val();
        var depValue = $('#work-dept').val();
        var locValue = $('#work-area').val();
        var typeValue = $('#work-type').val();


        if (p.length > 0)
            kvp = insertParam('page', p[0], kvp);
        if (depValue != '*')
            kvp = insertParam('dep', depValue, kvp);
        if (catValue != '*')
            kvp = insertParam('cat', catValue, kvp);
        if (locValue != '*')
            kvp = insertParam('loc', locValue, kvp);
        if (typeValue != '*')
            kvp = insertParam('type', typeValue, kvp);

        // Reload location with query param
        document.location.search = kvp;
    });

    // Function to add query string params
    function insertParam(key, value, kvp) {
        key = encodeURI(key);
        value = encodeURI(value);
        if (kvp.length > 0)
            kvp = kvp + '&' + key + '=' + value;
        else
            kvp = kvp + '?' + key + '=' + value;

        return kvp;
    }

    // Get value from querystring
    function querystring(key) {
        var re = new RegExp('(?:\\?|&)' + key + '=(.*?)(?=&|$)', 'gi');
        var r = [], m;
        while ((m = re.exec(document.location.search)) != null) r.push(m[1]);
        return r;
    }

    function updateQueryStringParameter(uri, key, value) {
        var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
        var separator = uri.indexOf('?') !== -1 ? "&" : "?";
        if (uri.match(re)) {
            return uri.replace(re, '$1' + key + "=" + value + '$2');
        }
        else {
            return uri + separator + key + "=" + value;
        }
    }

    //Adds helperclasses on work table
    $('.work-search-table tr td:first-child, .work-search-table tr th:first-child').addClass('first-child');

    // Set background color on article blocks
    function SetBackroundColorOnPosition(elements) {
        for (var i = 0, j = 0; i < elements.length; i++) {
            if (j === 2) {
                $(elements[i]).css('background-color', '#aa001a');
                j = 0;
            }
            else if (j === 1) {
                $(elements[i]).css('background-color', '#007ca9');
                j++;
            }
            else if (j === 0) {
                $(elements[i]).css('background-color', '#126d74');
                j++;
            }
        }
    }
    SetBackroundColorOnPosition($('.opinion-section .topics .block-label'));

    // Toggle search types if longer then 4 items
    if ($('#search-types').length) {
        if ($('#search-types li.type').length > 4) {

            $('#search-types li.type:gt(3)').appendTo('#more-types-list');
            $('.more-types').show();
            $(".more-types").click(function () {
                $(this).toggleClass('active');
                $('#more-types-list').slideToggle('fast');
            });
        }
    }

    // Toggle search categories if longer then 5 items
    if ($('.search-category-list').length) {
        if ($('.search-category-list li').length > 5) {
            $('.search-category-list li:gt(4)').hide();
            $('#more-search-categories').show();
            $("#more-search-categories").click(function () {
                $(this).toggleClass('active');
                $('.search-category-list li:gt(4)').slideToggle('fast');
            });
        }
        $(function () {
            $("#more-search-categories").keyup(function (e) {
                if (e.keyCode === 13) {
                    $("#more-search-categories").trigger("click");
                }
            });
        });

    }

    // Click events for hidden menu on search page and listing page
    $(".hidden-menu-button").click(function () {
        if ($(this).hasClass("active")) {
            $('#hidden-menu-overlay').fadeOut();
            $('#hidden-menu-content').stop(true, false).animate({
                'left': '-80%'
            }, 600);
        }
        else {
            $('#hidden-menu-overlay').fadeIn();
            $('.hidden-menu-button').stop(true, false).animate({
                'bottom': '-40px'
            }, 600);
            $('#hidden-menu-content').stop(true, false).animate({
                'left': '0px'
            }, 600);
        }
        $(this).toggleClass('active');
    });

    $(".hidden-menu-close, #hidden-menu-overlay, .link-external").click(function () {
        $('#hidden-menu-overlay').fadeOut();
        $('#hidden-menu-content').stop(true, false).animate({
            'left': '-80%'
        }, 600);
        $(".hidden-menu-button").toggleClass('active');
        $('.hidden-menu-button').stop(true, false).animate({
            'bottom': '0px'
        }, 600);
    });

    $(".search-nav-list li a, .search-category-list li a").click(function () {
        if ($(".hidden-menu-button").hasClass("active")) {
            $('#hidden-menu-overlay').fadeOut();
            $('#hidden-menu-content').stop(true, false).animate({
                'left': '-80%'
            }, 600);
            $(".hidden-menu-button").toggleClass('active');

            var href = $(this).attr('href');
            setTimeout(function () { window.location = href }, 1000);
            return false;
        }
    });

    $(".filter-nav-list label, .date-picker-block .filter-button, #hidden-menu-content .category-nav li a").click(function () {
        if ($(".hidden-menu-button").hasClass("active")) {
            $('#hidden-menu-overlay').fadeOut();
            $('#hidden-menu-content').stop(true, false).animate({
                'left': '-80%'
            }, 600);
            $(".hidden-menu-button").toggleClass('active');
            $('.hidden-menu-button').stop(true, false).animate({
                'bottom': '0px'
            }, 600);
        }
    });

    // Click events for category subscription

    function sortUnorderedList(ul, sortDescending) {
        if (typeof ul == "string")
            ul = document.getElementById(ul);

        // Idiot-proof, remove if you want
        if (!ul) {
            alert("The UL object is null!");
            return;
        }

        // Get the list items and setup an array for sorting
        var lis = ul.getElementsByTagName("LI");
        var vals = [];

        // Populate the array
        for (var i = 0, l = lis.length; i < l; i++)
            vals.push(lis[i].innerHTML);

        // Sort it
        vals.sort();

        // Sometimes you gotta DESC
        if (sortDescending)
            vals.reverse();

        // Change the list on the page
        for (var i = 0, l = lis.length; i < l; i++)
            lis[i].innerHTML = vals[i];
    }

    // Adding category to chosen list
    $("#available-subscription-categories li a").click(function () {
        if ($(this).hasClass('chosen')) {
            return false;
        } else {
            $(this).addClass("added-category");
            var clone = $(this).closest("li").clone().appendTo("#chosen-subscription-categories");
            // IE check
            if (navigator.appVersion.indexOf("MSIE 7.") == -1) {
                sortUnorderedList('chosen-subscription-categories');
            }
            $(this).removeClass("added-category");
            $(this).addClass("chosen");

            var catid = $(this).attr('id');

            $("#hidden-catagory-subcription").val(function (index, val) {
                return val + catid + "-";
            });

        }

        if ($("#chosen-subscription-categories li").length > 1) {
            $(".no-categories-chosen").hide();
        }
    });

    if ($("#hidden-catagory-subcription").length && $("#hidden-catagory-subcription").val().length) {
        var chosenCats = $("#hidden-catagory-subcription").val();
        chosenCats = chosenCats.substring(0, chosenCats.length - 1).split('-');
        for (var i = 0; i < chosenCats.length; i++) {
            var idstring = '#' + chosenCats[i];
            var $this = $(idstring)
            if ($this.hasClass('chosen')) {
                return false;
            } else {
                $this.addClass("added-category");
                $this.closest("li").clone().appendTo("#chosen-subscription-categories");
                $this.removeClass("added-category");
                $this.addClass("chosen");
            }
        }

        if ($("#chosen-subscription-categories li").length > 1) {
            $(".no-categories-chosen").hide();
        }
    };

    if ($("#chosen-subscription-categories li").length > 1) {
        $(".no-categories-chosen").hide();
    }

    // Remove existing category from chosen list
    $("#chosen-subscription-categories li a").click(function () {
        var catid = $(this).attr('id');

        $('#hidden-catagory-subcription').val(function (index, val) {
            return val.replace(catid + '-', '');
        });

        $("#available-subscription-categories").find("a[id=" + catid + "]").removeClass("chosen");
        $(this).closest("li").remove();

        if ($("#chosen-subscription-categories li").length < 2) {
            $(".no-categories-chosen").show();
        }
    });

    // Remove added category from chosen list, function due to dom update
    $('#chosen-subscription-categories').on('click', '.added-category', function () {
        var catid = $(this).attr('id');

        $('#hidden-catagory-subcription').val(function (index, val) {
            return val.replace(catid + '-', '');
        });

        $("#available-subscription-categories").find("a[id=" + catid + "]").removeClass("chosen");
        $(this).closest("li").remove();

        if ($("#chosen-subscription-categories li").length < 2) {
            $(".no-categories-chosen").show();
        }
    });

    // Toggle contact list in minor area if longer then 4 items
    if ($('.minor').has('.contact-area').length) {
        $(".minor .contact-card").each(function () {
            if ($(this).find('.contact-list li.list-item').length > 3) {
                $(this).find('.contact-list li.list-item:gt(2)').hide();
                $(this).find('.more-contacts-button').css('display', 'block');
            }
        });
        $(".more-contacts-button").click(function () {
            $(this).closest('.contact-card').find('.contact-list li.list-item:gt(2)').slideToggle('fast');
            $(this).hide();
        });
    }

    // Toggle contact list in contact catalogue if more infor or picture exists
    if ($('.ao-contacts-list').length) {
        $(".ao-contact").each(function () {
            if ($(this).find('.contact-list-ao-more li').length > 0 || $(this).find('.contact-list-image img').length) {
                $(this).find('.contact-list-more-info').hide();
                $(this).find('.more-contact-info-button').css('display', 'block');
            }
        });
        $(".more-contact-info-button").click(function () {
            $(this).toggleClass('active');
            $(this).closest('.ao-contact').toggleClass('active');
            $(this).closest('.ao-contact').find('.expandable-label').toggleClass('active');
            $(this).closest('.ao-contact').find('.contact-list-more-info').slideToggle('fast');
        });
    }

    // Toogle diary types
    $(".diary-types li").bind('click', function (e) {
        e.preventDefault(e);
        $(".diary-types li").removeClass('active');
        $(this).toggleClass('active');

        if ($(this).hasClass('cases')) {
            $(".diary.case").show();
            $(".diary.document").hide();
            $(".diary.case .diary.document").show();
        }
        if ($(this).hasClass('documents')) {
            $(".diary.document").show();
            $(".diary.case").hide();
        }
        if ($(this).hasClass('all')) {
            $(".diary.document").show();
            $(".diary.case").show();
        }

    });

    // Toggle diary more info    
    $(".more-diary-info-button").click(function () {
        $(this).toggleClass('active');
        $(this).closest('.diary').toggleClass('active');
        $(this).closest('.diary').find('.diary-list').first().find('.expandable-label').toggleClass('active');
        $(this).closest('.diary').find('.diary-list-more-info').first().slideToggle('fast');
    });

    // Load responsive img-map if exists
    if ($('img[usemap]').length) {
        $('img[usemap]').rwdImageMaps();
    }

    // Hover constituency map    
    $('.constituency-area').mouseover(function () {
        constituency_name = $(this).attr('id');
        $("#constituency_" + constituency_name).show();
    }).mouseout(function () {
        $(".constituency").hide();
    });

    // Hover organization map    
    $('.organization-area').mouseover(function () {
        organization_name = $(this).attr('id');
        $("#organization_" + organization_name).show();
    }).mouseout(function () {
        $(".organization").hide();
    });

    // Trigger click on constituency map if touch device
    if ($('html.touch').length) {
        $('.constituency-area').hover(function () {
            $(this).trigger('click');
        });
    }

    // Set search sort selector before change binding
    if (querystring('sort').length) {
        $('.select-wrapper.sort select').each(function () {
            $(this).val(querystring('sort')[0]);
        });
    }

    // Set search type selector before change binding
    if (querystring('searchtype').length) {
        $('#mobile-type-selector').val(querystring('searchtype')[0]);
    }

    // Trigger reload with sort param on selector change
    $('.select-wrapper select').change(function () {
        var queryParams = updateQueryStringParameter(document.location.search, $(this).closest('.select-wrapper').attr('class').replace('select-wrapper', '').trim(), $(this).val());
        document.location.search = queryParams;
    });

    $('.select-block .select-wrappers select').change(function () {
        var target = '_blank';
        var url = $(this).val();
        if (url.indexOf(target) == 0) {
            url = url.replace(target, '');
            window.open(url, target);
        }
        else {
            window.location = url;
        }
    });

    //Update value(URL) with #-key for select block select, due to identic link failure
    $('.select-block .styled-select-options option').each(function () {
        if (!$(this).hasClass('choose-option')) {
            linkname = $(this).text();
            linkname = linkname.replace(/ /g, '');
            $(this).val(function (index, val) {
                return val + "#" + linkname;
            });
        }
    });

    // initiate custom select if exist
    if ($('select.styled-select').length) {
        $('select.styled-select').customSelect();
    }
    // initiate generic custom select if exist
    if ($('.custom-select').length) {
        $('.custom-select').customSelect();
    }

    // With styled options
    if ($('select.styled-select-options').length) {
        $('select.styled-select-options').each(function () {
            // With search field input
            if ($(this).hasClass('typeahead')) {
                $('select.styled-select-options.typeahead').select2();
            } else {
                $('select.styled-select-options').select2({
                    minimumResultsForSearch: -1
                });
            }
            if ($('.select-block').length) {
                // Reset default value (enables same choice again after using back button)
                chooseText = $('.select-block .choose-option').first().text();
                $('.select2-chosen').text(chooseText);
            }
        });
    }

    if ($('#submit-respons').length) {
        $('#submit-respons').bind("contentchange", function () {

        });
    }

    // Highlight search word

    jQuery.fn.highlight = function (str, className) {
        var regex = new RegExp(str, "gi");
        return this.each(function () {
            $(this).contents().filter(function () {
                return this.nodeType == 3 && regex.test(this.nodeValue);
            }).replaceWith(function () {
                return (this.nodeValue || "").replace(regex, function (match) {
                    return "<span class=\"" + className + "\">" + match + "</span>";
                });
            });
        });
    };

    highlightSearchWord = function () {
        $(".major *").highlight("" + searchWord + "", "higlighted-search-word");
        searchMade = true;
    }
    if (querystring('highlight').length) {
        searchMade = false;
        // Get searched word from URL
        searchUrl = window.location.href;
        searchWord = querystring('highlight');

        // Removing encoding
        searchWord = decodeURI(searchWord);

        // If searched more then one word
        if (searchUrl.indexOf("+") >= 0) {

            if (querystring('exactphrase').length) {

                //Format exact phrase
                searchWord = searchWord.split('+').join(' ');

                // Set highlight entire phrase
                highlightSearchWord();

            } else {
                //Create array from search words
                searchWord = searchWord.split('+');

                // Set highlight on all words in array
                jQuery.each(searchWord, function (i, val) {
                    searchWord = val;
                    if (val != "") {
                        highlightSearchWord();
                    }
                });
            }

        } else {
            highlightSearchWord();
        }
        if (searchMade == true) {
            // If highlighted word exists in a accordion
            if ($('.higlighted-search-word').parents('.accordion-content').length) {
                $('.accordion-content .higlighted-search-word').closest('li').addClass("word-results");
            }
        }
    }

    // OpenData API 
    $('#opendataform').submit(function () {
        var url = window.location.protocol + '//' + window.location.host + '/OpenDataBlock/GetKey';
        var data = $('#opendataform').serialize();

        $.ajax({
            url: url,
            type: "POST",
            data: data,
            success: function (data) {
                $("#opendataform").html(data);
            },
            error: function (result) {
                alert("Failed");
            }
        });
        return false;
    });

    // Fix for filelistning to show MB in capitals
    checkFileSizeEnding = function () {
        var html = $(this).html();
        if (html.indexOf(' mB)') > -1) {
            $(this).html(html.substr(0, html.indexOf(' mB)')) + ' MB)');
        }
    }
    $('.file-attachment-link a span').each(checkFileSizeEnding);
    $('.file-type').each(checkFileSizeEnding);

    // Resetting the issue type value
    if ($('#issue-type-value').length && $('#issue-type-value').val().length) {
        var issueTypeValue = $('#issue-type-value').val();
        var text = $('option[value="' + issueTypeValue + '"]').html();

        //Setting the value 
        $('#issue-type').val(issueTypeValue);

        //Setting the shown text
        $('#issue-type').parent().find('span span').html(text);
    }

    // Resetting the issue type value
    if ($('#area-value').length && $('#area-value').val().length) {
        var areaValue = $('#area-value').val();
        var text = $('option[value="' + areaValue + '"]').html();

        //Setting the value 
        $('#area').val(areaValue);

        //Setting the shown text
        $('#area').parent().find('span span').html(text);
    }

    // Remember the selects
    if ($('#AppointmentCode-value').length && $('#AppointmentCode-value').val().length) {
        var AppointmentCodeValue = $('#AppointmentCode-value').val();
        var text = $('option[value="' + AppointmentCodeValue + '"]').html();

        //Setting the value 
        $('#AppointmentCode').val(AppointmentCodeValue);

        //Setting the shown text
        $('#AppointmentCode').parent().find('span span').html(text);
    }

    //MailForm checkbox builder
    if ($(".checkgroups").length > 0) {
        $(".checkgroups").each(function () {

            $(this).find("input").on("click", function () {

                var group = $(this).parent().parent();
                var groupquery = group.find(".groupquery");
                var newStr = buildString(group);

                //Empty groupquery
                groupquery.val("");
                groupquery.val(newStr);

            });

        });

        buildString = function (currentGroup) {

            var sb = "";
            $(currentGroup).find("input:checkbox:checked").each(function () {
                sb += $(this).val();
                sb += ", ";
            });
            sb = sb.slice(0, -2);
            return sb;
        }
    }

    $('.expandable-content').each(function () {
        if ($(this).text().length > 470) {
            $(this).parent().append('<a href="#" class="expand-link">L&auml;s mer</a>');
            $(this).append('<span class="bg-gradient"></span>');
        }
    });

    $('.expand-link').bind('click', function (e) {
        e.preventDefault();
        $(this).siblings('.expandable-content, .expandable-contact-content').toggleClass('expanded');
        $(this).toggleClass('active');
    });




        // All navigation-block related js after page load due to google maps and brightcove embeds
        // Accordion, add class if url from search results
        if ($('.accordion-block').length) {
            dataID = window.location.hash.replace('#', '');
            $('.accordion-block ul li[data-id="' + dataID + '"]').addClass("from-search-results");
        }
        // Show blocks when all external content has loaded
        if ($('.accordion-block').length) {
            dataID = window.location.hash.replace('#', '');
            $('.accordion-block ul li[data-id="' + dataID + '"]').addClass("from-search-results");
        }
        // Show blocks when all external content has loaded
        if ($('.accordion-block').length) {
            $('.accordion-content').hide();
            $('.accordion-content').css({ height: 'auto', overflow: 'auto', position: 'relative', left: 'auto' });
            $('.accordion-block').removeClass('loading');
        }
        // Open accordion if search result
        if ($('.from-search-results').length) {
            $('.from-search-results').children('.accordion-content').show();
            $('.from-search-results').addClass('active');
            $('.from-search-results').parents('.accordion-content').show();
            $('.from-search-results').children('.accordion-title').addClass('active');
            $('.from-search-results').parents('li').addClass('active');
            $('.from-search-results').parents('li').children('.accordion-title').addClass('active');
            $("html, body").animate({ scrollTop: $('.from-search-results').offset().top }, 100);
        }
        if ($('.word-results').length) {
            $('.word-results').children('.accordion-content').show();
            $('.word-results').addClass('active');
            $('.word-results').parents('.accordion-content').show();
            $('.word-results').children('.accordion-title').addClass('active');
            $('.word-results').parents('li').addClass('active');
            $('.word-results').parents('li').children('.accordion-title').addClass('active');
        }
        // Toggle accordion content
        $('.accordion-title').bind('click', function () {
            $(this).toggleClass('active');
            $(this).closest('li').toggleClass('active');
            $(this).closest('li').children('.accordion-content').slideToggle('400', function () {
            });

            //Hash update
            if ($(this).hasClass('active')) {
                var accnum = $(this).closest('li').attr('data-id');
                window.location.hash = accnum;
            }

        });

        // Accoridon internal links
        $('.accordion-content .rtf-area a[href*="#"], .accordion-content .block-area a[href*="#"], .articlepage-section.block-section .list-block a[href*="#"]').bind('click', function () {

            $('.accordion-block ul li.from-internal-link').removeClass("from-internal-link");

            dataID = $(this).attr('href');
            dataID = dataID.substring(dataID.indexOf('#') + 1, 100);
            $('.accordion-block ul li[data-id="' + dataID + '"]').addClass("from-internal-link");

            $('.from-internal-link').children('.accordion-content').show();
            $('.from-internal-link').addClass('active');
            $('.from-internal-link').parents('.accordion-content').show();
            $('.from-internal-link').children('.accordion-title').addClass('active');
            $('.from-internal-link').parents('li').addClass('active');
            $('.from-internal-link').parents('li').children('.accordion-title').addClass('active');
            $("html, body").animate({ scrollTop: $('.from-internal-link').offset().top }, 100);
        });

        // Create mail to all-link in article page body
        if ($('.mail-to-all').length) {
            allmails = "";
            $('article > .body a[href*="mailto:"]').each(function () {
                thishref = $(this).attr('href');
                thishref = thishref.replace('mailto:', '');
                allmails = allmails + thishref + "; ";
            });
            $('.mail-to-all').attr("href", "mailto:" + allmails);
        }

        // Create mail to all-link in accordion
        if ($('.mail-to-all-accordion').length) {

            $('.mail-to-all-accordion').each(function () {
                allmails = "";
                $(this).closest('.rtf-area').find('a[href*="mailto:"]').each(function () {
                    thishref = $(this).attr('href');
                    thishref = thishref.replace('mailto:', '');
                    allmails = allmails + thishref + "; ";
                });
                $(this).attr("href", "mailto:" + allmails);
            });
        }

}); // END DOCUMENT READY