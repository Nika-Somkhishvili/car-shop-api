var express = require("express");
var router = express.Router();

var CarService = require("../services/CarService");
var ApiSecurity = require("../middlewares/apiSecurity");

router.get("/all", ApiSecurity.requireLogin, CarService.getAllCars);
router.get("/search", CarService.search);
router.get("/:id", CarService.getCar);
router.post("/", ApiSecurity.requirePermits("car.add"), CarService.addCar);
router.put(
  "/:id",
  ApiSecurity.requirePermits("car.update", "car.add"),
  CarService.updateCar
);

module.exports = router;
