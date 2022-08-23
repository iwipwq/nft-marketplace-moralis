import Moralis from "moralis-v1/node.js";
import "dotenv/config";
import contractAddresses from "./constants/networkMapping.json";

const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;
const appId = process.env.NEXT_PUBLIC_APP_ID;
const masterKey = process.env.masterKey;

const FindQuery = async () => {
  await Moralis.start({ serverUrl, appId, masterKey });
  // const ActiveItem = Moralis.Object.extend("ActiveItem");
  const query = new Moralis.Query("ActiveItem");
  query.equalTo("nftAddress","0xe7f1725e7734ce288f8367e1bb143e90bb3f0512")
  const results2 = await query.first();
  console.log(results2);
};

FindQuery()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
