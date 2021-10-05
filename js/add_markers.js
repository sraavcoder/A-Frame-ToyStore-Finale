AFRAME.registerComponent("create-markers", {
    init: async function(){
        var mainScene = document.querySelector("#main-scene");
        var toys = await this.getToys();

        toys.map(toy => {
            var marker = document.createElement("a-marker");   
            marker.setAttribute("id", toy.id);
            marker.setAttribute("type", "pattern");
            marker.setAttribute("url", toy.marker_pattern_url);
            marker.setAttribute("cursor", {
              rayOrigin: "mouse"
            });
            marker.setAttribute("markerhandler", {});
            mainScene.appendChild(marker);

            var model = document.createElement("a-entity");         
            model.setAttribute("id", `model-${toy.id}`);
            model.setAttribute("position", toy.model_geometry.position);
            model.setAttribute("rotation", toy.model_geometry.rotation);
            model.setAttribute("scale", toy.model_geometry.scale);
            model.setAttribute("gltf-model", `url(${toy.model_url})`);
            model.setAttribute("gesture-handler", {});
            model.setAttribute("animation-mixer", {});
            marker.appendChild(model);

            // description Containerge
            var mainPlane = document.createElement("a-plane");
            mainPlane.setAttribute("id", `main-plane-${toy.id}`);
            mainPlane.setAttribute("position", { x: 0, y: 0, z: 0 });
            mainPlane.setAttribute("rotation", { x: -90, y: 0, z: 0 });
            mainPlane.setAttribute("width", 1.5);
            mainPlane.setAttribute("height", 1.5);
            mainPlane.setAttribute("material", { color: "#FDFF98" });
            marker.appendChild(mainPlane);

            // toy title background plane
            var titlePlane = document.createElement("a-plane");
            titlePlane.setAttribute("id", `title-plane-${toy.id}`);
            titlePlane.setAttribute("position", { x: 0, y: 0.89, z: 0.02 });
            titlePlane.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            titlePlane.setAttribute("width", 1.49);
            titlePlane.setAttribute("height", 0.3);
            titlePlane.setAttribute("material", { color: "#DC3546" });
            mainPlane.appendChild(titlePlane);

            // toy title
            var toyTitle = document.createElement("a-entity");
            toyTitle.setAttribute("id", `toy-title-${toy.id}`);
            toyTitle.setAttribute("position", { x: 0, y: 0, z: 0.1 });
            toyTitle.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            toyTitle.setAttribute("text", {
              font: "monoid",
              color: "black",
              width: 2.4,
              height: 1,
              align: "center",
              value: toy.toy.toUpperCase()
            });
            titlePlane.appendChild(toyTitle);

            // Description
            var description = document.createElement("a-entity");
            description.setAttribute("id", `description-${toy.id}`);
            description.setAttribute("position", { x: 0, y: 0.25, z: 0.1 });
            description.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            description.setAttribute("text", {
              font: "monoid",
              color: "brown",
              width: 1.4,
              height: 0.5,
              align: "center",
              value: toy.description
            });
            mainPlane.appendChild(description);

            var comesWith = document.createElement("a-entity");
            comesWith.setAttribute("id", `comes_with-${toy.id}`);
            comesWith.setAttribute("position", { x: 0, y: -0.25, z: 0.1 });
            comesWith.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            comesWith.setAttribute("text", {
              font: "monoid",
              color: "brown",
              width: 1.4,
              height: 0.5,
              align: "center",
              value: toy.comes_with
            });
            mainPlane.appendChild(comesWith);

            var age_group = document.createElement("a-entity");
            age_group.setAttribute("id", `age_group-${toy.id}`);
            age_group.setAttribute("position", { x: 0, y: -0.5, z: 0.1 });
            age_group.setAttribute("rotation", { x: 0, y: 0, z: 0 });
            age_group.setAttribute("text", {
              font: "monoid",
              color: "brown",
              width: 1.4,
              height: 0.5,
              align: "center",
              value: toy.age_group
            });
            mainPlane.appendChild(age_group);
        })
    },

    getToys: async function() {
        return await firebase
          .firestore()
          .collection("toys")
          .get()
          .then(snap => {
            return snap.docs.map(doc => doc.data());
          });
      }
})