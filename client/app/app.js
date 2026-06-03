const app = angular.module("powerApp", ["ngRoute"]);

app.constant("API_BASE", "http://localhost:5000/api");

app.config(function ($routeProvider) {
  $routeProvider
    .when("/", {
      templateUrl: "./app/views/home.html",
      controller: "MainController",
    })
    .when("/about", {
      templateUrl: "./app/views/about.html",
    })
    .when("/live-power-status", {
      templateUrl: "./app/views/live-power-status.html",
      controller: "MainController",
    })
    .when("/report-fault", {
      templateUrl: "./app/views/report-fault.html",
      controller: "MainController",
    })
    .when("/track-complaint", {
      templateUrl: "./app/views/track-complaint.html",
      controller: "MainController",
    })
    .when("/pay-bill", {
      templateUrl: "./app/views/pay-bill.html",
      controller: "MainController",
    })
    .when("/dashboard", {
      templateUrl: "./app/views/dashboard.html",
      controller: "MainController",
    })
    .when("/admin-dashboard", {
      templateUrl: "./app/views/admin-dashboard.html",
      controller: "MainController",
    })
    .when("/notifications", {
      templateUrl: "./app/views/notifications.html",
      controller: "MainController",
    })
    .when("/contact-us", {
      templateUrl: "./app/views/contact-us.html",
      controller: "MainController",
    })
    .when("/admin-login", {
      templateUrl: "./app/views/admin-login.html",
      controller: "MainController",
    })
    .otherwise({ redirectTo: "/" });
});
