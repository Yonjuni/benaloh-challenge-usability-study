'use strict';

neuchatelApp.controller("electionCtrl", function ($scope, $routeParams, $location, Backend, $rootScope, $window) {

    var encrypted_vote = "";
    $scope.auditClick = false;
    $scope.show_progress = true;

    $scope.saveChoice = function (code, choice) {

        if ($rootScope.selected_code == code) {
            $scope.resetChoice();
        } else {
            $rootScope.selected_code = code;
            $rootScope.choice = choice;

            // ungueltige Stimme
            if (code == "00") {
                $rootScope.return_code = "4B54423";
            } else {
                $rootScope.return_code = $scope.options[code].option_return_code;
            }

            console.log('Choice is ' + $rootScope.choice);
        }
    };

    $scope.resetChoice = function () {
        $rootScope.selected_code = null;
        $rootScope.choice = null;
        $rootScope.return_code = null;
    }

    switch ($location.path().split("/")[1]) {
        case "error":
            $scope.show_progress = false;
            break;
        case "login":
            $scope.show_progress = true;
            $scope.current_step = 1;
            break;
        case "election":
            $scope.show_progress = true;
            $scope.current_step = 2;
            $scope.resetChoice();
            break;
        case "review":
            $scope.show_progress = true;
            $scope.current_step = 3;
            break;
        case "review-plain":
            $scope.show_progress = true;
            $scope.current_step = 3;
            break;
        case "verify":
            $scope.show_progress = true;
            $scope.current_step = 4;
            break;
        case "confirm":
            $scope.show_progress = true;
            $scope.current_step = 5;
            break;
        case "final":
            $scope.show_progress = false;
            break;
        default:
            $scope.show_progress = true;
            $scope.current_step = 0;
    }

    $rootScope.subject = $routeParams['id'];
    console.log("Subject:" + $rootScope.subject);

    //Do when page loaded
    Backend.assign($routeParams['id']).success(function (data) {
        var result = angular.fromJson(data);
        if ("Error" in result) {
            $location.path('/error/' + $routeParams['id'] + '/' + result["Error"]);
        }

        console.log($routeParams['id']);
        $scope.experimentData = result;
        $scope.options = result.question_data.options;
    });

    // retrieve information, whether to manipulate the vote or not and encrypt afterwards
    function encrypt() {
        Backend.get_manipulated($routeParams['id']).success(function (data) {
            var result = angular.fromJson(data);
            if ("Error" in result) {
                $location.path('/error/' + $routeParams['id'] + '/' + result["Error"]);
            }
            encryptContd(result.is_manipulated);
        });
    }

    // "encrypt" the vote
    function encryptContd(is_manipulated) {
        // Manipulate the chosen option to FDP when SPD is voted for.
        if (is_manipulated && $rootScope.choice == "SPD") {
            for (var option in $scope.options) {
                if ($scope.options[option].option == "FDP") {
                    $rootScope.selected_code = option;
                    $rootScope.choice = $scope.options[option].option;
                    $rootScope.return_code = $scope.options[option].option_return_code;
                    console.log('Choice modified from SPD to ' + $scope.options[$rootScope.selected_code].option);
                    break;
                }
            }
        }
    }

    //From login back to introduction
    $scope.backToIntroductionButton = function () {
        $location.path('/' + $routeParams['id']);
    }

    //From login to election
    $scope.loginButton = function () {
        if($scope.userid == 'k5k6j2kfL4' && $scope.userpass == '7FCMvqbyK3') {
            Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Neuchatel(1): Election start");
            $location.path('election/' + $routeParams['id']);
        } else {
            alert("Sie haben Ihren Benutzernamen oder Ihr Passwort falsch eingegeben. Bitte geben Sie es erneut ein.");
        }
    };

    //From election to review-plain
    $scope.proceedButton = function () {
        // if no choice is made vote "invalid"
        if ($rootScope.selected_code == null) {
            $scope.saveChoice('00', 'Ungültige Stimme');
        }

        Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Neuchatel(2): Election end");
        $location.path('review-plain/' + $routeParams['id']);
    };

    // to election
    $scope.backToElectionButton= function () {
        $location.path('election/' + $routeParams['id']);
    };

    //From review-plain to review
    $scope.encryptVoteButton = function () {
        Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Neuchatel(3): Plain review end");
        $location.path('review/' + $routeParams['id']);
        setTimeout(function(){
            encrypt();
        }, 500);
    };

    //From review to return code verification
    $scope.submitVoteButton = function () {
        Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Neuchatel(4): Verify start");
        $location.path('verify/' + $routeParams['id']);
    };

    //wrong return code verification
    $scope.gotoErrorButton = function (errorReason) {
        switch (errorReason) {
            case "verify":
                $rootScope.errorReason = '_verificationError_';
                Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Neuchatel(5.1): Verification Error detected. Finished");
                break;
            case "confirm":
                $rootScope.errorReason = '_confirmationError_';
                break;
            case "finalize":
                $rootScope.errorReason = '_finalizationError_';
                break;
            default:
                $rootScope.errorReason = '_defaultError_';
                break;
        }
        $location.path('/error/');
    };

    //From return code verification to confirmation code input
    $scope.confirmReturnButton = function () {
        Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Neuchatel(5.2): Return-Code validated");
        $location.path('confirm/' + $routeParams['id']);
    };

    //From confirmation code input to finalization code verification
    $scope.confirmVoteButton = function () {
        if($scope.confcode0 == 'xArc' && $scope.confcode1 == 'uTvK' && $scope.confcode2 == 'MyfY' && $scope.confcode3 == 'mvPN' && $scope.confcode4 == 'na') {
            Backend.save_timestamp($rootScope.subject, new Date().getTime(), "Neuchatel(6): Confirmation-Code entered valid. Finished");
            $location.path('final/' + $routeParams['id']);
        } else {
            alert("Sie haben Ihren Confirmation-Code falsch eingegeben. Bitte versuchen Sie es erneut.");
        }
    };

    // cleanup and restart
    $scope.cleanupButton = function () {
        Backend.unmanipulate($rootScope.subject);
        $location.path('/' + $routeParams['id']);
    }
});