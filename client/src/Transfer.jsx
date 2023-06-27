import { useState } from "react";
import server from "./server";
const { secp256k1} = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");


function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [privatekey, setPrivateKey] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const data = {sender: address, recipient,amount: parseInt(sendAmount)};
    const bytes = utf8ToBytes(JSON.stringify(data));
    const hash = keccak256(bytes);

    const signature = await secp256k1.sign(hash, privatekey, {recovered: true});
    console.log(signature[0]);
    const sig = Array.from(signature[0]);

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {...data, signature: sig, recovery: signature[1]});
        // sender: address,
        // amount: parseInt(sendAmount),
        // recipient,
      // });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
