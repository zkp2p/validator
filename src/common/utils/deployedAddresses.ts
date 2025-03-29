type Contracts = {
  [network: string]: {
    [contract: string]: string;
  };
};

export const contractAddresses: Contracts = {
  base_production: {
    escrow: "0xCA38607D85E8F6294Dc10728669605E6664C2D70",
    venmo: "0x9a733B55a875D0DB4915c6B36350b24F8AB99dF5",
    revolut: "0xAA5A1B62B01781E789C900d616300717CD9A41aB",
    cashapp: "0x76D33A33068D86016B806dF02376dDBb23Dd3703",
    wise: "0xFF0149799631D7A5bdE2e7eA9b306c42b3d9a9ca",
    mercadopago: "0x00D003C73EAB8fEaec04bab976235915fE7641e3",
  },
  base_staging: {
    escrow: "0xC8cd114C6274Ef1066840337E7678BC9731BEa68",
    venmo: "0xCE6454f272127ba69e8C8128B92F2388Ca343257",
    revolut: "0xb941e69B6C1A23A88cf9DA7D243bAE1D2Cb8eb6b",
    cashapp: "0xdDB9d452180398F456Fe89A43Df9C65B19756CEa",
    wise: "0x79F35E2f65ff917BE35686d34932C8Ef5a30631f",
    mercadopago: "0xCbdf76FD6231893E4E018B8720Df816cA49df33F",
  },
  sepolia_staging: {
    escrow: "0xFF0149799631D7A5bdE2e7eA9b306c42b3d9a9ca",
    venmo: "0x3Fa6C4135696fBD99F7D55B552B860f5df770710",
    revolut: "0x79820f039942501F412910C083aDA6dCc419B67c",
    cashapp: "0x3997dd7B691E11D45E8898601F5bc7B016b0d38B",
    wise: "0x7cF01c990F5E93Eb4eaaC2146dFeC525a9C87878",
    mercadopago: "0x294154683C012B67266D51538258012b26a95E6f",
  },
  localhardhat: {
    escrow: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
    venmo: "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9",
    revolut: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853",
    cashapp: "0x610178dA211FEF7D417bC0e6FeD39F05609AD788",
    wise: "0x0DCd1Bf9A1b36cE34237eEaFef220932846BCD82",
    mercadopago: "0x959922bE3CAee4b8Cd9a407cc3ac1C251C2007B1",
  },
};

export const escrowDeployedAtBlock = {
  base_production: 25303495,
  base_staging: 24990487,
  sepolia_staging: 7447830,
  localhardhat: 0,
};
