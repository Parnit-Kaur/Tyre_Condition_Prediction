// the link to model provided by Teachable Machine export panel
var url = "https://teachablemachine.withgoogle.com/models/nIo_jEpOm/"

// two variables to help manipulate image and file upload
var inp = document.getElementById("image-selector");

var upl = document.getElementsByClassName("upload-btn-wrapper")[0];

// Drag and drop

//drag function
upl.addEventListener("dragover", function(event) {
    //allowing event dragover to happen (Prevent file from being opened)
    event.preventDefault();
})

//drop function
upl.addEventListener("drop", function(event) {
    event.preventDefault();
    // DataTransfer object to hold the data that is being dragged
    inp.files = event.dataTransfer.files;
    // read file contents
    let reader = new FileReader();
    //when loads function
    reader.onload = function() {
        let dataURL = reader.result;
        $("#selected-image").attr("src", dataURL);
        //what to show when file is uploaded (button and image w/ container)
        $("#prediction-list").empty();
        $("#explanation-list").empty();
        $("#predict-button").show();
        $(".image-container").show();
        $(".upload-btn-wrapper").show();
        $(".predict").hide();
    }
    //show image on screen
    let file = $("#image-selector").prop('files')[0];
    reader.readAsDataURL(file);
    $(".predict-btn-wrapper").show()
})

//upload file function
$(async function() {
    // predict button and image container only appear after image is loaded
    await $("#predict-button").hide();
    await $(".image-container").hide();
    $("#image-selector").change(function() {
        $(".upload-btn-wrapper").hide();
        let reader = new FileReader();
        reader.onload = function() {
            let dataURL = reader.result;
            $("#selected-image").attr("src", dataURL); 
            //Get rid of any previous predictions that were being displayed for previous images.
            $("#prediction-list").empty();
            $("#explanation-list").empty();
            $(".confirmation-text").hide();
            $("#predict-button").show();
            $(".image-container").show();
            $(".predict").hide();
        }
        let file = $("#image-selector").prop('files')[0];
        reader.readAsDataURL(file);
        $(".predict-btn-wrapper").show();
    });

    // load the model and metadata from Teachable Machine

    //Await key word pauses the execution of this function until the promise is resolved and the model is loaded. 
    model = await tmImage.load(url + "model.json", url + "metadata.json")
    $(".progress").hide();
    //this line of code from https://teachablemachine.withgoogle.com/ to make prediction
    maxPredictions = model.getTotalClasses();

    $("#predict-button").click(async function() {
        $(".predict-btn-wrapper").hide()
        //show prediction on screen
        $(".predict").show();
        var prediction = await model.predict(document.getElementById("selected-image"));
        var fails = 0;
        console.log(prediction)
        //for loop
        //Print classification (executing setP function) on screen if prediction is equal or more than 60% accurate
        for (var i = 0; i < prediction.length; i++) {
            console.log(prediction[i.toString()]);
            if (prediction[i.toString()].probability > 0.6) {
                //Test if there is prediction
                console.log("Prediction Valid");

                if (prediction[i.toString()].probability >= 0.6 && prediction[i.toString()].className.toString().charAt(0) == "M") {
                    setP("<p>Main Course</p>");
                } else if (prediction[i.toString()].probability >= 0.6 && prediction[i.toString()].className.toString().charAt(0) == "A") {
                    setP("<p>Appetizer</p>");
                } else if (prediction[i.toString()].probability >= 0.6 && prediction[i.toString()].className.toString().charAt(0) == "D") {
                    setP("<p>Dessert</p>");
                } 
                
            } 
        }
        //Runtime error handling
        console.log(fails)
        if (fails == 1) {
            setP("Unable to identify. Please try again with another photo.");
        }
        //scrolls to bottom of screen to see prediction
        window.scrollTo(0, document.body.scrollHeight);
    })
})

//Function to show final prediction
function setP(a) {
    $(".upload-btn-wrapper").show();
    $("#prediction-list").html(a);
}
