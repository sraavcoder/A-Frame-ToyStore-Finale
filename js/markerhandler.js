var userId = null;
AFRAME.registerComponent("markerhandler",{
    init: async function(){
      var toys = await this.getToys();
        if(userId === null){
          this.askUserId();
        }
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
            }
          },
          closeOnClickOutside: false,
        }).then(inputValue =>{
          userId = inputValue;
        })
    },

    handleMarkerFound: function(toys, markerId){
        var tempToy = toys.filter(toy => toy.id === markerId);
        var toy = tempToy[0]
        if(toy.is_out_of_stock){
            swal({
                icon: "warning",
                title: toy.toy.toUpperCase(),
                text: "This toy is out of stock. So Sorry!!",
                timer: 3500,
                buttons:false,
            });
        } else{
            var model = document.querySelector(`#model-${toy.id}`);
            model.setAttribute("visible", true);

            var mainPlane = document.querySelector(`#main-plane-${toy.id}`);
            mainPlane.setAttribute("visible", true);

            var pricePlane = document.querySelector(`#price-plane-${toy.id}`);
            pricePlane.setAttribute("visible", true);

            // Changing button div visibility
            var buttonDiv = document.getElementById("button-div");
            buttonDiv.style.display = "flex"; 
            
            var summaryButton = document.getElementById("order-summary-button");
            var orderButtton = document.getElementById("order-button");
            var payButton = document.getElementById("pay-button")

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

            summaryButton.addEventListener("click", () => {
              // console.log("Handle Order Summary")
              this.handleOrderSummary();
            });

            payButton.addEventListener("click", () => {
              this.handlePayement();
            })
        }
    },

    handlePayement: function () {
        document.getElementById("modal-div").style.display = "none";
        var uID;
        userId <=9 ? (uID = `U0${userId}`) : (uID = `U${userId}`);

        firebase
          .firestore()
          .collection("users")
          .doc(uID)
          .update({
            current_orders: {},
            total_bill: 0
          })
          .then(() => {
            swal({
              icon: "success",
              title: "Thanks For Paying !",
              text: "We Hope You Liked Your Toy !!",
              timer: 3500,
              buttons: false
            });
          });
    },

    getOrderSummary: async function (uID) {
      return await firebase
      .firestore()
      .collection("users")
      .doc(uID)
      .get().then(doc => doc.data());
    },

    handleOrderSummary: async function(){
      var uID;
        userId <=9 ? (uID = `U0${userId}`) : (uID = `U${userId}`);

      var orderSummary = await this.getOrderSummary(uID);

      var modalDiv = document.getElementById("modal-div");
      modalDiv.style.display = "flex";
      var tableBodyTag = document.getElementById("bill-table-body");
      tableBodyTag.innerHTML = "";

      var currentOrders = Object.keys(orderSummary.current_orders);

      currentOrders.map(i => {
        var tr = document.createElement("tr");
        var item = document.createElement("td");
        var price = document.createElement("td");
        var quantity = document.createElement("td");
        var subtotal = document.createElement("td");
      
        item.innerHTML = orderSummary.current_orders[i].item;
        price.innerHTML = "₹" + orderSummary.current_orders[i].price;
        price.setAttribute("class", "text-center");
      
        quantity.innerHTML = orderSummary.current_orders[i].quantity;
        quantity.setAttribute("class", "text-center");
      
        subtotal.innerHTML = "₹" + orderSummary.current_orders[i].subtotal;
        subtotal.setAttribute("class", "text-center");
      
        tr.appendChild(item);
        tr.appendChild(price);
        tr.appendChild(quantity);
        tr.appendChild(subtotal);
        tableBodyTag.appendChild(tr);
      });
    
      var totalTr = document.createElement("tr");
    
      var td1 = document.createElement("td");
      td1.setAttribute("class", "no-line");
    
      var td2 = document.createElement("td");
      td1.setAttribute("class", "no-line");
    
      var td3 = document.createElement("td");
      td1.setAttribute("class", "no-line text-cente");
    
      var strongTag = document.createElement("strong");
      strongTag.innerHTML = "Total";
      td3.appendChild(strongTag);
    
      var td4 = document.createElement("td");
      td1.setAttribute("class", "no-line text-right");
      td4.innerHTML = "₹" + orderSummary.total_bill;
    
      totalTr.appendChild(td1);
      totalTr.appendChild(td2);
      totalTr.appendChild(td3);
      totalTr.appendChild(td4);
    
      tableBodyTag.appendChild(totalTr);
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
