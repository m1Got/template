import { Fragment, hydrate } from "preact";
import { Products } from "./Products";
import { News } from "./News";

hydrate(<Products />, document.getElementById("products"));
hydrate(<News />, document.getElementById("news"));

console.log(2);
