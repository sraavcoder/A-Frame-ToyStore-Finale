AFRAME.registerComponent("markerhandler",{
    init: async function(){
        this.el.addEventListener("markerFound", ()=>{
            console.log("marker found");
            this.handleMarkerFound();
        });
        this.el.addEventListener("markerLost", ()=>{
            console.log("marker lost");
            this.handleMarkerLost();
        })
    },
    handleMarkerFound: function(){
        var buttondiv = document.getElementById("button-div");
        buttondiv.style.display = "flex"
        var ratingButton = document.getElementById("order-button");
        var orderButton = document.getElementById("order-summary-button");
        ratingButton.addEventListener("click",function(){
            swal({
                icon:"warning",
                title:"Order Summary",
                text:"Work in progress"
            })
        })
        orderButton.addEventListener("click",function(){
            swal({
                icon:"https://i.imgur.com/4NZ6uLY.jpg",
                title:"Thanks for your order!!",
                text:"your order will be there with you soon"
            })
        })
    },
    handleMarkerLost: function(){
        var buttondiv = document.getElementById("button-div");
        buttondiv.style.display = "none"
    }
})
