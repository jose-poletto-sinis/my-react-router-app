import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
   route("/saludo", "routes/saludo.tsx", [
      route("borrar/:nombre/:id", "routes/borrar.tsx"),
      route("editar/:idAtributo", "routes/editar.tsx"),
      route("crear", "routes/crear.tsx")
   ]),
   index("routes/home.tsx")
] satisfies RouteConfig;
