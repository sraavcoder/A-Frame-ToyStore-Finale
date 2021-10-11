var userId = null;
AFRAME.registerComponent("markerhandler",{
    init: async function(){
        if(userId === null){
          this.askUserId();
        }
        var toys = await this.getToys();
        this.el.addEventListener("markerFound", ()=>{
          if (userId !== null){
            var markerId = this.el.id;
            this.handleMarkerFound(toys, markerId);
          }
        });
        this.el.addEventListener("markerLost", ()=>{
            this.handleMarkerLost();
        })
    },

    askUserId: function(){
        swal({
          title: "Welcome to Toy Shop!",
          icon: "https://us.123rf.com/450wm/svetlam87/svetlam871810/svetlam87181000048/114979737-toys-store-flat-vector-illustration.jpg?ver=6",
          content:{
            element: "input",
            attributes: {
              placeholder: "Type your uid Ex:( 1 or 2 or 21 )",
              type:"number",
              min: 1
            }
          },
          closeOnClickOutside: false,
        }).then(inputValue =>{
          userId = inputValue;
        })
    },
    handleMarkerFound: function(toys, markerId){
        var toy = toys.filter(toy => toy.id === markerId[0]);
        if(toy.is_out_of_stock === true){
            swal({
                icon: "warning",
                title: toy.toy.toUpperCase(),
                text: "This toy is out of stock. So Sorry!!",
                timer: 3500,
                buttons:false,
            })
        }
        else{
            var model = document.getElementById(`model-${toy.id}`);
            model.setAttribute("visible", true);

            var mainPlane = document.getElementById(`main-plane-${toy.id}`);
            mainPlane.setAttribute("visible", true);

            var priceplane = document.getElementById(`price-plane-${toy.id}`);
            priceplane.setAttribute("visible", true)

            // Changing button div visibility
            var buttonDiv = document.getElementById("button-div");
            buttonDiv.style.display = "flex"; 
            var summaryButton = document.getElementById("order-summary-button");
            var orderButtton = document.getElementById("order-button");
            summaryButton.addEventListener("click", function () {
              swal({
                icon: "warning",
                title: "Order Summary",
                text: "Work In Progress"
              });
            });
        
            orderButtton.addEventListener("click", () => {
              var uID;
              userId <=9 ? (uID = `U0${userId}`) : (uID = `U${userId}`);
              this.handleOrder(uID, toy)
              swal({
                icon: "https://i.imgur.com/4NZ6uLY.jpg",
                title: "Thanks For Order !",
                text: "Your order will be there with you soon!",
                timer: 3500,
                buttons: false
              });
            });
        }
    },
    handleMarkerLost: function(){
        var buttondiv = document.getElementById("button-div");
        buttondiv.style.display = "none"
    },

    handleOrder: function(uid, toy){
      firebase.firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then(doc => {
        var details = doc.data();
        
        if(details["current_orders"][toy.id]){
          details["current_orders"][toy.id]["quantity"] += 1;
          var currentQuantity = details["current_orders"][toy.id]["quantity"];
          details["current_orders"][toy.id]["subtotal"] = currentQuantity * toy.price;
        }else{
          details["current_orders"][toy.id] = {
            item: toy.toy,
            price: toy.price,
            quantity: 1,
            subtotal: currentQuantity * 1
          };
        }

        details.total_bill += toy.price

        firebase.firestore()
        .collection("users")
        .doc(doc.id)
        .update(details)
      })
    },  

    getToys: async function () {
        return await firebase
          .firestore()
          .collection("toys")
          .get()
          .then(snap => {
            return snap.docs.map(doc => doc.data());
          });
      },
})
