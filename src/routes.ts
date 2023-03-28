import { Request, Response } from "express";
import CreateSheetsService from "./controllers/CreateSheetsService";

export function createSheets(req: Request, res: Response) {
  const { name } = req.body;

  CreateSheetsService.execute({
    name
  });

  return res.send();
}