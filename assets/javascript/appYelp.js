// Initialize Firebase
var config = {
    apiKey: "AIzaSyDYKJVKrHI4Vb9oexmK8oMEPmRClVLPap4",
    authDomain: "kiss-d14dd.firebaseapp.com",
    databaseURL: "https://kiss-d14dd.firebaseio.com",
    projectId: "kiss-d14dd",
    storageBucket: "kiss-d14dd.appspot.com",
    messagingSenderId: "439034791894"
};
    firebase.initializeApp(config);

var database = firebase.database();

//Submit the dinner parameters
$(".submitButton").on("click", function (event) {
    event.preventDefault();
    var cuisineInput = $("#cuisine").val();
    var locationInput = $("#zipCode").val();
    var priceRangeInput = $("#priceRange").val();
     fetchYelpData(cuisineInput, locationInput, priceRangeInput);
});

//CORS Proxy  - API Call
function fetchYelpData(cuisine, location, price, distance) {
    var key = 'N71fJPYXPo7eQVD87aDPokrxUwcsIhaNcNFsw7kJonGf8yy9ZlND-h5ADN_Qa9YqhgDtbS1sYp6ZpemynDjnCHADynlNQ-ic9xtxpxKCeQ4boT1rB2woRDih94CtWnYx';
    var corsProxy = "https://cors-anywhere.herokuapp.com/";
    //Params links back to HTML class
    var params = $.param({
        "term": cuisine,
        "location": location,
        "price": price,
        "limit": "50",
        "sort by": "rating",
    });
    console.log(params);

    var url = corsProxy + "https://api.yelp.com/v3/businesses/search?" + params;

    function onSuccess(data) {
        console.log("API request success");
        console.log(data);
    }

    function onFailure(data) {
        console.log("API request failed");
        console.log(data);
    }

    // YELP! API Request
    function fetchData() {
        $.ajax({
            url: url,
            type: 'GET',
            beforeSend: function (xhr) {
                xhr.setRequestHeader('Authorization', 'Bearer ' + key);
            }

        }).done(function (response) {
            var randomArray = Math.floor((Math.random() * response.businesses.length) + 0);
            var cuisine = response.businesses[randomArray].categories[0].title;
            var name = response.businesses[randomArray].name;
            var address = response.businesses[randomArray].location.display_address;
            var phone = response.businesses[randomArray].display_phone;
            var price = response.businesses[randomArray].price;
            var distance = response.businesses[randomArray].distance;
            var rating = response.businesses[randomArray].rating;

            $(".cuisine").text(cuisine);
            $(".name").text(name);
            $(".address").text(address);
            $(".phone").text(phone);
            $(".rating").text(rating);
            $(".price").text(price);
            $(".review").text(rating);
            // $(".distance").text(rating);

        var database = firebase.database();
            database.ref('Restaurant').set(response)

        }).catch(function (error) {
            console.log(error);
        })
        return {
            fetchData: fetchData,
            url: url
        }
    }
    fetchData();
};