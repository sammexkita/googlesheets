import express from "express";
import { google } from "googleapis";

const app = express();
app.use(express.json());

async function getAuthSheets () {
  const auth = new google.auth.GoogleAuth({
    keyFile: "credentials.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets"
  });

  const client = await auth.getClient();

  const spreadsheetId = "1vQo5rjO-pE8FKe_Vhj0g8P8CanRnPTQLBvmllGSrG6E";
  
  const googleSheets = google.sheets({
    version: "v4",
    auth: client,
  });

  return {
    auth, 
    client,
    spreadsheetId,
    googleSheets
  }
}

app.get("/metadata", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const metadata = await googleSheets.spreadsheets.get({
    auth,
    spreadsheetId,  
  });

  res.send(metadata.data);
});

app.get("/rows", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const getRows = await googleSheets.spreadsheets.values.get({
    auth,
    spreadsheetId,
    range: "UTMs"
  });
  
  res.send(getRows.data);
});

app.post("/create", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const { values } = req.body;

  const row = await googleSheets.spreadsheets.values.append({
    auth,
    spreadsheetId,
    range: "Página1",
    insertDataOption: "INSERT_ROWS",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: values
    }
  });

  return res.send(row.data);
});

app.post("/update", async (req, res) => {
  const { googleSheets, auth, spreadsheetId } = await getAuthSheets();

  const { values } = req.body;

  //Precisamos achar o range que está o valor recebido
 
  // const getRows = await googleSheets.spreadsheets.values.get({
  //   auth,
  //   spreadsheetId,
  //   range: "Página1!A:C"
  // });
  
  const getRows = await googleSheets.spreadsheets.getByDataFilter();

  return res.send(getRows);
  // if (getRows.data.values) {
  //   const result = await getRows.data.values;

  //   result.map(sh => { 
  //     if (JSON.stringify(sh) == JSON.stringify(values)) {
  //       console.log(sh);
  //       return 
  //     }
  //   });
  //   return res.send("Não encontrado!");
  // }
  
  // const row = await googleSheets.spreadsheets.values.update({
  //   auth,
  //   spreadsheetId,
  //   range: "Página1!A2:D2",
  //   valueInputOption: "USER_ENTERED",
  //   requestBody: {
  //     values: values
  //   }   
  // });

  // return res.send(row.data);

});

app.listen(3333, () => {
  console.log("Server running on port 3333 🚀");
});