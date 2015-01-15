angular.module('advancedTodo', ['ionic'])

.factory('Categories', function() {
  return {
    all: function() {
      var categoryString = window.localStorage['categories'];
      if(categoryString) {
        return angular.fromJson(categoryString);
      }
      return [];
    },
    save: function(categories) {
      window.localStorage['categories'] = angular.toJson(categories);
    },
    newCategory: function(categoryTitle) {
      // Add a new category
      return {
        title: categoryTitle,
        tasks: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActiveCategory']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActiveCategory'] = index;
    }
  }
})

.controller('advancedTodoCtrl', function($scope, $timeout, $ionicModal, $ionicSideMenuDelegate, Categories) {

  // A utility function for creating a new category
  // with the given categoryTitle
  var createCategory = function(categoryTitle) {
    var newCategory = Categories.newCategory(categoryTitle);
    $scope.categories.push(newCategory);
    Categories.save($scope.categories);
    $scope.selectCategory(newCategory, $scope.categories.length-1);
    $scope.categoryModal.hide();
  }


  // Load or initialize categories
  $scope.categories = Categories.all();

  // Grab the last active, or the first category
  $scope.activeCategory = $scope.categories[Categories.getLastActiveIndex()];
    
    $scope.showCategoryModal = function(){
        $scope.categoryModal.show();
    };
    
  // Called to create a new category
  $scope.newCategory = function(category) {
    //var categoryTitle = prompt('Category name');
    if(category) {
	  var categoryTitle = category.title;
      createCategory(categoryTitle);
    }
  };

  // Called to select the given category
  $scope.selectCategory = function(category, index) {
    $scope.activeCategory = category;
    Categories.setLastActiveIndex(index);
   // $scope.sideMenuController.close();
   $ionicSideMenuDelegate.toggleRight();
  };

  // Create our modal
  $ionicModal.fromTemplateUrl('new-task.html', function(modal) {
    $scope.taskModal = modal;
  }, {
    scope: $scope
  });
  $ionicModal.fromTemplateUrl('new-category.html', function(modal) {
    $scope.categoryModal = modal;
  }, {
    scope: $scope
  });

  $scope.createTask = function(task) {
    if(!$scope.activeCategory || !task) {
      return;
    }
    $scope.activeCategory.tasks.push({
      title: task.title
    });
    $scope.taskModal.hide();

    // Inefficient, but save all the categories
    Categories.save($scope.categories);

    task.title = "";
  };

    $scope.newTask = function() {
        $scope.taskModal.show();
    };

    $scope.closeNewTask = function() {
        $scope.taskModal.hide();
    }
    
    $scope.closeNewCategory = function(){
        $scope.categoryModal.hide();
    }
    
    $scope.toggleCategories = function() {
       $ionicSideMenuDelegate.toggleLeft();
    };


  // Try to create the first category, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.categories.length == 0) {
      //while(true) {
        $scope.categoryModal.show();
        //var categoryTitle = prompt('Your first category title:');
        //if(categoryTitle) {
          //createCategory(categoryTitle);
          //break;
        //}
      //}
    }
  });

});