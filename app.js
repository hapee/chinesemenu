(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive('foundItems', FoundItemsDirective)
        .constant('ApiBasePath', "http://davids-restaurant.herokuapp.com");

    function FoundItemsDirective() {
        var ddo = {
            restrict: 'E',
            templateUrl: 'foundItems.html',
            scope: {
                foundItems: '<',
                onRemove: '&'
            },
            controller: FoundItemsDirectiveController,
            controllerAs: 'myCtrl',
            bindToController: true
        };

        return ddo;
    }

    function FoundItemsDirectiveController() {
        var vm = this;
    }

    NarrowItDownController.$inject = ['MenuSearchService'];
    function NarrowItDownController(MenuSearchService) {
        var vm = this;

        vm.searchTerm = "";
        vm.found = [];

        vm.narrowItDown = function () {
            if (vm.searchTerm) {
                MenuSearchService.getMatchedMenuItems(vm.searchTerm).then(function (result) {
                    vm.found = result;
                });
            } else {
                vm.found = [];
            }
        }

        vm.removeItem = function (itemIndex) {
            vm.found.splice(itemIndex, 1);
        };
    }

    MenuSearchService.$inject = ['$http', 'ApiBasePath'];
    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http.get(ApiBasePath + "/menu_items.json").then(function (response) {
                var items = response.data.menu_items;
                var foundItems = [];
                for (var i = 0; i < items.length; i++) {
                    var description = items[i].description;
                    if (description.toLowerCase().indexOf(searchTerm) !== -1) {
                        foundItems.push(items[i]);
                    }
                }
                return foundItems;
            });
        }
    }

})(); 