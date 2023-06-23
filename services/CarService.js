const CarModel = require("../models/car");
const ApiResponse = require("../utils/ApiResponse");

module.exports = {
  getAllCars: async (req, res) => {
    try {
      const cars = await CarModel.find({});
      ApiResponse.success(res, cars);
    } catch (error) {
      ApiResponse.failure(res, error, "error_on_getAllCars");
    }
  },

  getCar: async (req, res) => {
    try {
      const car = await CarModel.findById(req.params.id);
      ApiResponse.success(res, car);
    } catch (error) {
      ApiResponse.failure(res, error, "error_on_getCar");
    }
  },

  addCar: async (req, res) => {
    try {
      const body = req.body;
      const requiredFields = ["modelName", "color", "vin"];
      for (const field of requiredFields) {
        if (!body[field]) {
          return ApiResponse.failure(res, {}, `${field} is missing`, 400);
        }
      }
      const result = await new CarModel(body).save();
      ApiResponse.success(res, result);
    } catch (error) {
      ApiResponse.failure(res, error, "error_on_addCar");
    }
  },

  updateCar: async (req, res) => {
    try {
      const rec = await CarModel.findByIdAndUpdate(
        {
          _id: req.params.id,
        },
        {
          $set: req.body,
        },
        {
          new: true,
        }
      );
      if (!rec) {
        return ApiResponse.failure(res, {}, "record_not_found", 404);
      }
      ApiResponse.success(res, rec);
    } catch (error) {
      ApiResponse.failure(res, error, "error_on_updateCar");
    }
  },

  search: async (req, res) => {
    try {
      const query = req.query;
      let skip = 0;
      let limit = 10;
      if (query.skip) {
        skip = +query.skip;
      }
      if (query.limit) {
        limit = +query.limit;
      }
      const queryForSearch = {};
      if (req.query.searchText) {
        queryForSearch.$or = [
          {
            modelName: new RegExp(`.*${req.query.searchText}.*`, "i"),
          },
          {
            color: new RegExp(`.*${req.query.searchText}.*`, "i"),
          },
          {
            vin: new RegExp(`.*${req.query.searchText}.*`, "i"),
          },
        ];
      }
      const result = await CarModel.find(queryForSearch)
        .sort({ createdAt: 1 })
        .skip(skip)
        .limit(limit)
        .lean();
      ApiResponse.success(res, result);
    } catch (error) {
      ApiResponse.failure(res, error, "error_on_search");
    }
  },
};
