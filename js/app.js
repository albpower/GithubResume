var app = angular.module('GResumeApp',['ngRoute','angularUtils.directives.dirPagination']);

app.config(['$routeProvider',function ($routeProvider){
    $routeProvider.
    when('/home',
    {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
    }).when('/resume/:user',
    {
        templateUrl: 'templates/resume.html',
        controller: 'ResumeCtrl'
    }).otherwise({
        redirectTo: '/home'
    });
    
}]);

app.controller('HomeCtrl',function($scope){

});

app.controller('ResumeCtrl',function($scope,$routeParams,$http){
    $scope.guser = $routeParams.user;
    
    $http.get('https://api.github.com/users/'+ $scope.guser).then(
        function(resp){
            $scope.usrAvatar = resp.data.avatar_url;
            $scope.usrName = resp.data.name;
            $scope.usrFollowers = resp.data.followers;
            $scope.usrFollowing = resp.data.following;
            $scope.usrBlog = resp.data.blog;
            $scope.usrSignDate = resp.data.created_at;
            $scope.usrLogin = resp.data.login;
            //console.log(resp);
        }
    );
    
    var langArray = [];
    var languages = [];
    var current = null;
    var count = 0;
    
    $http.get('https://api.github.com/users/'+ $scope.guser + '/repos').then(function (resp){
        $scope.usrRepos = resp.data;
        
        //add languages from repos to single array
        for (var i=0; i<$scope.usrRepos.length; i++){
            langArray.push($scope.usrRepos[i].language);
            langArray.sort();
            
//            hasLang = false;
//            
//            if (i==0)
//            { 
//                langArray.push({"language": $scope.usrRepos[i].language,"count":1, "percent":100});
//                hasLang = true;
//            }else
//            {
//                for (var j=0; j<langArray.length; j++){
//                    console.log(langArray[j].language);
//                    if(langArray[j].language === $scope.usrRepos[i].language)
//                    {
//                        var count = langArray[j].count;
//                        count+=1;
//                        langArray[j].count = count;
//                        hasLang = true;
//                        break;
//                    }
//                }//endFor
//            }
//            
//            if (!hasLang){
//                langArray.push({"language": $scope.usrRepos[i].language,"count":1, "percent":100});
//            }
        }
        
        //count similar languages and add results to array
        for (var j=0; j<langArray.length; j++){
                if (langArray[j] != current){
                    if(count> 0){
                        languages.push({"language":current, "count":count, "percentage":0});
                    }
                    current = langArray[j];
                    count = 1;
                } else {count++;}
            }
            
        if (count > 0){
            languages.push({"language":current, "count":count, "percentage":0});
        }
        
        $scope.totalCount = 0;
        for (var x = 0; x< languages.length; x++)
        {
            $scope.totalCount+= languages[x].count;
        }
        
        //console.log($scope.totalCount);
        
        //Calculate Percentage
        var temp = 0 ;
        var percentage = 0;
        
        for (var y=0; y<languages.length; y++ ){
            temp = languages[y].count;
            percentage = (temp/$scope.totalCount) * 100;
            percentage = Math.round(percentage);
            console.log(languages[y].language + ' Percent: '+ percentage + '%');
            languages[y].percentage = percentage;
        }
        
        $scope.languages = languages;
    }); //endHttpGet
});