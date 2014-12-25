angular.module('uploadModule', []);

angular.module('uploadModule').controller('uploadCtrl', function($scope, $http) {
    'use strict';

    var uploadUrl = "http://emphonic-player-demo.s3.amazonaws.com/";
    $scope.audio = document.createElement('audio');
    $scope.audio.src = 'Xtreme - Te Extraño (Bachata Version).mp3';

    $scope.play = function() {
        $scope.audio.play();
        $scope.playing = true;
    };

    $scope.stop = function() {
        $scope.audio.pause();
        $scope.playing = false;
    };

    $scope.getAmazonURL = function() {
        console.log("inside getAmazonURL");
        $http.get('http://localhost:3000/amazon/sign_key').success(function(response){
            $scope.response = response;
            console.log(response.key);
        }).error(function(data, status, headers, config){
            console.log(data);
            console.log(status);
            console.log("error");
        });
    };

    $scope.uploadFile = function() {
      data = {
        "acl" : $scope.response.acl,
        "key" : $scope.response.key,
        "AWSAccessKeyId" : $scope.response.access_key,
        "Policy" : $scope.response.policy,
        "Signature" : $scope.response.signature
      };
      $http.post('http://emphonic-player-demo.s3.amazonaws.com/', data);
    }

});

angular.module('uploadModule').service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        })
        .success(function(){
        })
        .error(function(){
        });
    }
}]);

angular.module('uploadModule').directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

    // <form ng-submit="uploadFile()">
    //   <div class="row">
    //     <div class="col-md-12">
    //       <input type="file" ng-file-select="onFileSelect($files)">
    //       <div class="progress" style="margin-top: 20px;">
    //         <div class="progress-bar" progress-bar="uploadProgress" role="progressbar">
    //           <span ng-bind="uploadProgress"></span>
    //           <span>%</span>
    //         </div>
    //       </div>

    //       <button button type="submit" class="btn btn-default btn-lg">
    //         <i class="fa fa-cloud-upload"></i>
    //         &nbsp;
    //         <span>Upload File</span>
    //       </button>

    //     </div>
    //   </div>
    // </form>

// angular.module('uploadModule').controller('uploadCtrl', ['$scope', '$upload',
//         function ($scope, $upload) {
//             $scope.model = {};
//             $scope.selectedFile = [];
//             $scope.uploadProgress = 0;

//             $scope.uploadFile = function () {
//                 var file = $scope.selectedFile[0];
//                 $scope.upload = $upload.upload({
//                     url: 'api/upload',
//                     method: 'POST',
//                     data: angular.toJson($scope.model),
//                     file: file
//                 }).progress(function (evt) {
//                     $scope.uploadProgress = parseInt(100.0 * evt.loaded / evt.total, 10);
//                 }).success(function (data) {
//                     //do something
//                 });
//             };

//             $scope.onFileSelect = function ($files) {
//                 $scope.uploadProgress = 0;
//                 $scope.selectedFile = $files;
//             };
//         }
//     ])
//     .directive('progressBar', [
//         function () {
//             return {
//                 link: function ($scope, el, attrs) {
//                     $scope.$watch(attrs.progressBar, function (newValue) {
//                         el.css('width', newValue.toString() + '%');
//                     });
//                 }
//             };
//         };
//     ]);
//  }(angular));
