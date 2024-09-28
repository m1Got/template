import "htmx.org";
import Alpine from "alpinejs";
import "./components"

import "../styles/app.css";

window.Alpine = Alpine;

Alpine.store("shop", {
  name: "Alpine-Shop",
  products: ["Swiss Alp Chocolate", "Car Alpine A110", "Car Alpine A110", "Car Alpine A110"],
});


Alpine.start();


