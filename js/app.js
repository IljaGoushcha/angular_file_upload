angular.module('uploadModule', []);

angular.module('uploadModule').controller('uploadCtrl', function($scope, $http) {
    'use strict';

    var uploadUrl = "http://emphonic-player-demo.s3.amazonaws.com/";
    $scope.audio = document.createElement('audio');
    $scope.audio.src = 'Xtreme - Te Extraño (Bachata Version).mp3';
    var signKeyResponse = null;

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
            signKeyResponse = response;

            console.log(signKeyResponse);
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
    };

    //from Cenk
    $scope.postFileToS3 = function(myFile) {
        console.log("hi");
        var fileData = new FormData();
        fileData.append('key', signKeyResponse.key);
        fileData.append('AWSAccessKeyId', signKeyResponse.access_key);
        fileData.append('policy', signKeyResponse.policy);
        fileData.append('acl', signKeyResponse.acl);
        fileData.append('signature', signKeyResponse.signature);
        fileData.append('Content-Type', 'audio/*');
        fileData.append('file', myFile);
        console.log($scope.myFile);

        $http.post(uploadUrl, fileData, {
            transformRequest: angular.identity,
            headers: {
            'Content-Type': undefined,
            'Authorization': ''
            }
        }).success(function(response) {
          console.log('eureka!');
        }).error(function(){
          console.log('fuck you');
        });
    };
    //from Cenk

});

// angular.module('uploadModule').service('fileUpload', ['$http', function ($http) {
//     this.uploadFileToUrl = function(file, uploadUrl){
//         insideFileToUrl
//         var fd = new FormData();
//         fd.append('file', file);
//         $http.post(uploadUrl, fd, {
//             transformRequest: angular.identity,
//             headers: {'Content-Type': undefined}
//         })
//         .success(function(){
//         })
//         .error(function(){
//         });
//     }
// }]);

//trying new upload directive from Cenk's code:
angular.module('uploadModule').directive('fileread', function() {
  return {
    scope: {
      fileread: '='
    },

    link: function(scope, element, attrs) {
      element.bind("change", function(e) {
        scope.$apply(function() {
          scope.fileread = e.target.files[0];
        });
      });
    }
  };
});

//from Jason
  var sendToAmazon = function(imageFile, postId){
    postID = postId;
    return fetchKey().then(function(response){
      signKeyResults = response;
      if(postID){
        postRails(makePayload(postID),postId).then(function(response){
          $http.post(AmazonBucket, buildFormData(imageFile), {
            transformRequest: angular.identity,
            headers: { 'Content-Type': undefined, 'Authorization':'' }
          }).then(function(response){
            $rootScope.awsResponse = response;
            return response;
          });
        });
      } else {
        $http.post(AmazonBucket, buildFormData(imageFile), {
          transformRequest: angular.identity,
          headers: { 'Content-Type': undefined, 'Authorization':'' }
        }).then(function(response){
          $rootScope.awsResponse = response;
          return response;
        });
      }
    });
  };

//the directive below binds file object to a variable in $scope
// angular.module('uploadModule').directive('fileModel', ['$parse', function ($parse) {
//     return {
//         restrict: 'A',
//         link: function(scope, element, attrs) {
//             var model = $parse(attrs.fileModel);
//             var modelSetter = model.assign;

//             element.bind('change', function(){
//                 scope.$apply(function(){
//                     modelSetter(scope, element[0].files[0]);
//                 });
//             });
//         }
//     };
// }]);

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
