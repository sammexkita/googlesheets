import { google } from "googleapis";

interface Sheet {
  name: string;
}

class CreateSheetService {
  execute({ name }: Sheet) {
    console.log(name);
  }
}

export default new CreateSheetService;