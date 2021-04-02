import multer from "multer";

import { CreateCarController } from "@modules/cars/useCases/createCar/CreateCarController";
import { CreateSpecificationController } from "@modules/cars/useCases/createSpecification/CreateSpecificationController";
import { ListCategoriesController } from "@modules/cars/useCases/listCategories/ListCategoriesController";
import { UploadCarImagesController } from "@modules/cars/useCases/uploadCarImages/UploadCarImagesController";
import { Router } from "express";
import { ensureAdmin } from "../middlewares/ensureAdmin";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
import uploadConfig from "@config/uploads";


const carsRoutes = Router();

const createCarController = new CreateCarController();
const listAvailableCarsController = new ListCategoriesController();
const createCarSpecificationController = new CreateSpecificationController();
const uploadCarImageController = new UploadCarImagesController();

const upload = multer(uploadConfig.upload("./tmp/cars"));

carsRoutes.post("/", ensureAuthenticated, ensureAdmin, createCarController.handle);

carsRoutes.get("/available", listAvailableCarsController.handle);

carsRoutes.post("/specifications/:id", ensureAuthenticated, ensureAdmin, createCarSpecificationController.handle);

carsRoutes.post("/images:/id", ensureAuthenticated, ensureAdmin, upload.array("images"), uploadCarImageController.handle)

export { carsRoutes };