import { useEffect, useState } from "react";
import { MainContract } from "../contracts/MainContract";
import { useTonClient } from "./useTonClient";
import { useTonConnect } from "./useTonConnect";
import { useAsyncInitialize } from "./useAsyncInitialize";
import { Address, OpenedContract, toNano } from "ton-core"

export function useMainContract() {
  const client = useTonClient();
  const { sender } = useTonConnect();

  const [contractData, setContractData] = useState<null | {
    counter_value: number;
    recent_sender: Address;
    owner_address: Address;
  }>();

  const [balance, setBalance] = useState<null | number>(0);

  const sleep = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

  const mainContract = useAsyncInitialize(async () => {
    if (!client) return;
    const contract = new MainContract(
      Address.parse("EQAtZuadBwi2IZM51vCXfAIn3Inh8o6aMqt3ztStAK-pMW1v")
    );
    return client.open(contract) as OpenedContract<MainContract>;
  }, [client]);

  useEffect(() => {
    async function getValue() {
      if (!mainContract) return;
      setContractData(null);
      const val = await mainContract.getData();
      const contractBalance = await (await mainContract.getBalance()).balance
      setContractData({
        counter_value: val.number,
        recent_sender: val.recent_sender,
        owner_address: val.owner_address,
      });

      setBalance(contractBalance);

      await sleep(5000);
      getValue();
    }
    getValue();
  }, [mainContract]);

  return {
    contract_address: mainContract?.address.toString(),
    contract_balance: balance,
    ...contractData,
    sendIncrement: () => {
      return mainContract?.sendIncrement(sender, toNano(0.005), 3);
    },
    sendDeposit: () => {
      return mainContract?.sendDesposit(sender, toNano(1));
    },
    sendWithdrawalRequest: () => {
      return mainContract?.sendWithdrawalRequest(sender, toNano(0.005), toNano(1));
    }
  };
}