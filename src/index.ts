import axios from "axios";
import { Collection, NFT, NFTRevision } from "./types";
import { ERRORS, URLS } from "./constants";

//BASE URL for all the axios connections
const BASE_URL: string = URLS.BASE_URL;

//Create Headers for all the axios request
const getHeaders = ({ token }: { token: string }) => {
  if (token)
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  else throw { code: 401 };
};

//Create Custom Error Messages
const generateError = (error) => {
  let { code, response } = error;
  let status = response?.status || code || "TRY_AGAIN";
  const err: errorObject = {
    ...ERRORS[status],
    code: Number(ERRORS[status].code),
    docs: URLS.DOCS_URL,
  };
  return err;
};

const fetchCollectionsAPI = async ({
  token,
  perPage,
  currentPageNumber,
}: {
  token: string;
  perPage?: number;
  currentPageNumber?: number;
}) => {
  try {
    let requestUrl = `${BASE_URL}/collections`;
    //currentPageNumber => pageNumber must starts form 1, Default 0
    //perPage => Default perPage is always 10
    requestUrl += `?perPage=${perPage || 10}&pageNumber=${
      currentPageNumber || 1
    }`;
    const { data } = await axios.get(requestUrl, getHeaders({ token }));
    return data as Collection[];
  } catch (error) {
    throw generateError(error);
  }
};

const fetchCollectionAPI = async ({ token, collectionId }) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/collections/${collectionId}`,
      getHeaders({ token })
    );
    return data as Collection;
  } catch (error) {
    throw generateError(error);
  }
};

const addCollectionAPI = async ({ token, info }) => {
  try {
    const { data } = await axios.post(
      `${BASE_URL}/collections`,
      {
        collectionName: info.name,
        collectionURI: info.uri,
      },
      getHeaders({ token })
    );
    return data as Collection;
  } catch (error) {
    throw generateError(error);
  }
};

const addNFTAPI = async ({
  token,
  collectionId,
  info,
}: {
  token: any;
  collectionId?: string;
  info: any;
}) => {
  try {
    const tokenObj = {
      tokenId: info.tokenId,
      name: info.name,
      image: info.image,
      description: info.description,
      metaData: info.metaData,
    };
    if (collectionId) {
      const { data } = await axios.post(
        `${BASE_URL}/collections/${collectionId}/nfts`,
        tokenObj,
        getHeaders({ token })
      );
      return data as NFT;
    }
    const { data } = await axios.post(
      `${BASE_URL}/nfts/addnft`,
      tokenObj,
      getHeaders({ token })
    );
    return data as NFT;
  } catch (error) {
    throw generateError(error);
  }
};

const updateNFTAPI = async ({ token, nftId, info }) => {
  try {
    const { data } = await axios.put(
      `${BASE_URL}/nfts/${nftId}`,
      {
        tokenId: info.tokenId,
        name: info.name,
        image: info.image,
        description: info.description,
        metaData: info.metaData,
      },
      getHeaders({ token })
    );
    return data;
  } catch (error) {
    throw generateError(error);
  }
};

const fetchCollectionNFTsAPI = async ({ token, collectionId }) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/collections/${collectionId}/nfts`,
      getHeaders({ token })
    );
    return data.map((nft: NFT) => {
      try {
        const nftEntity: NFTEntity = {
          ...nft,
          metaData: JSON.parse(nft.metaData),
        };
        if (nftEntity.id) {
          return { ...nftEntity, message: "ID exists" };
        }
        return nftEntity;
      } catch (error) {
        const nftEntity: NFTEntity = { ...nft, metaData: [] };
        return nftEntity;
      }
    }) as NFTEntity[];
  } catch (error) {
    throw generateError(error);
  }
};

const fetchNFTsAPI = async ({
  token,
  perPage,
  currentPageNumber,
}: {
  token: string;
  perPage?: number;
  currentPageNumber?: number;
}) => {
  try {
    let requestUrl = `${BASE_URL}/nfts`;
    //currentPageNumber => pageNumber must starts form 1, Default 0
    //perPage => Default perPage is always 10
    requestUrl += `?perPage=${perPage || 10}&pageNumber=${
      currentPageNumber || 1
    }`;
    const { data } = await axios.get(requestUrl, getHeaders({ token }));
    return data.map((nft: NFT) => {
      try {
        const nftEntity: NFTEntity = {
          ...nft,
          metaData: JSON.parse(nft.metaData),
        };
        if (nftEntity.id) {
          return { ...nftEntity, message: "ID exists" };
        }
        return nftEntity;
      } catch (error) {
        const nftEntity: NFTEntity = { ...nft, metaData: [] };
        return nftEntity;
      }
    }) as NFTEntity[];
  } catch (error) {
    throw generateError(error);
  }
};

const fetchNFTAPI = async ({ token, nftId }) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/nfts/${nftId}`,
      getHeaders({ token })
    );
    try {
      data.metaData = JSON.parse(data.metaData);
    } catch (error) {
      data.metaData = {};
    }
    return data as NFTEntity;
  } catch (error) {
    throw generateError(error);
  }
};

const fetchRevisionsAPI = async ({ token, nftId }) => {
  try {
    const { data } = await axios.get(
      `${BASE_URL}/nfts/${nftId}/revisions`,
      getHeaders({ token })
    );
    try {
      data.metaData = JSON.parse(data.metaData);
      data.revisions = data.revisions.map((rev) => {
        try {
          rev.metaData = JSON.parse(rev.metaData);
        } catch (error) {
          rev.metaData = [];
        }
        return rev;
      });
      return data as RevisionList;
    } catch (error) {
      throw {
        response: { data: { code: "INVMD", message: "Invalid metadata" } },
      };
    }
  } catch (error) {
    throw generateError(error);
  }
};

const deleteNFTAPI = async ({ token, tokenId }) => {
  try {
    const { data } = await axios.delete(
      `${BASE_URL}/nfts/${tokenId}`,
      getHeaders({ token })
    );
    return data;
  } catch (error) {
    throw generateError(error);
  }
};

interface errorObject {
  code: number;
  message: string;
  description?: string;
  docs: string;
}
export interface TokenDataPartial {
  name: string;
  image: string;
  tokenId: string;
  description?: string;
}

export interface paginationConfig {
  perPage: number;
  currentPage: number;
}

export type Attribute = { [keys in string]: string | number };

export interface RevisionList extends Omit<NFT, "metaData"> {
  metaData: Attribute[];
  revisions: NFTRevisionEntity[];
  collection: Collection;
}
export interface NFTEntity extends Omit<NFT, "metaData"> {
  metaData: Attribute[];
}
export interface NFTRevisionEntity extends Omit<NFTRevision, "metaData"> {
  metaData: Attribute[];
}

class NFTObj {
  private auth: string | undefined;
  private nft: NFTEntity;

  constructor({ auth, nft }: { auth: string; nft: NFTEntity }) {
    this.auth = auth;
    this.nft = nft;
  }

  private metaDataAsMap() {
    return this.nft.metaData.reduce(
      (newObj: { [i in string]: string | number }, cur) => {
        if (!newObj) newObj = {};
        newObj[Object.keys(cur)[0]] = cur[Object.keys(cur)[0]];
        return newObj;
      }
    );
  }

  private setMetaData(obj: { [x in string]: number | string }) {
    const d = Object.keys(obj).map((key) => {
      const newObj = {};
      newObj[key] = obj[key];
      return newObj;
    });
    this.nft.metaData = d;
  }

  setProperty(key: string, value: string | number) {
    const metaData = this.metaDataAsMap();
    // let isNewProperty = true;
    // this.nft.metaData = this.nft.metaData.map((attr: Attribute) => {
    //   const temp = {...attr};
    //   if (Object.keys(temp)[0] === key) {
    //     isNewProperty = false;
    //     temp[key] = value;
    //   }
    //   return temp;
    // })
    // if (isNewProperty) {
    //   const o = {};
    //   o[key] = value;
    //   this.nft.metaData.push(o);
    // }
    metaData[key] = value;
    this.setMetaData(metaData);
    return this;
  }

  deleteProperty(key: string) {
    this.nft.metaData = this.nft.metaData.filter(
      (attr: Attribute) => Object.keys(attr)[0] !== key
    );
    return this;
  }

  setName(name: string) {
    this.nft.name = name;
    return this;
  }

  setImage(image: string) {
    this.nft.image = image;
    return this;
  }

  setTokenId(tokenId: string) {
    this.nft.tokenId = tokenId;
    return this;
  }

  setDescription(description: string) {
    this.nft.description = description;
    return this;
  }

  save() {
    return updateNFTAPI({
      token: this.auth,
      nftId: this.nft.id,
      info: {
        tokenId: this.nft.tokenId,
        name: this.nft.name,
        image: this.nft.image,
        description: this.nft.description,
        metaData: this.nft.metaData,
      },
    });
  }

  // export() {
  //   return "ipfs://...";
  // }

  async revisions() {
    return (await fetchRevisionsAPI({ token: this.auth, nftId: this.nft.id }))
      .revisions;
  }

  async revisionsLink() {
    return `${URLS.REVISE_URL}/revision/${this.nft.id}`;
  }
}

//Exported for Usage of SDK
export class Revise {
  private auth: string | undefined;
  constructor(values: { auth: string }) {
    if (!values) {
      console.log(ERRORS.TOKEN.NOT_INITIALIZED);
      process.exit(1);
    }
    const { auth } = values;
    this.auth = auth;
  }

  fetchCollections = async (config: paginationConfig) => {
    try {
      const { perPage, currentPage } = config;
      return await fetchCollectionsAPI({
        token: this.auth,
        perPage,
        currentPageNumber: currentPage,
      });
    } catch (error) {
      throw { ...error };
    }
  };

  fetchCollection = async (collectionId) => {
    try {
      return await fetchCollectionAPI({ token: this.auth, collectionId });
    } catch (error) {
      throw { ...error };
    }
  };

  addCollection = async ({ name, uri }) => {
    try {
      return await addCollectionAPI({ token: this.auth, info: { name, uri } });
    } catch (error) {
      throw { ...error };
    }
  };

  addNFT = async (
    tokenData: TokenDataPartial,
    properties: Attribute[],
    collectionId?: string
  ) => {
    try {
      const { tokenId, name, image, description } = tokenData;
      const info = {
        tokenId,
        name,
        image,
        description: description || "",
        metaData: properties,
      };
      if (collectionId) {
        return await addNFTAPI({ token: this.auth, collectionId, info });
      } else return await addNFTAPI({ token: this.auth, info });
    } catch (error) {
      throw { ...error };
    }
  };

  updateNFT = async (nftId: string) => {
    try {
      return await this.nft(await this.fetchNFT(nftId));
    } catch (error) {
      throw { ...error };
    }
  };

  nft = async (nft: NFTEntity) => {
    try {
      return new NFTObj({ auth: this.auth, nft });
    } catch (error) {
      throw { ...error };
    }
  };

  fetchNFTs = async ({
    collectionId = undefined,
    config,
  }: {
    collectionId?: string;
    config?: paginationConfig;
  }) => {
    try {
      const { perPage, currentPage } = config || {};
      if (collectionId)
        return await fetchCollectionNFTsAPI({ token: this.auth, collectionId });
      else
        return await fetchNFTsAPI({
          token: this.auth,
          perPage,
          currentPageNumber: currentPage,
        });
    } catch (error) {
      throw { ...error };
    }
  };

  fetchNFT = async (nftId: string) => {
    try {
      return await fetchNFTAPI({ token: this.auth, nftId });
    } catch (error) {
      throw { ...error };
    }
  };

  deleteNFT = async (nftId: string) => {
    try {
      return await deleteNFTAPI({ token: this.auth, tokenId: nftId });
    } catch (error) {
      throw { ...error };
    }
  };

  fetchRevisions = async (nftId: string) => {
    try {
      return await fetchRevisionsAPI({ token: this.auth, nftId });
    } catch (error) {
      throw { ...error };
    }
  };

  every = async (durationString: string) => {
    try {
      return new Automation(new Duration(durationString));
    } catch (error) {
      throw { ...error };
    }
  };

  // exportCollection(collectionId: string) {
  //   return "ipfs://...";
  // }
}

class Automation {
  private apiResolver: Function;
  private duration: Duration;

  constructor(duration: Duration) {
    this.duration = duration;
  }

  public listenTo(api: string | Function) {
    if (typeof api !== "string" && typeof api !== "function") {
      throw new Error("invalid API source shared");
    }
    if (typeof api === "string") {
      this.apiResolver = async () => (await axios.get(api)).data;
    }
    if (typeof api === "function") {
      this.apiResolver = api;
    }
    return this;
  }
  public async start(cb: Function) {
    const data = await this.apiResolver();
    cb(data);
    setTimeout(() => {
      this.start(cb);
    }, this.duration.getMiliseconds());
  }
}

class Duration {
  private durationString: string;
  private miliseconds: number;

  constructor(durationString: string) {
    this.durationString = durationString;
  }
  public getMiliseconds() {
    try {
      if (this.durationString.toLowerCase().includes("s")) {
        const data = this.durationString.toLowerCase().split("m")[0];
        return parseInt(data) * 1000;
      }
      if (this.durationString.toLowerCase().includes("m")) {
        const data = this.durationString.toLowerCase().split("m")[0];
        return parseInt(data) * 60000;
      }
      if (this.durationString.toLowerCase().includes("h")) {
        const data = this.durationString.toLowerCase().split("m")[0];
        return parseInt(data) * 3600000;
      }
    } catch (error) {
      throw new Error("Invalid time format passed");
    }
  }
}
